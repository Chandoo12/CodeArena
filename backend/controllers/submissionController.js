const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const { executeCode } = require('../utils/executeCode');

// @route   POST /api/submissions
// @desc    Submit code to be run and evaluated against public test cases
// @access  Private (Must be logged in to submit code)
exports.submitCode = async (req, res) => {
  try {
    const { problemId, language, code } = req.body;

    // 1. Verify the problem exists in our database
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // 2. Pass the code to our Day 7 execution utility to run it in the background terminal
    const runResult = await executeCode(language, code);

    // 3. Map the runner status to our official MongoDB submission model statuses
    let finalStatus = 'Pending';
    let errorMessage = null;

    if (runResult.status === 'Success') {
      finalStatus = 'Accepted'; // For now, we accept it if it runs without crashing
    } else if (runResult.status === 'Time Limit Exceeded') {
      finalStatus = 'Time Limit Exceeded';
      errorMessage = runResult.error;
    } else if (runResult.status === 'Runtime Error') {
      finalStatus = 'Runtime Error';
      errorMessage = runResult.error;
    }

    // 4. Save the full attempt history into MongoDB
    const submission = await Submission.create({
      user: req.user._id, // Set automatically by our protect middleware
      problem: problemId,
      language,
      code,
      status: finalStatus,
      errorMessage
    });

    // 5. Respond back to Postman with the run metrics
    res.status(201).json({
      submissionId: submission._id,
      status: submission.status,
      output: runResult.output,
      error: errorMessage
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};