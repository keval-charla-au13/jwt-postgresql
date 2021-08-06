const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const { email, name, password } = req.body;

  const validEmail = (userEmail) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  };

  if (req.path === '/register') {
    if (![email, name, password].every(Boolean)) {
      return res
        .status(401)
        .json('There are missing credentials, please enter all fields');
    } else if (!validEmail(email)) {
      return res.status(401).json({ message: 'Please enter a valid email' });
    }
  } else if (req.path === '/login') {
    if (![email, password].every(Boolean)) {
      return res
        .status(401)
        .json({
          message: 'There are missing credentials, please enter all fields',
        });
    } else if (!validEmail(email)) {
      return res.status(401).json({ message: 'Please enter a valid email' });
    }
  }

  next();
};
