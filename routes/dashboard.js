const router = require('express').Router();

const pool = require('../db');

const jwtGenerator = require('../utils/jwtGenerator');

const authorized = require('../middleware/authorized');

router.get('/', authorized, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT user_name, user_email FROM users WHERE user_id = $1',
      [req.user]
    );

    console.log(user.rows[0]);

    res.json(user.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json('Server error');
  }
});

module.exports = router;
