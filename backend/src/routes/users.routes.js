const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

// Get profile
router.get('/me', authenticateToken, async (req, res) => {
  res.json(req.user);
});

// Admin: list users
router.get('/', authenticateToken, requireRole('admin'), async (req, res) => {
  const users = await User.find().select('-passwordHash');
  res.json(users);
});

module.exports = router;
