import React, { createContext, useEffect, useContext, useState } from 'react';

const websocketUrl = process.env.REACT_APP_CAMERA_WEBSOCKET_URL || 'ws://localhost:8080/ws';
const WebsocketContext = createContext();

export const WebsocketProvider = ({ children }) => {
    const [wsEvent, setWsEvent] = useState(null);

    useEffect(() => {
        const ws = new WebSocket(websocketUrl);

        ws.onopen = () => {
            console.log(`Connected to WebSocket server at ${websocketUrl}`);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                setWsEvent(data);
            } catch (err) {
                console.warn('Received non-JSON message:', event.data);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        ws.onclose = () => {
            console.log(`Disconnected from WebSocket server at ${websocketUrl}`);
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <WebsocketContext.Provider value={{ wsEvent }}>
            {children}
        </WebsocketContext.Provider>
    );
};

export const useWebsocket = () => {
    const context = useContext(WebsocketContext);
    if (context === undefined) {
        throw new Error('useWebsocket must be used within a WebsocketProvider');
    }
    return context;
}