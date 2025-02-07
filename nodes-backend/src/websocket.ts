import { WebSocketServer, WebSocket } from 'ws';
import { ConsoleManager } from './services/consoleManager';

export function setupWebSocket(wss: WebSocketServer, consoleManager: ConsoleManager) {
    wss.on('connection', (ws: WebSocket) => {
        console.log('New WebSocket connection');
        const sessionId = Math.random().toString(36).substring(2, 15);
        
        ws.on('message', (message: string) => {
            try {
                const data = JSON.parse(message);
                
                switch (data.type) {
                    case 'console_start':
                        consoleManager.createSession(sessionId, ws);
                        break;
                    
                    case 'console_command':
                        consoleManager.sendCommand(sessionId, data.command);
                        break;
                    
                    default:
                        console.warn('Unknown message type:', data.type);
                }
            } catch (error) {
                console.error('WebSocket message error:', error);
            }
        });

        ws.on('close', () => {
            consoleManager.closeSession(sessionId);
        });
    });
}