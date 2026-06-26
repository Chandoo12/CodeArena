const express = require('express');
const router = express.Router();
const { createProblem, getAllProblems, getProblemById } = require('../controllers/problemController');
const { protect, admin } = require('../middleware/authMiddleware');

// 1. This matches: http://localhost:5000/api/problems
router.route('/')
  .post(protect, admin, createProblem)
  .get(getAllProblems);

// 2. This matches: http://localhost:5000/api/problems/:id
router.route('/:id') // <-- CRITICAL: Make sure the colon (:) is there!
  .get(getProblemById);

module.exports = router;