// MySQL connection (settings come from .env locally, or from Environment variables on Render)
const mysql = require('mysql2/promise');
const { connectionOptions, timeZone } = require('./dbOptions');

if (process.env.DB_PASSWORD === undefined) {
  if (process.env.DB_SSL === 'true') {
    console.error('DB_PASSWORD is missing. Set it in .env (local) or in the Environment tab (Render).');
    process.exit(1);
  } else {
    console.warn('Notice: DB_PASSWORD is not set in .env. Connecting with empty password (default for local XAMPP).');
  }
}

const pool = mysql.createPool({
  ...connectionOptions(),
  connectionLimit: 5,
  enableKeepAlive: true
});

const tz = timeZone();
pool.pool.on('connection', connection => {
  connection.query(`SET time_zone = '${tz}'`);
});

module.exports = pool;
