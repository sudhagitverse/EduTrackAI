const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'Sudha@123',
  database: process.env.DB_NAME || 'edutrack_ai',
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool.promise();

