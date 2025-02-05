import express from 'express';
import passport from 'passport';
import { dbOperations } from '../database.js';
import { validateIPRange } from '../utils/validators.js';

const router = express.Router();

// Get all devices
router.get(
  '/devices',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    try {
      const devices = dbOperations.getAllDevices.all();
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
  (req, res) => {
    try {
      const device = dbOperations.getDeviceById.get(req.params.id);
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
  (req, res) => {
    try {
      const { name, type } = req.body;
      dbOperations.updateDevice.run(name, type, req.params.id);
      res.json({ message: 'Device updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;