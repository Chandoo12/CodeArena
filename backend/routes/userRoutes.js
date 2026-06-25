const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

// @route   GET /api/users/profile
// @desc    Get current logged-in user profile (PROTECTED)
router.get('/profile', protect, async (req, res) => {
  try {
    // req.user was set by our protect middleware!
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;