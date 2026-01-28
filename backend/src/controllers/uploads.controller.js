const Upload = require('../models/upload.model');
const Building = require('../models/building.model');
const Inspection = require('../models/inspection.model');
const Task = require('../models/task.model');
const Claim = require('../models/claim.model');

exports.single = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const url = `/uploads/${req.file.filename}`;
    const doc = await Upload.create({ 
      filename: req.file.originalname, 
      url, 
      uploaderId: req.user ? req.user._id : null, 
      relatedType: req.body.relatedType, 
      relatedId: req.body.relatedId 
    });

    // Update related document with photo URL
    if (req.body.relatedType === 'building') {
      await Building.findByIdAndUpdate(req.body.relatedId, { $push: { photos: url } }, { new: true });
    } else if (req.body.relatedType === 'inspection') {
      await Inspection.findByIdAndUpdate(req.body.relatedId, { $push: { photos: url } }, { new: true });
    } else if (req.body.relatedType === 'task') {
      await Task.findByIdAndUpdate(req.body.relatedId, { $push: { photos: url } }, { new: true });
    } else if (req.body.relatedType === 'claim') {
      await Claim.findByIdAndUpdate(req.body.relatedId, { $push: { photos: url } }, { new: true });
    }

    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
