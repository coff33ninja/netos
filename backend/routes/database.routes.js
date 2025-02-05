import express from 'express';
import passport from 'passport';
import { dbOperations } from '../database.js';

const router = express.Router();

// Get all scans
router.get(
  '/scans',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const scans = dbOperations.getLatestScans.all(limit);
      res.json(scans);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get scan by ID
router.get(
  '/scans/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    try {
      const scan = dbOperations.getScanById.get(req.params.id);
      if (!scan) {
        return res.status(404).json({ error: 'Scan not found' });
      }
      res.json(scan);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;