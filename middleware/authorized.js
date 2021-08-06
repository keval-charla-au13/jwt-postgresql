const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res, next) => {
  const {
    headers: { token },
  } = req;

  if (token === null) {
    return res.status(403).json({ message: 'Not authorized! Please log in' }); // 403 status error is for unauthorized users
  }

  try {
    const payload = jwt.verify(token, process.env.jwtSecret);

    req.user = payload.user;

    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ message: 'Token is not valid!' }); // 403 status error is for unauthorized users
  }
};
