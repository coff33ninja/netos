import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './database/db.js';
import { networkScanRouter } from './routes/networkScan.js';
import { devicesRouter } from './routes/devices.js';
import { userRouter } from './routes/user.js';

const app = express();
const port = process.env.PORT || 3001;

// Initialize database and start server
async function startServer() {
    try {
        // Initialize database
        const db = await initializeDatabase();
        console.log('Database initialized successfully');
        
        // Middleware
        app.use(cors());
        app.use(express.json());

        // Routes
        app.use('/api/network-scan', networkScanRouter);
        app.use('/api/devices', devicesRouter);
        app.use('/api/users', userRouter);

        // Error handling middleware
        app.use((err, req, res, next) => {
            console.error('Error:', err);
            res.status(500).json({
                error: 'Internal Server Error',
                message: err.message,
                stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
            });
        });

        // Start server
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection:', err);
    process.exit(1);
});

startServer();

export default app;