const Inspection = require('../models/inspection.model');
const Building = require('../models/building.model');

exports.create = async (req, res) => {
  try {
    const data = req.body;
    data.inspectorId = req.user._id;
    const insp = await Inspection.create(data);
    res.status(201).json(insp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.list = async (req, res) => {
  try {
    const q = req.query || {};
    const items = await Inspection.find(q).limit(100).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.get = async (req, res) => {
  try {
    const insp = await Inspection.findById(req.params.id);
    if (!insp) return res.status(404).json({ message: 'Not found' });
    res.json(insp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.finalize = async (req, res) => {
  try {
    const insp = await Inspection.findById(req.params.id);
    if (!insp) return res.status(404).json({ message: 'Not found' });
    insp.status = 'finalized';
    insp.overallResult = req.body.overallResult || insp.overallResult;
    await insp.save();
    res.json(insp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
