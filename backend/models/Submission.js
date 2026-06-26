const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  language: { type: String, enum: ['javascript', 'python'], required: true },
  code: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error'], 
    default: 'Pending' 
  },
  errorMessage: { type: String }, // Captured if the code crashes
  executedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);