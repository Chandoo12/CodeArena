const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Protect routes from unauthenticated users
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in the Authorization Header (Format: Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token string
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the database (minus the password) and attach to request
      req.user = await User.findById(decoded.id).select('-password');

      return next(); // Move to the next middleware or controller
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// 2. Restrict routes to Admin only
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };