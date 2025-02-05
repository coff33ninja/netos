import express from 'express';
import { initializeDatabase } from '../database/db.js';

const router = express.Router();
const db = initializeDatabase();

// Create a new user
router.post('/', (req, res) => {
    try {
        const { username, password, name, email } = req.body;
        
        // Check if user already exists
        const existingUser = db.findUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Create user
        const userId = db.createUser({ username, password, name, email });
        const user = db.findUserById(userId);
        
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user by ID
router.get('/:id', (req, res) => {
    try {
        const user = db.findUserById(parseInt(req.params.id));
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user
router.put('/:id', (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { name, email } = req.body;

        const success = db.updateUser(userId, { name, email });
        if (!success) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = db.findUserById(userId);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export const userRouter = router;