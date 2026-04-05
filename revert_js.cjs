const fs = require('fs');
let jsPath = 'src/main.js';
let jsCode = fs.readFileSync(jsPath, 'utf8');

const startStr = '// ==========================================\n// AUTHENTICATION LOGIC (PHONE / OTP)\n// ==========================================';
const startIndex = jsCode.indexOf(startStr);

if(startIndex !== -1) {
  let newLogic = fs.readFileSync('revert_auth_logic.txt', 'utf8');
  let finalCode = jsCode.substring(0, startIndex) + newLogic;
  fs.writeFileSync(jsPath, finalCode);
  console.log("Reverted main.js logic");
} else {
  console.log("Could not find auth block in main.js");
}
