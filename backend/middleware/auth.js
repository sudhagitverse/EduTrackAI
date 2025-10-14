// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const auth = req.headers['authorization'];
  const token = auth && auth.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, process.env.JWT_SECRET || 'dev_secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

const requireInstructor = (req, res, next) => {
  if (req.user && req.user.role === 'instructor') return next();
  return res.status(403).json({ message: 'Instructor role required' });
};

module.exports = { authenticateToken, requireInstructor };
