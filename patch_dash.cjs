const fs = require('fs');
let jsPath = 'src/main.js';
let jsCode = fs.readFileSync(jsPath, 'utf8');

const startStr = '// ==========================================\n// AUTHENTICATION LOGIC\n// ==========================================';
const startIndex = jsCode.indexOf(startStr);

if(startIndex !== -1) {
  let newLogic = fs.readFileSync('dashboard_logic.txt', 'utf8');
  let finalCode = jsCode.substring(0, startIndex + startStr.length + 1) + newLogic;
  fs.writeFileSync(jsPath, finalCode);
  console.log("Patched main.js logic with Dashboard syncing!");
} else {
  console.log("Could not find auth block in main.js");
}
