import express from 'express';
import cors from 'cors';
import { serverConfig } from './config/server.config.js';
import { initializeDatabase } from './database.js';

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

let db = null;

// Initialize database
initializeDatabase().then(database => {
    db = database;
    console.log('Database initialized');
}).catch(err => {
    console.error('Failed to initialize database:', err);
});

// Test endpoint
app.get('/test', async (req, res) => {
    res.json({ 
        status: 'ok',
        message: 'API is working',
        dbStatus: db ? 'connected' : 'disconnected'
    });
});

// Start server
const port = 3000;
app.listen(port, () => {
    console.log(`Test server running on http://localhost:${port}`);
    console.log('Try accessing http://localhost:3000/test in your browser');
});