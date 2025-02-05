import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { initializeWebSocket } from './src/services/websocket.js';
import { deviceRouter } from './src/routes/devices.js';
import { networkScanRouter } from './src/routes/networkScan.js';
import { userRouter } from './src/routes/users.js';

const app = express();
const server = createServer(app);

// Initialize WebSocket
initializeWebSocket(server);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/devices', deviceRouter);
app.use('/api/network-scan', networkScanRouter);
app.use('/api/users', userRouter);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});