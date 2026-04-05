const fs = require('fs');
let jsPath = 'src/main.js';
let jsCode = fs.readFileSync(jsPath, 'utf8');

if (!jsCode.includes('// DASHBOARD GAMIFICATION LOGIC')) {
  let newLogic = fs.readFileSync('gamification_logic.txt', 'utf8');
  fs.appendFileSync(jsPath, newLogic);
  console.log("Appended Gamification logic to main.js!");
} else {
  console.log("Gamification logic already exists in main.js");
}
