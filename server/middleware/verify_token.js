const jwt = require('jsonwebtoken');

const verifyTokenMiddleware = (req, res, next) => {
  const token = req.header('token');
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = userInfo.userId;
    req.user = userInfo;
    req.token = token;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = verifyTokenMiddleware;
