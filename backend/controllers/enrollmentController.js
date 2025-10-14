// backend/controllers/enrollmentController.js
const pool = require('../db');

async function enroll(req, res) {
    try {
        const { course_id } = req.body;
        const user_id = req.user.id;
        const [exists] = await pool.query(
            'SELECT id FROM enrollments WHERE user_id=? AND course_id=?',
            [user_id, course_id]
        );
        if (exists.length)
            return res.status(400).json({ message: 'Already enrolled' });
        await pool.query('INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)', [
            user_id,
            course_id,
        ]);
        res.json({ message: 'Enrolled successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

async function getEnrollments(req, res) {
    try {
        const user_id = req.user.id;
        const [rows] = await pool.query(
            'SELECT DISTINCT c.* FROM courses c JOIN enrollments e ON e.course_id=c.id WHERE e.user_id=?',
            [user_id]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

// ✅ UNENROLL FUNCTION (new)
async function unenroll(req, res) {
    try {
        const user_id = req.user.id;
        const { course_id } = req.params;

        const [result] = await pool.query(
            'DELETE FROM enrollments WHERE user_id=? AND course_id=?',
            [user_id, course_id]
        );

        if (result.affectedRows === 0)
            return res.status(404).json({ message: 'Not enrolled in this course' });

        res.json({ message: 'Unenrolled successfully' });
    } catch (err) {
        console.error('Unenroll error:', err);
        res.status(500).json({ message: 'Server error during unenrollment' });
    }
}

module.exports = { enroll, getEnrollments, unenroll };
