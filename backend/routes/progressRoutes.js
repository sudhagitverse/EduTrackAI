const express = require('express');
const router = express.Router();
const { markComplete, getProgress } = require('../controllers/progressController');
const { authenticateToken } = require('../middleware/auth');

router.post('/lesson/:lessonId/complete', authenticateToken, markComplete);
router.get('/course/:courseId', authenticateToken, getProgress);

module.exports = router;
