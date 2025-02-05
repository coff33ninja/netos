import { WebSocketServer } from 'ws';
import { initializeDatabase } from '../database/db.js';

const db = initializeDatabase();
let wss = null;

export function initializeWebSocket(server) {
    wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        console.log('Client connected');

        // Send initial data
        sendDeviceList(ws);

        ws.on('error', console.error);
        ws.on('close', () => console.log('Client disconnected'));
    });
}

export function broadcastDeviceUpdate(device) {
    if (!wss) return;
    
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'DEVICE_UPDATE',
                payload: device
            }));
        }
    });
}

export function broadcastScanStatus(scan) {
    if (!wss) return;
    
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'SCAN_UPDATE',
                payload: scan
            }));
        }
    });
}

async function sendDeviceList(ws) {
    const devices = db.getAllDevices();
    ws.send(JSON.stringify({
        type: 'DEVICE_LIST',
        payload: devices
    }));
}