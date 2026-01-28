const express = require('express');
const router = express.Router();
const Tasks = require('../controllers/tasks.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

router.post('/', authenticateToken, requireRole('supervisor','admin','inspector'), Tasks.create);
router.get('/', authenticateToken, Tasks.list);
router.get('/:id', authenticateToken, Tasks.get);
router.put('/:id', authenticateToken, requireRole('supervisor','admin'), Tasks.update);
router.post('/:id/complete', authenticateToken, requireRole('cleaner','supervisor','admin'), Tasks.complete);

module.exports = router;
