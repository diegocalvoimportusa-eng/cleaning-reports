const express = require('express');
const router = express.Router();
const Building = require('../models/building.model');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');
const upload = require('../config/multer');
const Uploads = require('../controllers/uploads.controller');

// List buildings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const buildings = await Building.find();
    res.json(buildings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get building by id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);
    if (!building) return res.status(404).json({ message: 'Not found' });
    res.json(building);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create building
router.post('/', authenticateToken, requireRole('admin','supervisor','inspector'), async (req, res) => {
  try {
    const data = req.body;
    data.createdBy = req.user._id;
    const b = await Building.create(data);
    res.status(201).json(b);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update building
router.put('/:id', authenticateToken, requireRole('admin','supervisor','inspector'), async (req, res) => {
  try {
    const { name, address, managerContact } = req.body;
    const b = await Building.findByIdAndUpdate(req.params.id, { name, address, managerContact }, { new: true });
    if (!b) return res.status(404).json({ message: 'Not found' });
    res.json(b);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload photo for building
router.post('/:id/photo', authenticateToken, requireRole('admin','supervisor','inspector'), upload.single('file'), async (req, res) => {
  // attach related metadata then call uploads controller
  req.body.relatedType = 'building';
  req.body.relatedId = req.params.id;
  return Uploads.single(req, res);
});

// Add area to building (body: { name, subareas?: [{ name }] })
router.post('/:id/areas', authenticateToken, requireRole('admin','supervisor','inspector'), async (req, res) => {
  try {
    const { name, subareas } = req.body;
    const area = { name, subareas: subareas || [] };
    const b = await Building.findByIdAndUpdate(req.params.id, { $push: { areas: area } }, { new: true });
    if (!b) return res.status(404).json({ message: 'Building not found' });
    res.status(201).json(b);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
