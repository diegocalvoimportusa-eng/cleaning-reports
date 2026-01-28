const mongoose = require('mongoose');
const { Schema } = mongoose;

const InspectionItemSchema = new Schema({
  criterion: { type: String, required: true },
  result: { type: String, enum: ['ok','fail','n/a'], required: true },
  notes: { type: String },
  photos: [{ type: String }]
}, { _id: true });

const InspectionSchema = new Schema({
  buildingId: { type: Schema.Types.ObjectId, ref: 'Building', required: true },
  areaId: { type: Schema.Types.ObjectId, required: true },
  subareaId: { type: Schema.Types.ObjectId, required: false },
  inspectorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['draft','finalized'], default: 'draft' },
  items: [InspectionItemSchema],
  photos: [{ type: String }],
  overallResult: { type: String, enum: ['pass','fail','partial'] },
  reportPdfUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Inspection', InspectionSchema);
