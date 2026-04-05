const fs = require('fs');
let c = fs.readFileSync('src/main.js', 'utf8');

const regex = /if\s*\(window\.currentUserProfile\s*&&\s*typeof\s*syncProfileUpdate\s*===\s*'function'\)\s*\{\s*const currentXP = window.currentUserProfile.xp \|\| 0;\s*await syncProfileUpdate\({ xp: currentXP \+ xpGain }\);\s*\}/;

const replacement = `if (window.currentUserProfile) {
       const currentXP = window.currentUserProfile.xp || 0;
       if (typeof syncProfileUpdate === 'function') {
           await syncProfileUpdate({ xp: currentXP + xpGain });
       } else {
           window.currentUserProfile.xp = currentXP + xpGain;
           if (typeof renderDashboardProfile === 'function') {
               renderDashboardProfile();
           }
       }
    }`;

c = c.replace(regex, replacement);
fs.writeFileSync('src/main.js', c);
console.log("Done");
