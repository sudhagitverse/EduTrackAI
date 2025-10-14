// backend/routes/enrollmentRoutes.js
const express = require('express');
const router = express.Router();
const { enroll, getEnrollments, unenroll } = require('../controllers/enrollmentController');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, enroll);
router.get('/', authenticateToken, getEnrollments);

// ✅ new route
router.delete('/:course_id', authenticateToken, unenroll);

module.exports = router;
