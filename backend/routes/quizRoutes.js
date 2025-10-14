const express = require('express');
const router = express.Router();
const db = require('../db');

// Get quizzes for a lesson
router.get('/:lessonId', async (req, res) => {
    const { lessonId } = req.params;
    try {
        const [results] = await db.query(
            'SELECT * FROM quizzes WHERE lesson_id = ?',
            [lessonId]
        );
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
