const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Ensure the temp directory exists on the server hard drive
const outputPath = path.join(__dirname, '../temp_code');
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCode = (language, code) => {
  // 1. Generate a completely unique file name
  const jobId = uuidv4();
  const extension = language === 'javascript' ? 'js' : 'py';
  const fileName = `${jobId}.${extension}`;
  const filePath = path.join(outputPath, fileName);

  return new Promise((resolve, reject) => {
    // 2. Write the raw code string into our new file
    fs.writeFile(filePath, code, (writeErr) => {
      if (writeErr) {
        return reject({ status: 'Server Error', message: writeErr.message });
      }

      // 3. Construct the terminal execution command based on the language
      let command = '';
      if (language === 'javascript') {
        command = `node ${filePath}`;
      } else if (language === 'python') {
        command = `python ${filePath}`;
      }

      // 4. Run the code inside a terminal subprocess with a 5-second timeout gate
      exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
        // Always clean up and delete the temporary file after running to save space
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        // If an infinite loop hits and triggers the timeout gate
        if (error && error.killed) {
          return resolve({ status: 'Time Limit Exceeded', error: 'Execution timed out (Max 5s)' });
        }

        // If the user's code breaks/crashes due to bad syntax or reference errors
        if (stderr) {
          return resolve({ status: 'Runtime Error', error: stderr.trim() });
        }

        // Success! Return the clean standard output text
        resolve({ status: 'Success', output: stdout.trim() });
      });
    });
  });
};

module.exports = { executeCode };