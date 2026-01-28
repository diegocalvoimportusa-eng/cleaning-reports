const mongoose = require('mongoose');
const { Schema } = mongoose;

const UploadSchema = new Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  uploaderId: { type: Schema.Types.ObjectId, ref: 'User' },
  relatedType: { type: String },
  relatedId: { type: Schema.Types.ObjectId },
}, { timestamps: true });

module.exports = mongoose.model('Upload', UploadSchema);
