// backend/controllers/userController.js
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;
    const [exists] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (exists.length) return res.status(400).json({ message: 'Email exists' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)', [name, email, hash, role || 'student']);
    res.json({ message: 'Registered', userId: result.insertId });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(400).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
}

module.exports = { register, login };
