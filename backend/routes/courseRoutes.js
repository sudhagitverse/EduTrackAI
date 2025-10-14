const express = require('express');
const router = express.Router();
const { getAllCourses, getUpcoming, getCourseById } = require('../controllers/courseController');

router.get('/', getAllCourses);
router.get('/upcoming', getUpcoming);
router.get('/:id', getCourseById);

module.exports = router;
