import express from 'express';
import passport from 'passport';
import { dbOperations } from '../database.js';

const router = express.Router();

// Log dbOperations to check its contents
console.log('dbOperations:', dbOperations);

// Get all devices
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const devices = await dbOperations.getAllDevices();
        res.json(devices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
