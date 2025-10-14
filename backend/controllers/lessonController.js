// backend/controllers/lessonController.js
const pool = require('../db');

async function getLessonsByCourse(req, res) {
    try {
        const { courseId } = req.params;
        const [rows] = await pool.query(
            'SELECT id, course_id, title, content_type, content_url, release_date, position FROM lessons WHERE course_id = ? ORDER BY position',
            [courseId]
        );
        // hide lessons not yet released unless user is instructor or enrolled & release_date passed
        res.json(rows);
    } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
}

async function createLesson(req, res) {
    try {
        const { courseId } = req.params;
        const { title, content_type, content_url, release_date, position } = req.body;
        const [result] = await pool.query(
            'INSERT INTO lessons (course_id, title, content_type, content_url, release_date, position) VALUES (?, ?, ?, ?, ?, ?)',
            [courseId, title, content_type, content_url, release_date || null, position || 0]
        );
        res.json({ message: 'Lesson created', lessonId: result.insertId });
    } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
}

module.exports = { getLessonsByCourse, createLesson };
