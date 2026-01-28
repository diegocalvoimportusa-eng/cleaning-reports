const express = require('express');
const router = express.Router();
const Reports = require('../controllers/reports.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

router.post('/generate', authenticateToken, requireRole('admin','supervisor'), Reports.generate);
router.get('/', authenticateToken, requireRole('admin','supervisor'), Reports.list);
router.get('/:id', authenticateToken, requireRole('admin','supervisor'), Reports.get);

module.exports = router;
