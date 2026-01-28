const express = require('express');
const router = express.Router();
const Inspections = require('../controllers/inspections.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');
const upload = require('../config/multer');
const Uploads = require('../controllers/uploads.controller');

router.post('/', authenticateToken, requireRole('inspector','supervisor','admin'), Inspections.create);
router.get('/', authenticateToken, Inspections.list);
router.get('/:id', authenticateToken, Inspections.get);
router.put('/:id/finalize', authenticateToken, requireRole('inspector','supervisor','admin'), Inspections.finalize);

router.post('/:id/photo', authenticateToken, requireRole('inspector','supervisor','admin'), upload.single('file'), async (req, res) => {
	req.body.relatedType = 'inspection';
	req.body.relatedId = req.params.id;
	return Uploads.single(req, res);
});

module.exports = router;
