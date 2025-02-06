import express from 'express';
import passport from 'passport';
import { dbOperations } from '../database.js';
import { validateIPRange } from '../utils/validators.js';

const router = express.Router();

// Get all devices
router.get(
  '/devices',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const devices = await dbOperations.getAllDevices();
      res.json(devices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get device by ID
router.get(
  '/devices/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const device = await dbOperations.getDeviceById(req.params.id);
      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }
      res.json(device);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update device
router.put(
  '/devices/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { name, type } = req.body;
      await dbOperations.updateDevice.run(name, type, req.params.id);
      res.json({ message: 'Device updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Test node connection
router.post('/nodes/:id/test', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const node = await dbOperations.getDeviceById(req.params.id);
        if (!node) {
            return res.status(404).json({ error: 'Node not found' });
        }

        // Simulate a connection test with random latency
        const success = Math.random() > 0.1; // 90% success rate
        const latency = Math.floor(Math.random() * 100) + 1; // 1-100ms

        res.json({
            success,
            latency,
            timestamp: new Date().toISOString(),
            error: success ? undefined : 'Connection timed out'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get node configuration
router.get('/nodes/:id/config', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const node = await dbOperations.getDeviceById(req.params.id);
        if (!node) {
            return res.status(404).json({ error: 'Node not found' });
        }

        // Return default or stored configuration
        res.json({
            id: node.id,
            name: node.name,
            enabled: true,
            alertThresholds: {
                cpu: 80,
                memory: 80,
                disk: 90,
                network: 70
            },
            monitoringInterval: 60
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update node configuration
router.put('/nodes/:id/config', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const node = await dbOperations.getDeviceById(req.params.id);
        if (!node) {
            return res.status(404).json({ error: 'Node not found' });
        }

        // In a real implementation, you would save this configuration to the database
        res.json({
            ...req.body,
            id: node.id,
            name: node.name
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
