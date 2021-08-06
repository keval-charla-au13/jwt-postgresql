const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

app.use(express.json());
app.use(cors());

app.use('/auth', require('./routes/jwtAuth'));

app.get('/users', async (req, res) => {
  try {
    const users = await pool.query('SELECT * from users');

    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json('Server Error: unable to retrieve users from the database');
  }
});

app.use('/dashboard', require('./routes/dashboard'));

app.listen(5000, () => {
  console.log(`server is running on PORT: 5000`);
});
