const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClaimSchema = new Schema({
  clientName: { type: String },
  clientContact: { type: String },
  buildingId: { type: Schema.Types.ObjectId, ref: 'Building' },
  description: { type: String },
  photos: [{ type: String }],
  status: { type: String, enum: ['pending','in_process','resolved'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  assignedTaskId: { type: Schema.Types.ObjectId, ref: 'Task' }
});

module.exports = mongoose.model('Claim', ClaimSchema);
