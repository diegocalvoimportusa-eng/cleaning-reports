const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const Report = require('../models/report.model');

async function createPdf(reportDoc) {
  const fileName = `report-${reportDoc._id}.pdf`;
  const filePath = path.join(process.cwd(), 'uploads', fileName);
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    doc.fontSize(18).text('Cleaning Reports - Summary', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Report ID: ${reportDoc._id}`);
    doc.text(`Type: ${reportDoc.type}`);
    doc.text(`Generated At: ${reportDoc.generatedAt}`);
    doc.moveDown();
    doc.text('Filters:');
    doc.fontSize(10).text(JSON.stringify(reportDoc.filters, null, 2));
    doc.moveDown();
    doc.text('Data Summary:');
    doc.fontSize(10).text(JSON.stringify(reportDoc.dataSummary, null, 2));
    doc.end();
    stream.on('finish', () => resolve({ fileName, filePath }));
    stream.on('error', reject);
  });
}

exports.generate = async (req, res) => {
  try {
    const { type, filters } = req.body;
    const r = await Report.create({ type: type || 'custom', generatedBy: req.user? req.user._id : null, filters: filters || {}, dataSummary: { note: 'placeholder' } });
    // create PDF
    const pdf = await createPdf(r);
    r.pdfUrl = `/uploads/${path.basename(pdf.filePath)}`;
    await r.save();
    res.status(201).json(r);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.list = async (req, res) => {
  try {
    const q = req.query || {};
    const items = await Report.find(q).limit(50).sort({ generatedAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.get = async (req, res) => {
  try {
    const r = await Report.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Not found' });
    res.json(r);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
