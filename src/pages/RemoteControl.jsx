import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useRemoteSession from '../hooks/useRemoteSession';
import FilterPicker from '../components/FilterPicker';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
const STATE_TIMEOUT_MS = 5000; // Give up waiting for the booth after this long

// Height of the area the page can actually use. Mobile browsers count their
// toolbars in 100vh, and older ones lack dvh, so measure it instead.
const visibleHeight = () => Math.round(window.visualViewport?.height || window.innerHeight);

// Phone-side remote for the capture screen, opened by scanning the booth's QR code
const RemoteControl = () => {
  const { sessionId } = useParams();
  const [boothState, setBoothState] = useState(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const streamImgRef = useRef(null);
  const [previewAttempt, setPreviewAttempt] = useState(0);
  const [previewError, setPreviewError] = useState(false);
  const previewRetryRef = useRef(null);
  const [filterTray, setFilterTray] = useState(null);
  const [viewportHeight, setViewportHeight] = useState(visibleHeight);

  useEffect(() => {
    const update = () => setViewportHeight(visibleHeight());
    window.addEventListener('resize', update);
    window.visualViewport?.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
    };
  }, []);

  const { connected, send } = useRemoteSession({
    sessionId,
    role: 'remote',
    onMessage: (msg) => {
      if (msg.type === 'booth_state') {
        setBoothState(msg);
        setSessionEnded(false);
      } else if (msg.type === 'booth_joined') {
        send({ type: 'remote_hello' });
      } else if (msg.type === 'booth_left') {
        setBoothState(null);
        setSessionEnded(true);
      }
    }
  });

  // Ask the booth for its state as soon as we're connected
  useEffect(() => {
    if (connected) send({ type: 'remote_hello' });
  }, [connected, send]);

  // No booth answered: the code is stale (booth moved on or session never existed)
  useEffect(() => {
    if (!connected || boothState) return undefined;
    const timer = setTimeout(() => setSessionEnded(true), STATE_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [connected, boothState]);

  // Own the MJPEG stream's lifecycle: start it on mount and stop it on unmount.
  // The src is set here rather than in JSX so Strict Mode's mount/unmount/mount
  // (and the img remounting after the session-ended view) doesn't leave it blank.
  useEffect(() => {
    const img = streamImgRef.current;
    if (!img) return undefined;
    img.src = `${apiBaseUrl}/api/stream${previewAttempt ? `?t=${previewAttempt}` : ''}`;
    return () => {
      clearTimeout(previewRetryRef.current);
      img.src = '';
    };
  }, [sessionEnded, previewAttempt]);

  const handlePreviewError = (e) => {
    // Clearing src on cleanup can fire an error event too; ignore it
    if (!e.currentTarget.getAttribute('src')) return;
    setPreviewError(true);
    clearTimeout(previewRetryRef.current);
    previewRetryRef.current = setTimeout(() => setPreviewAttempt((n) => n + 1), 3000);
  };

  const isBusy = !boothState || boothState.isCapturing || boothState.isProcessing;
  const canShoot = connected && !sessionEnded && !isBusy;

  let statusText = 'Connecting…';
  if (sessionEnded) statusText = 'Session ended';
  else if (connected && !boothState) statusText = 'Waiting for booth…';
  else if (boothState?.isProcessing) statusText = 'Processing…';
  else if (boothState?.isCapturing) statusText = boothState.countdown === 1 ? 'Smile' : 'Get ready';
  else if (boothState) statusText = 'Ready';

  return (
    <div className="w-full overflow-y-auto flex flex-col bg-background text-on-surface" style={{ height: viewportHeight }}>
      <header className="flex justify-between items-center px-5 h-16 shrink-0">
        <img src="/SnapGo-dark.png" alt="SnapGo" className="h-8 w-auto" />
        <span className={`flex items-center gap-2 text-xs font-bold tracking-widest uppercase ${connected && boothState ? 'text-primary' : 'text-white/50'}`}>
          <span className={`w-2 h-2 rounded-full ${connected && boothState ? 'bg-primary' : 'bg-white/30'}`}></span>
          Remote
        </span>
      </header>

      {sessionEnded ? (
        <main className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
          <span className="material-symbols-outlined text-6xl text-white/40">qr_code_scanner</span>
          <h1 className="text-xl font-bold text-white">Session ended</h1>
          <p className="text-sm text-on-surface-variant">Scan the new code on the booth to take control again.</p>
        </main>
      ) : (
        <>
          {/*  Live Preview  */}
          <div className="relative flex-1 min-h-[8rem] mx-4 rounded-2xl overflow-hidden bg-black">
            <img
              ref={streamImgRef}
              alt="Live camera preview"
              className="absolute inset-0 w-full h-full object-contain"
              onLoad={() => setPreviewError(false)}
              onError={handlePreviewError}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50"></div>

            {previewError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/60">
                <span className="material-symbols-outlined text-4xl">videocam_off</span>
                <span className="text-xs font-bold tracking-widest uppercase">Preview unavailable — retrying…</span>
              </div>
            )}

            <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
              <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold tracking-[0.2em] uppercase border border-white/20 backdrop-blur-md">
                {statusText}
              </span>
              {boothState?.remainingShots != null && (
                <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/20 backdrop-blur-md">
                  Shots left: {boothState.remainingShots}
                </span>
              )}
            </div>

            {boothState?.isCapturing && boothState.countdown > 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span key={boothState.countdown} className="text-[8rem] font-black text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.9)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] leading-none select-none">
                  {boothState.countdown}
                </span>
              </div>
            )}
          </div>

          {/*  Mode Picker  */}
          <div className="shrink-0 flex flex-wrap justify-center gap-2 px-4 mt-4">
            {(boothState?.modes || []).map(([key, label]) => (
              <button
                key={key}
                onClick={() => send({ type: 'remote_command', command: 'set_mode', mode: key })}
                disabled={isBusy}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase border transition-colors disabled:opacity-40 ${boothState.mode === key ? 'bg-primary text-on-primary border-primary' : 'text-white/70 border-white/20'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/*  Shutter, with the Filter Picker arced around it  */}
          <div className="shrink-0 flex items-center justify-center pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <FilterPicker
              filters={boothState?.filters || []}
              active={boothState?.activeFilter || 'none'}
              onSelect={(id) => send({ type: 'remote_command', command: 'set_filter', filter: id })}
              openKind={filterTray}
              onOpenKindChange={setFilterTray}
              disabled={isBusy}
              radius={130}
            >
              <div className="relative flex items-center justify-center">
                <div className={`absolute w-28 h-28 rounded-full border-2 border-white/30 opacity-20 ${isBusy && boothState ? 'animate-ping border-primary' : ''}`}></div>
                <button
                  aria-label="Take photo"
                  onClick={() => send({ type: 'remote_command', command: 'shutter' })}
                  disabled={!canShoot}
                  className="relative w-24 h-24 rounded-full bg-white flex items-center justify-center transition-transform duration-150 shutter-glow active:scale-90 disabled:opacity-40 disabled:active:scale-100"
                >
                  <div className="w-20 h-20 rounded-full border-4 border-slate-900/10 bg-white"></div>
                </button>
              </div>
            </FilterPicker>
          </div>
        </>
      )}
    </div>
  );
};

export default RemoteControl;
