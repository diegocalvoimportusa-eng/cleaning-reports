const express = require('express');
const router = express.Router();
const Claims = require('../controllers/claims.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

router.post('/', Claims.create);
router.get('/', authenticateToken, requireRole('admin','supervisor'), Claims.list);
router.put('/:id/convert-task', authenticateToken, requireRole('supervisor','admin'), Claims.convertToTask);

module.exports = router;
