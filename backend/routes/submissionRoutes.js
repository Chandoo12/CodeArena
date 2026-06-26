const express = require('express');
const router = express.Router();
const { submitCode } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

// Path: http://localhost:5000/api/submissions
router.route('/')
  .post(protect, submitCode); // Must be a logged in user to submit code

module.exports = router;