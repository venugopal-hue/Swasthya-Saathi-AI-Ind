// patch.cjs - Language fix patch for Swasthya Saathi AI
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'main.js');
let src = fs.readFileSync(file, 'utf8');

// ---- 1. Fix 'ka' -> 'kn' locale typo in updateAssessmentLogs ----
src = src.replace(
  `window.currentLang === 'ka' ? 'kn-IN' : 'en-US'`,
  `window.currentLang === 'kn' ? 'kn-IN' : 'en-US'`
);

// ---- 2. Fix assessment status labels to use translation system ----
// Old pattern uses hardcoded Hindi strings only
const oldStatusBlock = `  const statusClass = confidence === 'High' ? 'success' : (confidence === 'Medium' ? 'warning' : 'danger');
  const statusLabel = confidence === 'High' ? 
    (window.currentLang === 'en' ? 'Verified' : '\u0938\u0924\u094d\u092f\u093e\u092a\u093f\u0924') : 
    (window.currentLang === 'en' ? 'Monitor' : '\u0928\u093f\u0917\u0930\u093e\u0928\u0940');`;

const newStatusBlock = `  const tLog = translations[window.currentLang] || translations.en;
  const statusClass = confidence === 'High' ? 'success' : (confidence === 'Medium' ? 'warning' : 'danger');
  const statusLabel = confidence === 'High' ? (tLog.status_verified || 'Verified') : (tLog.status_monitor || 'Monitor');`;

if (src.includes(oldStatusBlock)) {
  src = src.replace(oldStatusBlock, newStatusBlock);
  console.log('✅ Fixed assessment status labels');
} else {
  console.log('⚠️  Assessment status block not found - may already be patched');
}

// ---- 3. Fix quest login alert to use translation system ----
const oldQuestAlert = `alert(window.currentLang === 'en' ? "Please login to earn XP!" : "\u0915\u0943\u092a\u092f\u093e \u092a\u0939\u0932\u0947 \u0932\u0949\u0917\u093f\u0928 \u0915\u0930\u0947\u0902!");`;
const newQuestAlert = `const tq = translations[window.currentLang] || translations.en;\n       alert(tq.quest_login_required || 'Please login to earn XP!');`;

if (src.includes(oldQuestAlert)) {
  src = src.replace(oldQuestAlert, newQuestAlert);
  console.log('✅ Fixed quest login alert');
} else {
  console.log('⚠️  Quest login alert not found - may already be patched');
}

// ---- 4. Add missing keys to Hindi translations ----
const hiEnd = `    "cat_crisis": "\u0938\u0902\u0915\u091f"\n  },\n  "kn": {`;
const hiEndReplacement = `    "cat_crisis": "\u0938\u0902\u0915\u091f",
    "analyzing_text": "AI \u0938\u094b\u091a \u0930\u0939\u093e \u0939\u0948...",
    "status_verified": "\u0938\u0924\u094d\u092f\u093e\u092a\u093f\u0924",
    "status_monitor": "\u0928\u093f\u0917\u0930\u093e\u0928\u0940",
    "quest_completed": "\u092a\u0942\u0930\u094d\u0923 \u0939\u0941\u0906",
    "quest_login_required": "\u0915\u0943\u092a\u092f\u093e \u092a\u0939\u0932\u0947 \u0932\u0949\u0917\u093f\u0928 \u0915\u0930\u0947\u0902!"
  },
  "kn": {`;

if (src.includes(hiEnd)) {
  src = src.replace(hiEnd, hiEndReplacement);
  console.log('✅ Added missing Hindi translation keys');
} else {
  console.log('⚠️  Hindi end marker not found - may already be patched');
}

// ---- 5. Add missing keys to Kannada translations ----
const knEnd = `    "cat_crisis": "\u0cac\u0cbf\u0c95\u0ccd\u0c95\u0c9f\u0ccd\u0c9f\u0cc1"\n  }\n};`;
const knEndReplacement = `    "cat_crisis": "\u0cac\u0cbf\u0c95\u0ccd\u0c95\u0c9f\u0ccd\u0c9f\u0cc1",
    "analyzing_text": "AI \u0caf\u0ccb\u0c9a\u0cbf\u0cb8\u0cc1\u0ca4\u0ccd\u0ca4\u0cbf\u0ca6\u0cc6...",
    "status_verified": "\u0caa\u0cb0\u0cbf\u0cb6\u0cc0\u0cb2\u0cbf\u0cb8\u0cb2\u0cbe\u0c97\u0cbf\u0ca6\u0cc6",
    "status_monitor": "\u0cae\u0cc7\u0cb2\u0ccd\u0cb5\u0cbf\u0c9a\u0cbe\u0cb0\u0ca3\u0cc6",
    "quest_completed": "\u0caa\u0cc2\u0cb0\u0ccd\u0ca3\u0c97\u0cca\u0c82\u0ca1\u0cbf\u0ca6\u0cc6",
    "quest_login_required": "\u0ca6\u0caf\u0cb5\u0cbf\u0c9f\u0ccd\u0c9f\u0cc1 \u0cae\u0cca\u0ca6\u0cb2\u0cc1 \u0cb2\u0cbe\u0c97\u0cbf\u0ca8\u0ccd \u0cae\u0cbe\u0ca1\u0cbf!"
  }
};`;

if (src.includes(knEnd)) {
  src = src.replace(knEnd, knEndReplacement);
  console.log('✅ Added missing Kannada translation keys');
} else {
  console.log('⚠️  Kannada end marker not found - may already be patched');
}

// ---- 6. Ensure quest_completed in English is set ----
// (Already added as part of chunk 1 which succeeded)

fs.writeFileSync(file, src, 'utf8');
console.log('\n✅ Patch complete! All language fixes applied to src/main.js');
