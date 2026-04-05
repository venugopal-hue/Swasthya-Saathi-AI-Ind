import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'src', 'main.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace currentLang init and applyLanguage function
const oldBlock = `let currentLang = 'en';\r\n\r\nfunction applyLanguage(lang) {\r\n  currentLang = lang;\r\n  document.querySelectorAll('[data-i18n]').forEach(el => {\r\n    const key = el.getAttribute('data-i18n');\r\n    if (translations[lang] && translations[lang][key]) {\r\n      el.innerText = translations[lang][key];\r\n    }\r\n  });\r\n  \r\n  document.querySelectorAll('[data-i18n-ph]').forEach(el => {\r\n    const key = el.getAttribute('data-i18n-ph');\r\n    if (translations[lang] && translations[lang][key]) {\r\n      el.placeholder = translations[lang][key];\r\n    }\r\n  });\r\n\r\n  document.documentElement.lang = lang;\r\n  \r\n  // Sync Chatbot Action Buttons\r\n  document.querySelectorAll('.chatbot-lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));\r\n  \r\n  // Toggle existing bot messages\r\n  const L = typeof CHATBOT_REPLIES !== "undefined" ? (CHATBOT_REPLIES[lang] || CHATBOT_REPLIES.en) : null;\r\n  if(L) {\r\n    document.querySelectorAll('.msg-bubble[data-reply-key]').forEach(bubble => {\r\n       const key = bubble.getAttribute('data-reply-key');\r\n       if (key === 'defaults') {\r\n           const dIdx = parseInt(bubble.getAttribute('data-default-idx') || '0', 10);\r\n           bubble.innerHTML = L.defaults[dIdx] || L.defaults[0];\r\n       } else if (L[key]) {\r\n           bubble.innerHTML = L[key];\r\n       }\r\n    });\r\n  }\r\n\r\n  if (typeof renderWellnessQuestions === 'function') {\r\n    renderWellnessQuestions();\r\n    // also hide the results when switching languages to avoid text-mismatch state\r\n    const res = document.getElementById('wellness-results');\r\n    if(res) res.classList.add('hidden');\r\n  }\r\n}`;

const newBlock = `let currentLang = localStorage.getItem('ss_lang') || 'en';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('ss_lang', lang);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.innerText = translations[lang][key];
    }
  });
  
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (translations[lang] && translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  document.documentElement.lang = lang;

  // Update the language toggle button label to show current language
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    const labels = { en: 'EN', hi: '\u0939\u093f', kn: '\u0c95' };
    langToggle.innerText = labels[lang] || 'EN';
  }
  
  // Sync Chatbot Action Buttons
  document.querySelectorAll('.chatbot-lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  
  // Toggle existing bot messages
  const L = typeof CHATBOT_REPLIES !== "undefined" ? (CHATBOT_REPLIES[lang] || CHATBOT_REPLIES.en) : null;
  if(L) {
    document.querySelectorAll('.msg-bubble[data-reply-key]').forEach(bubble => {
       const key = bubble.getAttribute('data-reply-key');
       if (key === 'defaults') {
           const dIdx = parseInt(bubble.getAttribute('data-default-idx') || '0', 10);
           bubble.innerHTML = L.defaults[dIdx] || L.defaults[0];
       } else if (L[key]) {
           bubble.innerHTML = L[key];
       }
    });
  }

  if (typeof renderWellnessQuestions === 'function') {
    renderWellnessQuestions();
    const res = document.getElementById('wellness-results');
    if(res) res.classList.add('hidden');
  }
}`;

// normalize line endings for matching
const normalizedContent = content.replace(/\r\n/g, '\n');
const normalizedOld = oldBlock.replace(/\r\n/g, '\n');

const idx = normalizedContent.indexOf(normalizedOld);
if (idx === -1) {
  // try a simple key phrase match as fallback
  const startMarker = "let currentLang = 'en';";
  const endMarker = "// ==========================================\n// AUTHENTICATION & PROFILE LOGIC";
  
  const start = normalizedContent.indexOf(startMarker);
  const end = normalizedContent.indexOf(endMarker);
  
  if (start === -1 || end === -1) {
    console.error("Could not locate applyLanguage block. Manual fix needed.");
    process.exit(1);
  }
  
  const fixed = normalizedContent.substring(0, start) + newBlock + '\n\n' + normalizedContent.substring(end);
  fs.writeFileSync(filePath, fixed, 'utf8');
  console.log("applyLanguage patched via fallback marker.");
} else {
  const fixed = normalizedContent.substring(0, idx) + newBlock + normalizedContent.substring(idx + normalizedOld.length);
  fs.writeFileSync(filePath, fixed, 'utf8');
  console.log("applyLanguage patched successfully.");
}
