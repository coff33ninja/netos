import express from 'express';
import { initializeDatabase } from '../database/db.js';

const router = express.Router();

// Create a new device
router.post('/', async (req, res) => {
    try {
        const db = await initializeDatabase();
        const { name, ip, mac, type, status } = req.body;
        
        // Check if device with same IP or MAC already exists
        const existingDeviceByIp = db.findDeviceByIp(ip);
        const existingDeviceByMac = mac ? db.findDeviceByMac(mac) : null;
        
        if (existingDeviceByIp) {
            return res.status(400).json({ error: 'Device with this IP already exists' });
        }
        if (existingDeviceByMac) {
            return res.status(400).json({ error: 'Device with this MAC already exists' });
        }

        // Create device
        const deviceId = db.createDevice({ name, ip, mac, type, status });
        const device = db.findDeviceById(deviceId);
        
        res.status(201).json(device);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all devices
router.get('/', async (req, res) => {
    try {
        const db = await initializeDatabase();
        const devices = db.getAllDevices();
        res.json(devices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get device by ID
router.get('/:id', async (req, res) => {
    try {
        const db = await initializeDatabase();
        const device = db.findDeviceById(parseInt(req.params.id));
        if (!device) {
            return res.status(404).json({ error: 'Device not found' });
        }
        res.json(device);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update device
router.put('/:id', async (req, res) => {
    try {
        const db = await initializeDatabase();
        const deviceId = parseInt(req.params.id);
        const { name, type, status } = req.body;

        const success = db.updateDevice(deviceId, { name, type, status });
        if (!success) {
            return res.status(404).json({ error: 'Device not found' });
        }

        const device = db.findDeviceById(deviceId);
        res.json(device);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export const deviceRouter = router;