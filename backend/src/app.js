import express from 'express';
import cors from 'cors';
import { networkScanRouter } from './routes/networkScan.js';
import { devicesRouter } from './routes/devices.js';
import { initializeDatabase } from './database/db.js';
import { autoScanner } from './services/autoScanner.js';

const app = express();

// Initialize database and services
initializeDatabase().then(() => {
    console.log('Database initialized');
    // Initialize auto-scanner after database is ready
    autoScanner.initialize().then(() => {
        console.log('Auto-scanner initialized');
    });
}).catch(error => {
    console.error('Failed to initialize:', error);
    process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/network-scan', networkScanRouter);
app.use('/api/devices', devicesRouter);

// Status endpoint
app.get('/api/status', (req, res) => {
    res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

export default app;