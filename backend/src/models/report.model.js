const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReportSchema = new Schema({
  type: { type: String, enum: ['daily','historical','custom'], required: true },
  generatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  filters: { type: Schema.Types.Mixed },
  generatedAt: { type: Date, default: Date.now },
  dataSummary: { type: Schema.Types.Mixed },
  pdfUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
