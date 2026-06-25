const express = require('express');
const router = express.Router();
const { createProblem, getAllProblems } = require('../controllers/problemController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, admin, createProblem) // Both logged in AND an admin
  .get(getAllProblems);                // Anyone can view problems

module.exports = router;