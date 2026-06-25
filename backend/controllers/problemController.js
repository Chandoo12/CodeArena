const Problem = require('../models/Problem');

// @route   POST /api/problems
// @desc    Create a new problem (ADMIN ONLY)
exports.createProblem = async (req, res) => {
  try {
    const { title, description, constraints, difficulty, tags, testCases } = req.body;

    const problem = await Problem.create({
      title,
      description,
      constraints,
      difficulty,
      tags,
      testCases,
      createdBy: req.user._id // Provided by protect middleware
    });

    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @route   GET /api/problems
// @desc    Get all problems (PUBLIC)
exports.getAllProblems = async (req, res) => {
  try {
    // Exclude hidden test cases from standard list view for security
    const problems = await Problem.find().select('-testCases');
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};