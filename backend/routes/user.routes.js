import express from 'express';
import passport from 'passport';
import { dbOperations } from '../database.js';

const router = express.Router();

// Get user profile
router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  }
);

// Update user profile
router.put(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { name, email } = req.body;
      dbOperations.updateUser.run(name, email, req.user.id);
      res.json({ message: 'Profile updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;