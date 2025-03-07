
import { useEffect, useRef, useState, useCallback } from 'react';
import type { Device, NetworkScan } from '@/types/api';

interface WebSocketMessage {
    type: 'DEVICE_LIST' | 'DEVICE_UPDATE' | 'SCAN_UPDATE';
    payload: any;
}

export function useWebSocket() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [currentScan, setCurrentScan] = useState<NetworkScan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    const connect = useCallback(() => {
        const ws = new WebSocket('ws://localhost:3001');

        ws.onopen = () => {
            setIsLoading(false);
            setError(null);
        };

        ws.onmessage = (event) => {
            try {
                const message: WebSocketMessage = JSON.parse(event.data);

                switch (message.type) {
                    case 'DEVICE_LIST':
                        setDevices(message.payload);
                        break;
                    case 'DEVICE_UPDATE':
                        setDevices(prev => {
                            const index = prev.findIndex(d => d.id === message.payload.id);
                            if (index === -1) {
                                return [...prev, message.payload];
                            }
                            const newDevices = [...prev];
                            newDevices[index] = message.payload;
                            return newDevices;
                        });
                        break;
                    case 'SCAN_UPDATE':
                        setCurrentScan(message.payload);
                        break;
                }
            } catch (err) {
                setError('Failed to process WebSocket message');
            }
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected. Reconnecting...');
            setIsLoading(true);
            setTimeout(connect, 1000);
        };

        ws.onerror = () => {
            setError('WebSocket connection error');
            setIsLoading(false);
        };

        wsRef.current = ws;
    }, []);

    useEffect(() => {
        connect();
        return () => wsRef.current?.close();
    }, [connect]);

    return { devices, currentScan, isLoading, error };
}
