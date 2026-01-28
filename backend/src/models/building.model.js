const mongoose = require('mongoose');
const { Schema } = mongoose;

const SubareaSchema = new Schema({
  name: { type: String, required: true }
}, { _id: true });

const AreaSchema = new Schema({
  name: { type: String, required: true },
  subareas: [SubareaSchema]
}, { _id: true });

const BuildingSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  photos: [{ type: String }],
  areas: [AreaSchema],
  managerContact: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Building', BuildingSchema);
