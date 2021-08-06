const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  password: 'keval',
  host: 'localhost',
  port: 5432,
  database: 'jwtauth',
});

module.exports = pool;
