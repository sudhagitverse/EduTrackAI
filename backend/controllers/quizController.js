const pool = require('../db');

async function getQuizzesByLesson(req, res) {
    try {
        const { lessonId } = req.params;
        const [rows] = await pool.query(
            'SELECT * FROM quizzes WHERE lesson_id = ?',
            [lessonId]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { getQuizzesByLesson };
