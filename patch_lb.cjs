const fs = require('fs');
let jsPath = 'src/main.js';
let jsCode = fs.readFileSync(jsPath, 'utf8');

// 1. Update Imports
jsCode = jsCode.replace(
  "doc, getDoc, setDoc, onSnapshot, updateDoc } from './firebase.js';", 
  "doc, getDoc, setDoc, onSnapshot, updateDoc, collection, getDocs, query, orderBy, limit } from './firebase.js';"
);

// 2. Append Leaderboard function
if(!jsCode.includes('// LEADERBOARD LOGIC')) {
   const lbLogic = fs.readFileSync('leaderboard_payload.txt', 'utf8');
   jsCode += '\n\n' + lbLogic;
}

// 3. Inject Leaderboard hook into navigateTo
if(!jsCode.includes("targetId === 'quests-page' && typeof updateGlobalLeaderboard")) {
   const hookStr = `
    if(targetId === 'quests-page' && typeof updateGlobalLeaderboard === 'function') {
       updateGlobalLeaderboard();
    }
  `;
   jsCode = jsCode.replace('  if (targetPage) {\n    targetPage.classList.remove(\'hidden\');', '  if (targetPage) {\n    targetPage.classList.remove(\'hidden\');' + hookStr);
}

// 4. Fix Smart Alerts click blockers
jsCode = jsCode.replace(
`    if(!window.currentUserProfile) {
       alert("Please login to earn XP for this task!");
       return;
    }`,
`    if(!window.currentUserProfile) {
       console.warn("Guest mode gamification triggered");
    }`
);

fs.writeFileSync(jsPath, jsCode);
console.log("Successfully rebuilt Leaderboard and patched Smart Alerts!");
