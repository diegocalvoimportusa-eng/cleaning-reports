const mongoose = require('mongoose');
const { Schema } = mongoose;

const TaskSchema = new Schema({
  source: { type: String, enum: ['inspection','claim','manual'], required: true },
  sourceId: { type: Schema.Types.ObjectId },
  buildingId: { type: Schema.Types.ObjectId, ref: 'Building' },
  areaId: { type: Schema.Types.ObjectId },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  assignedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending','in_progress','resolved'], default: 'pending' },
  priority: { type: String, enum: ['low','normal','high'], default: 'normal' },
  dueAt: { type: Date },
  timeAssigned: { type: Date },
  timeCompleted: { type: Date },
  photos: [{ type: String }],
  notes: { type: String },
  alertsSent: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
