// backend/controllers/progressController.js
const pool = require('../db');

async function markComplete(req, res) {
    try {
        const { lessonId } = req.params;
        const user_id = req.user.id;
        await pool.query('INSERT IGNORE INTO progress (user_id, lesson_id) VALUES (?, ?)', [user_id, lessonId]);
        res.json({ message: 'Marked completed' });
    } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
}

async function getProgress(req, res) {
    try {
        const { courseId } = req.params;
        const user_id = req.user.id;
        const [rows] = await pool.query(
            `SELECT p.lesson_id FROM progress p JOIN lessons l ON l.id=p.lesson_id WHERE p.user_id = ? AND l.course_id = ?`,
            [user_id, courseId]
        );
        res.json(rows.map(r => r.lesson_id));
    } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
}

module.exports = { markComplete, getProgress };
