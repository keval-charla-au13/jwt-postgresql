const router = require('express').Router();
const bcrypt = require('bcrypt');

const pool = require('../db');

const jwtGenerator = require('../utils/jwtGenerator');

const validInfo = require('../middleware/validInfo');
const authorized = require('../middleware/authorized');

router.post('/register', validInfo, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).json('User already exists!'); // 401 unauthenticated error status
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      'INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *;',
      [name, email, hashedPassword]
    );

    console.log(newUser.rows[0]);

    const token = jwtGenerator(newUser.rows[0].user_id);

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json('Server Error');
  }
});

router.post('/login', validInfo, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query('SELECT * from users WHERE user_email = $1', [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json('Email is incorrect!');
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json('Password is incorrect!');
    }

    console.log(user.rows[0]);

    const token = jwtGenerator(user.rows[0].user_id);

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json('Server Error');
  }
});

router.get('/isVerified', authorized, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json('Server Error');
  }
});

module.exports = router;
