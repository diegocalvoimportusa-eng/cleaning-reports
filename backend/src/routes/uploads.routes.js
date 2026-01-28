const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const upload = require('../config/multer');
const Uploads = require('../controllers/uploads.controller');

// Generic upload endpoint (multipart: file)
router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
  // relatedType and relatedId may be passed as fields
  return Uploads.single(req, res);
});

module.exports = router;
