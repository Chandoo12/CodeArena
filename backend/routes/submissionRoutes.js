const express = require('express');
const router = express.Router();
const { 
  submitCode, 
  getMySubmissions, 
  getProblemSubmissions 
} = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

// All routes here need the user to be logged in (protected)
router.use(protect);

// Path: http://localhost:5000/api/submissions/
router.route('/').post(submitCode);

// Path: http://localhost:5000/api/submissions/my
router.route('/my').get(getMySubmissions);

// Path: http://localhost:5000/api/submissions/problem/:problemId
router.route('/problem/:problemId').get(getProblemSubmissions);

module.exports = router;