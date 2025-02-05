import express from 'express';
import { initializeDatabase } from '../database/db.js';
import { resolveDeviceName, lookupManufacturer, scanPorts } from '../services/deviceIdentification.js';
import { DeviceTracker } from '../services/deviceTracking.js';
import { autoScanner } from '../services/autoScanner.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const deviceTracker = new DeviceTracker();

// Initialize services
deviceTracker.initialize();
autoScanner.initialize();

// Get all devices
router.get('/', async (req, res) => {
    try {
        const db = await initializeDatabase();
        const devices = Array.from(db.data.devices.values());
        res.json(devices);
    } catch (error) {
        console.error('Error getting devices:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create new device
router.post('/', async (req, res) => {
    try {
        const db = await initializeDatabase();
        const { ip, mac, name, type, manufacturer, status, lastSeen, firstSeen } = req.body;

        // Validate required fields
        if (!ip || !mac) {
            return res.status(400).json({ error: 'IP and MAC address are required' });
        }

        // Check if device with this IP already exists
        const existingDevice = Array.from(db.data.devices.values()).find(d => d.ip === ip);
        if (existingDevice) {
            return res.status(409).json({ error: 'Device with this IP already exists' });
        }

        // Create new device
        const newDevice = {
            id: uuidv4(),
            ip,
            mac,
            name: name || `Device ${ip}`,
            type: type || 'unknown',
            manufacturer: manufacturer || 'Unknown',
            status: status || 'online',
            lastSeen: lastSeen || new Date().toISOString(),
            firstSeen: firstSeen || new Date().toISOString()
        };

        // Add to database
        db.data.devices.set(newDevice.id, newDevice);
        await db.save();

        // Track the device
        deviceTracker.trackDevice(newDevice);

        res.status(201).json(newDevice);
    } catch (error) {
        console.error('Error creating device:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get device by ID with enhanced information
router.get('/:id', async (req, res) => {
    try {
        const db = await initializeDatabase();
        const device = db.findDeviceById(req.params.id);
        
        if (!device) {
            return res.status(404).json({ error: 'Device not found' });
        }

        // Enhance device information
        const [name, manufacturer, ports] = await Promise.all([
            resolveDeviceName(device.ip),
            lookupManufacturer(device.mac),
            scanPorts(device.ip)
        ]);

        const history = await deviceTracker.getDeviceHistory(device.ip);

        res.json({
            ...device,
            resolvedName: name,
            manufacturer,
            openPorts: ports,
            history
        });
    } catch (error) {
        console.error('Error getting device:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update device
router.put('/:id', async (req, res) => {
    try {
        const db = await initializeDatabase();
        const updated = db.updateDevice(req.params.id, req.body);
        
        if (!updated) {
            return res.status(404).json({ error: 'Device not found' });
        }

        res.json(updated);
    } catch (error) {
        console.error('Error updating device:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete device
router.delete('/:id', async (req, res) => {
    try {
        const db = await initializeDatabase();
        const deleted = db.deleteDevice(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({ error: 'Device not found' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting device:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete all devices
router.delete('/', async (req, res) => {
    try {
        const db = await initializeDatabase();
        const count = db.deleteAllDevices();
        res.json({ message: `Successfully deleted ${count} devices` });
    } catch (error) {
        console.error('Error deleting all devices:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get device history
router.get('/:id/history', async (req, res) => {
    try {
        const db = await initializeDatabase();
        const device = db.findDeviceById(req.params.id);
        
        if (!device) {
            return res.status(404).json({ error: 'Device not found' });
        }

        const history = await deviceTracker.getDeviceHistory(device.ip);
        res.json(history);
    } catch (error) {
        console.error('Error getting device history:', error);
        res.status(500).json({ error: error.message });
    }
});

// Configure auto-scanning
router.post('/auto-scan/config', async (req, res) => {
    try {
        await autoScanner.updateConfig(req.body);
        res.json(autoScanner.config);
    } catch (error) {
        console.error('Error updating auto-scan config:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get auto-scan configuration
router.get('/auto-scan/config', async (req, res) => {
    try {
        res.json(autoScanner.config);
    } catch (error) {
        console.error('Error getting auto-scan config:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start auto-scanning
router.post('/auto-scan/start', async (req, res) => {
    try {
        await autoScanner.start();
        res.json({ status: 'started', config: autoScanner.config });
    } catch (error) {
        console.error('Error starting auto-scan:', error);
        res.status(500).json({ error: error.message });
    }
});

// Stop auto-scanning
router.post('/auto-scan/stop', async (req, res) => {
    try {
        await autoScanner.stop();
        res.json({ status: 'stopped', config: autoScanner.config });
    } catch (error) {
        console.error('Error stopping auto-scan:', error);
        res.status(500).json({ error: error.message });
    }
});

export const devicesRouter = router;