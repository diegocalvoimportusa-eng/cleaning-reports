const Claim = require('../models/claim.model');
const Task = require('../models/task.model');

exports.create = async (req, res) => {
  try {
    const data = req.body;
    const c = await Claim.create(data);
    res.status(201).json(c);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.list = async (req, res) => {
  try {
    const q = req.query || {};
    const items = await Claim.find(q).limit(200).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.convertToTask = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: 'Not found' });
    const t = await Task.create({ source: 'claim', sourceId: claim._id, buildingId: claim.buildingId, notes: claim.description, assignedBy: req.user._id });
    claim.assignedTaskId = t._id;
    claim.status = 'in_process';
    await claim.save();
    res.json({ claim, task: t });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
