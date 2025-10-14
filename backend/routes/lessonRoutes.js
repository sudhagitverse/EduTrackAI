const express = require('express');
const router = express.Router();
const { getLessonsByCourse, createLesson } = require('../controllers/lessonController');
const { authenticateToken, requireInstructor } = require('../middleware/auth');

router.get('/:courseId', getLessonsByCourse);
router.post('/:courseId', authenticateToken, requireInstructor, createLesson);

module.exports = router;
