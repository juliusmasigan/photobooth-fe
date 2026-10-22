import { useCallback, useEffect, useRef, useState } from 'react';

// Relay endpoint on the camera backend that pairs a booth with phone remotes.
// Defaults to the camera websocket URL with its trailing /ws swapped for /ws/remote.
const cameraWebsocketUrl = process.env.REACT_APP_CAMERA_WEBSOCKET_URL || 'ws://localhost:8080/ws';
export const remoteWebsocketUrl = process.env.REACT_APP_REMOTE_WEBSOCKET_URL || cameraWebsocketUrl.replace(/\/ws\/?$/, '/ws/remote');

const MAX_BACKOFF_MS = 10000;

// Join a remote-control session as the 'booth' or a 'remote'. The relay forwards
// booth messages to every remote and remote messages to the booth, and emits
// presence events (remote_joined/remote_left to the booth, booth_joined/booth_left
// to remotes) which are tracked here and also passed through to onMessage.
const useRemoteSession = ({ sessionId, role, onMessage }) => {
  const [connected, setConnected] = useState(false);
  const [peerCount, setPeerCount] = useState(0);
  const [boothPresent, setBoothPresent] = useState(false);
  const wsRef = useRef(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!sessionId) return undefined;

    let closedByUs = false;
    let retryTimer = null;
    let backoff = 1000;

    const connect = () => {
      const ws = new WebSocket(`${remoteWebsocketUrl}/${encodeURIComponent(sessionId)}?role=${role}`);
      wsRef.current = ws;

      // Handlers of a socket we've already abandoned must not touch state.
      const isStale = () => closedByUs || ws !== wsRef.current;

      ws.onopen = () => {
        if (isStale()) return;
        backoff = 1000;
        setConnected(true);
      };

      ws.onmessage = (event) => {
        if (isStale()) return;
        let data;
        try {
          data = JSON.parse(event.data);
        } catch (err) {
          console.warn('Received non-JSON remote message:', event.data);
          return;
        }

        if (data.type === 'remote_joined' || data.type === 'remote_left') {
          setPeerCount(data.count ?? 0);
        } else if (data.type === 'booth_joined') {
          setBoothPresent(true);
        } else if (data.type === 'booth_left') {
          setBoothPresent(false);
        }

        if (onMessageRef.current) onMessageRef.current(data);
      };

      ws.onerror = (error) => {
        if (isStale()) return;
        console.error('Remote WebSocket Error:', error);
      };

      ws.onclose = () => {
        if (isStale()) return;
        setConnected(false);
        setPeerCount(0);
        setBoothPresent(false);
        // Reconnect with exponential backoff
        retryTimer = setTimeout(connect, backoff);
        backoff = Math.min(backoff * 2, MAX_BACKOFF_MS);
      };
    };

    connect();

    return () => {
      closedByUs = true;
      clearTimeout(retryTimer);
      setConnected(false);
      setPeerCount(0);
      setBoothPresent(false);
      const ws = wsRef.current;
      wsRef.current = null;
      if (!ws) return;
      if (ws.readyState === WebSocket.CONNECTING) {
        // Closing mid-handshake makes the browser log an error (e.g. on StrictMode's
        // dev double-mount), so let it finish connecting and close it then.
        ws.onmessage = null;
        ws.onerror = null;
        ws.onclose = null;
        ws.onopen = () => ws.close();
      } else {
        ws.close();
      }
    };
  }, [sessionId, role]);

  const send = useCallback((message) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }, []);

  return { connected, peerCount, boothPresent, send };
};

export default useRemoteSession;
