import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { setupNodeRoutes } from './routes/node';
import { setupWebSocket } from './websocket';
import { NodeManager } from './services/nodeManager';
import { ConsoleManager } from './services/consoleManager';
import { NetworkScanner } from './services/networkScanner';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Initialize services
const nodeManager = new NodeManager();
const consoleManager = new ConsoleManager();
const networkScanner = new NetworkScanner();

// Setup routes
app.use(express.json());
setupNodeRoutes(app, nodeManager, consoleManager, networkScanner);

// Setup WebSocket
setupWebSocket(wss, consoleManager);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Node service running on port ${PORT}`);
});