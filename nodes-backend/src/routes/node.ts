import { Express } from 'express';
import { NodeManager } from '../services/nodeManager';
import { ConsoleManager } from '../services/consoleManager';
import { NetworkScanner } from '../services/networkScanner';

export function setupNodeRoutes(
    app: Express,
    nodeManager: NodeManager,
    consoleManager: ConsoleManager,
    networkScanner: NetworkScanner
) {
    // Get node information
    app.get('/api/node', (req, res) => {
        const nodeInfo = nodeManager.getNodeInfo();
        res.json(nodeInfo);
    });

    // Get node devices
    app.get('/api/node/devices', async (req, res) => {
        const devices = await nodeManager.getDevices();
        res.json(devices);
    });

    // Perform node action (restart/shutdown)
    app.post('/api/node/action', async (req, res) => {
        const { action } = req.body;
        if (action === 'restart' || action === 'shutdown') {
            await nodeManager.performAction(action);
            res.json({ success: true });
        } else {
            res.status(400).json({ error: 'Invalid action' });
        }
    });

    // Scan network
    app.post('/api/node/scan', async (req, res) => {
        const devices = await networkScanner.scanNetwork();
        res.json(devices);
    });
}