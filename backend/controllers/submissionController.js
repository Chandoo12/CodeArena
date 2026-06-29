const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const { executeCode } = require('../utils/executeCode');

exports.submitCode = async (req, res) => {
  try {
    const { problemId, language, code } = req.body;

    // 1. Fetch the actual problem to get access to its test cases
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    let finalStatus = 'Accepted';
    let errorMessage = null;

    // 2. Loop through all the test cases saved for this problem
    for (let i = 0; i < problem.testCases.length; i++) {
      const testCase = problem.testCases[i];

      // Run the user's code passing the specific test case input
      const runResult = await executeCode(language, code, testCase.input);

      // Check if the script crashed or timed out
      if (runResult.status === 'Time Limit Exceeded') {
        finalStatus = 'Time Limit Exceeded';
        errorMessage = runResult.error;
        break; // Stop testing further cases if it fails
      } else if (runResult.status === 'Runtime Error') {
        finalStatus = 'Runtime Error';
        errorMessage = runResult.error;
        break; 
      }

      // 3. Match Evaluation: Compare the code's output against the expected database output
      if (runResult.output !== testCase.output.trim()) {
        finalStatus = 'Wrong Answer';
        errorMessage = `Failed on Test Case ${i + 1}. Expected: ${testCase.output}, Got: ${runResult.output}`;
        break; // Fail immediately on the first incorrect test case (Standard Judge Rule)
      }
    }

    // 4. Save the final graded verdict to MongoDB
    const submission = await Submission.create({
      user: req.user._id,
      problem: problemId,
      language,
      code,
      status: finalStatus,
      errorMessage
    });

    res.status(201).json({
      submissionId: submission._id,
      status: submission.status,
      error: errorMessage
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};