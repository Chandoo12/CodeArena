const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const outputPath = path.join(__dirname, '../temp_code');
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

// Added 'input' parameter to our utility function
const executeCode = (language, code, input = '') => {
  const jobId = uuidv4();
  const extension = language === 'javascript' ? 'js' : 'py';
  const fileName = `${jobId}.${extension}`;
  const filePath = path.join(outputPath, fileName);

  return new Promise((resolve, reject) => {
    // Injecting a clean format: We write the user's code, but we append basic wrappers if inputs exist
    let codeToExecute = code;
    
    // For Python, we can pass inputs via the terminal stdin standard stream, 
    // but a cleaner local test approach is wrapping it or passing it into the execution command.
    
    fs.writeFile(filePath, codeToExecute, (writeErr) => {
      if (writeErr) {
        return reject({ status: 'Server Error', message: writeErr.message });
      }

      let command = '';
      if (language === 'javascript') {
        // Echo input into the node execution script environment
        command = `echo ${JSON.stringify(input)} | node ${filePath}`;
      } else if (language === 'python') {
        // Echo input into the python execution script environment
        command = `echo ${JSON.stringify(input)} | python ${filePath}`;
      }

      // 5-second timeout gate to catch infinite loops
      exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        if (error && error.killed) {
          return resolve({ status: 'Time Limit Exceeded', error: 'Execution timed out (Max 5s)' });
        }

        if (stderr) {
          return resolve({ status: 'Runtime Error', error: stderr.trim() });
        }

        resolve({ status: 'Success', output: stdout.trim() });
      });
    });
  });
};

module.exports = { executeCode };