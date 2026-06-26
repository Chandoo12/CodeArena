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

// @route   GET /api/problems/:id
// @desc    Get a single problem by its unique database ID
// @access  Public (Anyone can look at a problem description)
exports.getProblemById = async (req, res) => {
  try {
    // 1. req.params.id extracts the ID directly from the URL path
    const problem = await Problem.findById(req.params.id);

    // 2. If no problem exists with that ID, return a 404 Not Found error
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // 3. If found, send the complete problem data back to the frontend
    res.json(problem);
  } catch (error) {
    // 4. If the user types a corrupted/invalid ID length, handle the crash gracefully
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};