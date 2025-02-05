import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './database/db.js';
import { networkScanRouter } from './routes/networkScan.js';
import { deviceRouter } from './routes/device.js';
import { userRouter } from './routes/user.js';

const app = express();
const port = process.env.PORT || 3001; // Changed port to 3001

// Initialize database
const db = initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/network-scan', networkScanRouter);
app.use('/api/devices', deviceRouter);
app.use('/api/users', userRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;