const pool = require('../db');

async function getAllCourses(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, description, instructor, start_date, end_date FROM courses ORDER BY id DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getUpcoming(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, start_date FROM courses WHERE start_date > NOW() ORDER BY start_date'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getCourseById(req, res) {
  try {
    const { id } = req.params;
    const [[course]] = await pool.query('SELECT * FROM courses WHERE id = ?', [id]);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getAllCourses, getUpcoming, getCourseById };
