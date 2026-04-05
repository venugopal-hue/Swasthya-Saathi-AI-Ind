import './style.css'

import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, db, doc, getDoc, setDoc, onSnapshot, updateDoc, query, collection, orderBy, limit, getDocs } from './firebase.js';

// --- i18n Translations ---
const translations = {
  "en": {
    "nav_home": "Home",
    "nav_checker": "Symptom Checker",
    "nav_chatbot": "Chatbot",
    "nav_dashboard": "Dashboard",
    "nav_emergency": "Emergency",
    "hero_title": "Where Care Meets Intelligence",
    "hero_subtitle": "Empowering you with AI-driven early disease detection, 24/7 mental health support, and instant access to doctors.",
    "btn_check_symptoms": "Check Symptoms Now",
    "btn_talk_ai": "Talk to AI Therapist",
    "features_title": "Comprehensive Health Platform",
    "feat_1_title": "Early Disease Detection",
    "feat_1_desc": "Input your symptoms and let our advanced AI suggest possible conditions and precautions.",
    "feat_2_title": "Mental Health Chatbot",
    "feat_2_desc": "A safe, confidential space to chat about your feelings and receive emotional support.",
    "feat_3_title": "Comprehensive Support",
    "feat_3_desc": "Get tailored health advice and emotional support whenever you need it.",
    "feat_4_title": "Smart Alerts & Tracking",
    "feat_4_desc": "Get reminders for hydration, meds, and track your daily health streaks for rewards.",
    "feat_5_title": "Mental Wellness Assessment",
    "feat_5_desc": "Take structured mental health tests and monitor your emotional well-being.",
    "feat_6_title": "Instant Emergency Access",
    "feat_6_desc": "One-tap access to national health helplines for critical situations.",
    "checker_title": "AI Symptom Checker",
    "checker_subtitle": "Describe what you're experiencing, and our AI will provide insights.",
    "checker_label": "How are you feeling today?",
    "btn_analyze": "Analyze Symptoms",
    "btn_analyze_text": "Analyze Symptoms",
    "analyzing_text": "AI is thinking...",
    "possible_conditions": "Possible Conditions",
    "precautions_title": "Recommended Precautions",
    "consult_advice": "For an accurate diagnosis, please consult a medical professional.",
    "btn_consult_dr": "Consult Doctor Online",
    "bot_title": "Swasthya Saathi AI",
    "bot_status": "Online - Here to listen",
    "btn_manas": "Call MANAS (14416)",
    "chat_placeholder": "Type your message here...",
    "dashboard_title": "Your Health Dashboard",
    "streak_title": "Health Streak",
    "streak_msg": "You're doing great! Keep logging daily.",
    "btn_checkin": "Daily Check-in",
    "alerts_title": "Smart Reminders",
    "history_title": "Recent Assessments",
    "th_date": "Date",
    "th_symptoms": "Symptoms",
    "th_prediction": "AI Prediction",
    "th_status": "Status",
    "emg_title": "Emergency Services",
    "emg_desc": "If you are experiencing a life-threatening emergency, please contact authorities.",
    "medicines_title": "Over-the-Counter Suggestions",
    "medicines_disclaimer": "*Disclaimer: Suggestions only. Consult a doctor.",
    "nav_wellness": "Wellness Test",
    "wellness_title": "Mental Wellness Assessment",
    "wellness_subtitle": "Quick screening for your emotional well-being.",
    "btn_submit_wellness": "Calculate Score",
    "btn_submit_wellness_text": "Calculate Score",
    "wellness_result_title": "Assessment Results",
    "wellness_disclaimer": "*Preliminary screening, not clinical diagnosis.",
    "btn_talk_ai_wellness": "Discuss with Saathi AI",
    "btn_reset_wellness": "Reset Test",
    "btn_reset_wellness_text": "Reset Test",
    "alert_move_title": "Time to Move!",
    "alert_move_desc": "It's been a while. A 15-minute walk helps maintain your streak.",
    "alert_water_title": "Drink Water",
    "alert_water_desc": "You haven't logged water lately. Time for a glass!",
    "trophy_title": "Trophy Case",
    "badge1_name": "First Steps",
    "badge2_name": "7-Day Streak",
    "badge3_name": "Solver",
    "badge4_name": "Master",
    "no_assessments_msg": "No assessments recorded yet. Take a symptom test!",
    "quests_title": "Health Quests",
    "quests_subtitle": "Turn healthy habits into a rewarding adventure.",
    "streak_days_suffix": "Day Streak",
    "level_text": "Level",
    "xp_text": "XP",
    "daily_challenges": "Daily Challenges",
    "btn_complete": "Complete",
    "quest1_title": "Hydration Hero",
    "quest1_desc": "Drink 8 glasses of water today.",
    "quest2_title": "Active Walker",
    "quest2_desc": "Complete a 15-minute walk.",
    "quest3_title": "Mindful Moment",
    "quest3_desc": "Take the Wellness Test.",
    "weekly_milestones": "Weekly Milestones",
    "milestone_badge": "Milestone",
    "w_quest1_title": "Wellness Champion",
    "w_quest1_desc": "Complete your wellness check-in 3 times this week.",
    "reward_label": "Reward",
    "btn_claim": "Claim Achievement",
    "leaderboard_title": "Global Leaderboard",
    "lb_you": "You",
    "lb_current_badge": "Current",
    "cat_general": "General",
    "cat_anxiety": "Anxiety",
    "cat_mood": "Mood",
    "cat_stress": "Stress",
    "cat_sleep": "Sleep",
    "cat_relations": "Relations",
    "cat_selfcare": "Self-care",
    "cat_crisis": "Crisis",
    "status_verified": "Verified",
    "status_monitor": "Monitor",
    "quest_completed": "Completed",
    "quest_login_required": "Please login to earn XP!",
    "btn_reset_checker": "Reset",
    "auth_welcome": "Welcome Back",
    "auth_welcome_sub": "Login to access premium features.",
    "auth_create": "Create Account",
    "auth_create_sub": "Join to track your health journey.",
    "auth_signin": "Sign In",
    "auth_signup": "Sign Up",
    "auth_processing": "Processing...",
    "auth_already_have": "Already have an account?",
    "auth_need_account": "Don't have an account?",
    "rank_bronze": "Bronze",
    "rank_silver": "Silver",
    "rank_gold": "Gold",
    "rank_diamond": "Diamond",
    "level_prefix": "Level",
    "day_prefix": "Day",
    "btn_logout": "Logout",
    "art_ai_analysis": "AI Analysis",
    "art_accuracy": "98.5% Accuracy",
    "art_mental_support": "Mental Support",
    "art_available": "24/7 Available",
    "btn_edit": "Edit",
    "ph_enter_name": "Enter new name",
    "btn_save": "Save",
    "btn_cancel": "Cancel",
    "label_rank_level": "Rank / Level",
    "label_hp": "Health Points",
    "label_email": "Email Address",
    "ph_email": "you@example.com",
    "label_password": "Password",
    "ph_password": "••••••••",
    "wellness_q1": "Little interest or pleasure in doing things",
    "wellness_q2": "Feeling down, depressed, or hopeless",
    "wellness_q3": "Trouble sleeping or sleeping too much",
    "wellness_q4": "Feeling tired or having little energy",
    "wellness_q5": "Poor appetite or overeating",
    "wellness_q6": "Feeling bad about yourself — or that you're a failure",
    "wellness_q7": "Trouble concentrating on things",
    "wellness_q8": "Moving/speaking slowly or being restless",
    "wellness_q9": "Thoughts of hurting yourself or better off dead",
    "wellness_label_0": "Not at all",
    "wellness_label_1": "Several days",
    "wellness_label_2": "More than half",
    "wellness_label_3": "Nearly every day",
    "wellness_score_msg": "Your Wellness Score",
    "depression_minimal": "Minimal depression",
    "depression_mild": "Mild depression",
    "depression_moderate": "Moderate depression",
    "depression_severe": "Severe depression",
    "depression_adv_3": "Please reach out to a professional immediately. You are not alone.",
    "notif_welcome": "Welcome back, {name}!",
    "notif_quest": "Quest Completed! +{xp} XP",
    "notif_level_up": "LEVEL UP! You are now Level {level}",
    "quest_login_required": "Please login to claim rewards!",
    "quest_completed": "Completed!",
    "chat_engine_init": "Saathi AI Engine initialized.",
    "wellness_score_msg": "Analysis complete."
  },
  "hi": {
    "nav_home": "मुख्य पृष्ठ",
    "nav_checker": "लक्षण जांचकर्ता",
    "nav_chatbot": "चैटबॉट",
    "nav_wellness": "कल्याण परीक्षण",
    "nav_dashboard": "डैशबोर्ड",
    "nav_emergency": "आपातकालीन",
    "hero_title": "जहाँ देखभाल और बुद्धिमत्ता मिलते हैं",
    "hero_subtitle": "एआई-संचालित शीघ्र रोग पहचान और 24/7 मानसिक स्वास्थ्य सहायता।",
    "btn_check_symptoms": "अब लक्षण जांचें",
    "btn_talk_ai": "AI थेरेपिस्ट से बात करें",
    "features_title": "व्यापक स्वास्थ्य मंच",
    "feat_1_title": "रोग का शीघ्र पता लगाना",
    "feat_1_desc": "अपने लक्षण दर्ज करें और हमारे उन्नत AI को सुझाव देने दें।",
    "feat_2_title": "मानसिक स्वास्थ्य चैटबॉट",
    "feat_2_desc": "अपनी भावनाओं को साझा करने के लिए एक सुरक्षित स्थान।",
    "feat_3_title": "व्यापक सहायता",
    "feat_3_desc": "जब भी आपको आवश्यकता हो, स्वास्थ्य सलाह और भावनात्मक समर्थन प्राप्त करें।",
    "feat_4_title": "स्मार्ट अलर्ट और ट्रैकिंग",
    "feat_4_desc": "हाइड्रेशन, दवाओं के लिए रिमाइंडर्स और स्ट्रीक ट्रैकिंग।",
    "feat_5_title": "मानसिक कल्याण मूल्यांकन",
    "feat_5_desc": "संरचित मानसिक स्वास्थ्य परीक्षण लें और निगरानी करें।",
    "feat_6_title": "त्वरित आपातकालीन पहुंच",
    "feat_6_desc": "राष्ट्रीय स्वास्थ्य हेल्पलाइन नंबरों तक सीधी पहुंच।",
    "checker_title": "AI लक्षण जांचकर्ता",
    "checker_subtitle": "अपनी स्थिति बताएं, हमारा AI मदद करेगा।",
    "checker_label": "आज आप कैसा महसूस कर रहे हैं?",
    "btn_analyze": "लक्षणों का विश्लेषण करें",
    "btn_analyze_text": "विश्लेषण करें",
    "analyzing_text": "AI सोच रहा है...",
    "possible_conditions": "संभावित स्थितियां",
    "precautions_title": "सुझाई गई सावधानियां",
    "consult_advice": "सटीक निदान के लिए, कृपया डॉक्टर से परामर्श लें।",
    "btn_consult_dr": "डॉक्टर से ऑनलाइन सलाह लें",
    "bot_title": "स्वास्थ्य साथी AI",
    "bot_status": "ऑनलाइन - बात करने के लिए उपलब्ध",
    "btn_manas": "MANAS कॉल करें (14416)",
    "chat_placeholder": "अपना संदेश यहाँ लिखें...",
    "dashboard_title": "आपका स्वास्थ्य डैशबोर्ड",
    "streak_title": "स्वास्थ्य स्ट्रीक",
    "streak_msg": "बहुत बढ़िया! रोज़ाना लॉग इन करते रहें।",
    "btn_checkin": "दैनिक चेक-इन",
    "alerts_title": "स्मार्ट रिमाइंडर्स",
    "history_title": "हाल के आकलन",
    "th_date": "दिनांक",
    "th_symptoms": "लक्षण",
    "th_prediction": "AI भविष्यवाणी",
    "th_status": "स्थिति",
    "emg_title": "आपातकालीन सेवाएं",
    "emg_desc": "आपात स्थिति में कृपया तुरंत अधिकारियों से संपर्क करें।",
    "medicines_title": "दवा सुझाव",
    "medicines_disclaimer": "*सुझाव मात्र। डॉक्टर से सलाह लें।",
    "wellness_title": "मानसिक कल्याण मूल्यांकन",
    "wellness_subtitle": "भावनात्मक कल्याण को समझने के लिए त्वरित उपकरण।",
    "btn_submit_wellness": "स्कोर की गणना करें",
    "btn_submit_wellness_text": "गणना करें",
    "wellness_result_title": "मूल्यांकन परिणाम",
    "wellness_disclaimer": "*प्रारंभिक स्क्रीनिंग, नैदानिक निदान नहीं।",
    "btn_talk_ai_wellness": "साथी AI से चर्चा करें",
    "btn_reset_wellness": "टेस्ट रीसेट करें",
    "btn_reset_wellness_text": "रीसेट करें",
    "alert_move_title": "चलने का समय!",
    "alert_move_desc": "काफी समय हो गया है। 15 मिनट की सैर करें।",
    "alert_water_title": "पानी पिएं",
    "alert_water_desc": "एक गिलास पानी का समय है!",
    "trophy_title": "ट्रॉफी केस",
    "badge1_name": "पहला कदम",
    "badge2_name": "7-दिवसीय स्ट्रीक",
    "badge3_name": "सॉल्वर",
    "badge4_name": "मास्टर",
    "no_assessments_msg": "अभी तक कोई आकलन नहीं। लक्षण परीक्षण लें!",
    "quests_title": "स्वास्थ्य खोज",
    "quests_subtitle": "स्वस्थ आदतों को रोमांच में बदलें।",
    "streak_days_suffix": "दिन की लय",
    "level_text": "स्तर",
    "xp_text": "XP",
    "daily_challenges": "दैनिक चुनौतियां",
    "btn_complete": "पूरा करें",
    "quest1_title": "हाइड्रेशन हीरो",
    "quest1_desc": "आज 8 गिलास पानी पिएं।",
    "quest2_title": "सक्रिय वॉकर",
    "quest2_desc": "15 मिनट की सैर पूरी करें।",
    "quest3_title": "सचेत पल",
    "quest3_desc": "कल्याण परीक्षण लें।",
    "w_quest1_title": "कल्याण चैंपियन",
    "w_quest1_desc": "इस सप्ताह 3 बार अपना कल्याण चेक-इन पूरा करें।",
    "reward_label": "इनाम",
    "btn_claim": "दावा करें",
    "leaderboard_title": "ग्लोबल लीडरबोर्ड",
    "lb_you": "आप",
    "lb_current_badge": "वर्तमान",
    "cat_general": "सामान्य",
    "cat_anxiety": "चिंता",
    "cat_mood": "मनोदशा",
    "cat_stress": "तनाव",
    "cat_sleep": "नींद",
    "cat_relations": "संबंध",
    "cat_selfcare": "आत्म-देखभाल",
    "cat_crisis": "संकट",
    "status_verified": "सत्यापित",
    "status_monitor": "निगरानी",
    "quest_completed": "पूरा हुआ",
    "quest_login_required": "XP अर्जित करने के लिए लॉगिन करें!",
    "answer_all_questions": "कृपया सभी प्रश्नों के उत्तर दें।",
    "btn_reset_checker": "रीसेट करें",
    "auth_welcome": "पधारें",
    "auth_welcome_sub": "प्रीमियम सुविधाओं तक पहुँचने के लिए लॉगिन करें।",
    "auth_create": "खाता बनाएँ",
    "auth_create_sub": "अपनी स्वास्थ्य यात्रा को ट्रैक करने के लिए शामिल हों।",
    "auth_signin": "साइन इन करें",
    "auth_signup": "साइन अप करें",
    "auth_processing": "प्रक्रिया जारी है...",
    "auth_already_have": "पहले से खाता है?",
    "auth_need_account": "खाता नहीं है?",
    "rank_bronze": "कांस्य",
    "rank_silver": "रजत",
    "rank_gold": "स्वर्ण",
    "rank_diamond": "हीरा",
    "level_prefix": "स्तर",
    "day_prefix": "दिन",
    "btn_logout": "लॉगआउट",
    "art_ai_analysis": "AI विश्लेषण",
    "art_accuracy": "98.5% सटीकता",
    "art_mental_support": "मानसिक सहायता",
    "art_available": "24/7 उपलब्ध",
    "btn_edit": "संपादन",
    "ph_enter_name": "नया नाम दर्ज करें",
    "btn_save": "सहेजें",
    "btn_cancel": "रद्द करें",
    "label_rank_level": "रैंक / स्तर",
    "label_hp": "स्वास्थ्य बिंदु",
    "label_email": "ईमेल पता",
    "ph_email": "you@example.com",
    "label_password": "पासवर्ड",
    "ph_password": "••••••••",
    "wellness_q1": "काम करने में कम रुचि या खुशी महसूस करना",
    "wellness_q2": "उदास, निराश या लाचार महसूस करना",
    "wellness_q3": "सोने में परेशानी या बहुत अधिक सोना",
    "wellness_q4": "थका हुआ महसूस करना या ऊर्जा की कमी",
    "wellness_q5": "कम भूख लगना या बहुत अधिक खाना",
    "wellness_q6": "अपने बारे में बुरा महसूस करना - या असफल महसूस करना",
    "wellness_q7": "चीजों पर ध्यान केंद्रित करने में परेशानी",
    "wellness_q8": "धीरे बोलना/घूमना या बहुत अधिक बेचैनी",
    "wellness_q9": "खुद को नुकसान पहुँचाने या मरने के विचार",
    "wellness_label_0": "बिल्कुल नहीं",
    "wellness_label_1": "कई दिनों तक",
    "wellness_label_2": "आधे से अधिक दिन",
    "wellness_label_3": "लगभग हर दिन",
    "wellness_score_msg": "आपका स्वास्थ्य स्कोर",
    "depression_minimal": "न्यूनतम अवसाद",
    "depression_mild": "हल्का अवसाद",
    "depression_moderate": "मध्यम अवसाद",
    "depression_severe": "गंभीर अवसाद",
    "depression_adv_3": "कृपया तुरंत किसी पेशेवर से संपर्क करें। आप अकेले नहीं हैं।",
    "notif_welcome": "वापसी पर स्वागत है, {name}!",
    "notif_quest": "खोज पूरी हुई! +{xp} XP",
    "notif_level_up": "स्तर ऊपर! अब आप स्तर {level} पर हैं",
    "quest_login_required": "पुरस्कार प्राप्त करने के लिए कृपया लॉगिन करें!",
    "quest_completed": "पूरा हुआ!",
    "chat_engine_init": "साथी AI इंजन शुरू हुआ।",
    "wellness_score_msg": "विश्लेषण पूरा हुआ।"
  }
};

let currentLang = localStorage.getItem('ss_lang') || 'en';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('ss_lang', lang);

  // 1. Bulk Attribute-based translation
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      const hasChildElements = [...el.childNodes].some(n => n.nodeType === 1);
      if (hasChildElements) {
        el.childNodes.forEach(node => {
          if (node.nodeType === 3) node.textContent = translations[lang][key];
        });
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (translations[lang] && translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  const resetChecker = document.getElementById('reset-checker-btn');
  if (resetChecker && translations[lang].btn_reset_checker) {
    resetChecker.innerHTML = `<i class="ph-bold ph-arrow-counter-clockwise"></i> ${translations[lang].btn_reset_checker}`;
  }

  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    const labels = { en: 'EN', hi: 'हि' };
    langToggle.textContent = labels[lang] || 'EN';
  }

  const loginBtnEl = document.getElementById('login-btn');
  if (loginBtnEl && translations[lang].auth_signin) {
     loginBtnEl.innerHTML = `<i class="ph-bold ph-sign-in"></i> ${translations[lang].auth_signin}`;
  }

  const logoutBtnEl = document.getElementById('logout-btn');
  if (logoutBtnEl && translations[lang].btn_logout) {
     logoutBtnEl.innerText = translations[lang].btn_logout;
  }

  updateAuthUiMode();

  document.documentElement.lang = lang;
  window.currentLang = lang;

  document.querySelectorAll('.chatbot-lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));

  const L = typeof CHATBOT_REPLIES !== "undefined" ? (CHATBOT_REPLIES[lang] || CHATBOT_REPLIES.en) : null;
  if (L) {
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

  if (typeof renderWellnessQuestions === 'function') renderWellnessQuestions();
  if (window.currentUserProfile) renderDashboardProfile();
}

// ==========================================
// AUTHENTICATION & PROFILE LOGIC
// ==========================================
window.isUserLoggedIn = false;
window.currentUserProfile = null;
let profileUnsubscribe = null;

const authModal = document.getElementById('auth-modal');
const closeAuthModal = document.getElementById('close-auth-modal');
const loginBtn = document.getElementById('login-btn');
const userProfileBtn = document.getElementById('user-profile-btn');
const logoutBtn = document.getElementById('logout-btn');
const userDropdown = document.getElementById('user-dropdown');
const authForm = document.getElementById('auth-form');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authError = document.getElementById('auth-error');
const authTitle = document.getElementById('auth-title');
const authSubtitle = document.getElementById('auth-subtitle');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authSwitchBtn = document.getElementById('auth-switch-btn');
const authSwitchText = document.getElementById('auth-switch-text');

let isLoginMode = true;

const navLinks = document.querySelectorAll('.nav-links a');
const pages = document.querySelectorAll('.page');
const menuToggle = document.getElementById('menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');

// Mobile Menu Toggle
if (menuToggle && navLinksContainer) {
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinksContainer.classList.toggle('show');
    const icon = menuToggle.querySelector('i');
    if (navLinksContainer.classList.contains('show')) {
      icon.className = 'ph ph-x';
    } else {
      icon.className = 'ph ph-list';
    }
  });
}

function navigateTo(targetId) {
  const protectedRoutes = ['quests-page', 'dashboard-page'];
  if (protectedRoutes.includes(targetId) && !window.isUserLoggedIn) {
    if (authModal) authModal.classList.remove('hidden');
    return;
  }

  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('data-target') === targetId));
  pages.forEach(page => {
    if (page.id === targetId) {
      page.classList.remove('hidden');
      page.classList.add('active');
    } else {
      page.classList.add('hidden');
      page.classList.remove('active');
    }
  });

  if (navLinksContainer) navLinksContainer.classList.remove('show');
  const menuIcon = document.querySelector('#menu-toggle i');
  if (menuIcon) menuIcon.className = 'ph ph-list';
  window.scrollTo(0, 0);

  if (targetId === 'dashboard-page' || targetId === 'quests-page') {
    if (typeof fetchLeaderboard === 'function') fetchLeaderboard();
  }

}

function updateAuthUiMode() {
  if (authError) authError.classList.add('hidden');
  const lang = currentLang || 'en';
  const T = translations[lang] || translations.en;

  if (isLoginMode) {
    authTitle.innerText = T.auth_welcome || "Welcome Back";
    authSubtitle.innerText = T.auth_welcome_sub || "Login to access premium features.";
    authSubmitBtn.innerText = T.auth_signin || "Sign In";
    if (authSwitchText) authSwitchText.innerText = T.auth_need_account || "Don't have an account?";
    authSwitchBtn.innerText = T.auth_signup || "Sign Up";
  } else {
    authTitle.innerText = T.auth_create || "Create Account";
    authSubtitle.innerText = T.auth_create_sub || "Join to track your health journey.";
    authSubmitBtn.innerText = T.auth_signup || "Sign Up";
    if (authSwitchText) authSwitchText.innerText = T.auth_already_have || "Already have an account?";
    authSwitchBtn.innerText = T.auth_signin || "Sign In";
  }
}

document.addEventListener('click', (e) => {
  const target = e.target;

  if (target.id === 'lang-toggle' || target.closest('#lang-toggle')) {
    const nextLang = currentLang === 'en' ? 'hi' : 'en';
    applyLanguage(nextLang);
  }

  const navLink = target.closest('.nav-links a');
  if (navLink) {
    e.preventDefault();
    navigateTo(navLink.getAttribute('data-target'));
  }

  const dataNav = target.closest('[data-nav]');
  if (dataNav) {
    e.preventDefault();
    navigateTo(dataNav.getAttribute('data-nav'));
  }

  if (target.id === 'login-btn' || target.closest('#login-btn')) {
    isLoginMode = true;
    updateAuthUiMode();
    if (authModal) authModal.classList.remove('hidden');
  }

  if (target.id === 'close-auth-modal' || target.closest('#close-auth-modal')) {
    if (authModal) authModal.classList.add('hidden');
    if (authError) authError.classList.add('hidden');
    if (authForm) authForm.reset();
  }

  const emergencyModal = document.getElementById('emergency-modal');
  if (target.id === 'emergency-btn' || target.closest('#emergency-btn')) {
    if (emergencyModal) emergencyModal.classList.remove('hidden');
  }

  if (target.id === 'close-modal-btn' || target.closest('#close-modal-btn') || target.id === 'close-modal-overlay') {
    if (emergencyModal) emergencyModal.classList.add('hidden');
  }

  if (target.id === 'auth-switch-btn' || target.closest('#auth-switch-btn')) {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    updateAuthUiMode();
  }

  if (target.id === 'user-profile-btn' || target.closest('#user-profile-btn')) {
    e.stopPropagation();
    if (userDropdown) userDropdown.classList.toggle('hidden');
  } else if (userDropdown && !target.closest('#user-profile-btn')) {
    userDropdown.classList.add('hidden');
  }
});

if (authForm) {
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (authError) authError.classList.add('hidden');
    const email = authEmail.value;
    const password = authPassword.value;

    try {
      authSubmitBtn.innerText = "Processing...";
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      authModal.classList.add('hidden');
      authForm.reset();
    } catch (err) {
      if (authError) {
        authError.innerText = err.message || "Authentication failed.";
        authError.classList.remove('hidden');
      }
    } finally {
      authSubmitBtn.innerText = isLoginMode ? "Sign In" : "Sign Up";
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    if (auth) signOut(auth).catch(err => console.error(err));
  });
}

if (auth) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      updateAuthUI(true);
      await initializeUserProfile(user);
    } else {
      updateAuthUI(false);
      if (profileUnsubscribe) { profileUnsubscribe(); profileUnsubscribe = null; }
      window.currentUserProfile = null;
      const currentActive = document.querySelector('.page.active');
      if (currentActive && ['quests-page', 'dashboard-page'].includes(currentActive.id)) {
        navigateTo('home-page');
      }
    }
  });
}

async function initializeUserProfile(user) {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        xp: 0,
        streak: 0,
        lastLogin: new Date().toISOString()
      });
    }
    profileUnsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        window.currentUserProfile = snapshot.data();
        renderDashboardProfile();
      }
    });
  } catch (err) { console.error("Profile Error:", err); }
}

function renderDashboardProfile() {
  const profile = window.currentUserProfile;
  if (!profile) return;
  const lang = currentLang || 'en';
  const T = translations[lang] || translations.en;

  const dashName = document.getElementById('dash-user-name');
  const dashEmail = document.getElementById('dash-user-email');
  const dashInitial = document.getElementById('dash-user-initial');
  const dashLevel = document.getElementById('dash-user-level');
  const dashXP = document.getElementById('dash-user-xp');
  const navUserSpan = document.querySelector('.user-profile-btn span');
  const dropdownGreeting = document.getElementById('dropdown-greeting-name');
  const streakCounter = document.getElementById('streak-counter');
  const streakDisplay = document.getElementById('streak-count');
  const userLevelQ = document.getElementById('user-level');
  const userXpQ = document.getElementById('user-xp');
  const xpProgressBar = document.getElementById('xp-progress-bar');
  const lbXpDisplay = document.getElementById('lb-user-xp-display');

  if (dropdownGreeting) dropdownGreeting.innerText = profile.name ? profile.name.split(' ')[0] : (lang === 'hi' ? 'उपयोगकर्ता' : 'User');
  if (dashName) dashName.innerText = profile.name || 'User';
  if (dashEmail) dashEmail.innerText = profile.email || '';
  if (profile.name) {
    const initial = profile.name.charAt(0).toUpperCase();
    if (dashInitial) dashInitial.innerText = initial;
    if (navUserSpan) navUserSpan.innerText = initial;
  }

  const xp = profile.xp || 0;
  const streak = profile.streak || 0;
  const xpLabel = T.xp_text || 'XP';
  const daySuffix = T.streak_days_suffix || 'Day Streak';

  if (dashXP) dashXP.innerText = `${xp} ${xpLabel}`;
  if (streakCounter) streakCounter.innerText = streak;
  if (streakDisplay) streakDisplay.innerText = `${streak} ${daySuffix}`;
  if (lbXpDisplay) lbXpDisplay.innerText = `${xp} ${xpLabel}`;

  const level = Math.floor(xp / 100) + 1;
  const nextLevelXp = level * 100;
  const progressPercent = xp % 100;
  
  if (userLevelQ) userLevelQ.innerText = level;
  if (userXpQ) userXpQ.innerText = `${xp} ${xpLabel} / ${nextLevelXp} ${xpLabel}`;
  if (xpProgressBar) {
    xpProgressBar.style.width = progressPercent + '%';
    xpProgressBar.style.background = 'linear-gradient(90deg, #0ea5e9, #10b981)';
  }

  if (xp > 0 && Math.floor(xp / 100) > Math.floor((window.prevXp || 0) / 100)) {
    showToast(`${T.notif_level_up.replace('{level}', level)}! 🏆`, 'success');
    if (typeof confetti === 'function') confetti({ particleCount: 200, spread: 90, origin: { y: 0.5 } });
  }
  window.prevXp = xp;

  if (dashLevel) {
    let rankKey = "rank_newbie", icon = "ph-medal", color = "var(--primary)";
    if (xp >= 1000) { rankKey = "rank_diamond"; color = "#7dd3fc"; icon = "ph-sketch-logo"; }
    else if (xp >= 500) { rankKey = "rank_gold"; color = "#fbbf24"; icon = "ph-crown"; }
    else if (xp >= 200) { rankKey = "rank_silver"; color = "#94a3b8"; }
    const rankLabel = T[rankKey] || rankKey.replace('rank_', '').toUpperCase();
    dashLevel.innerHTML = `<i class="ph-fill ${icon}"></i> ${rankLabel}`;
    dashLevel.style.color = color;
  }
}

function updateAuthUI(isLoggedIn) {
  window.isUserLoggedIn = isLoggedIn;
  if (isLoggedIn) {
    if (loginBtn) loginBtn.classList.add('hidden');
    if (userProfileBtn) userProfileBtn.classList.remove('hidden');
  } else {
    if (loginBtn) loginBtn.classList.remove('hidden');
    if (userProfileBtn) userProfileBtn.classList.add('hidden');
  }
}

async function syncProfileUpdate(updates) {
  if (!window.currentUserProfile) return;
  Object.assign(window.currentUserProfile, updates);
  renderDashboardProfile();
  if (auth && auth.currentUser) {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, updates);
    } catch (err) { console.warn("Sync failed", err); }
  }
}

async function fetchLeaderboard() {
  const container = document.getElementById('leaderboard-list');
  if (!container || !db) return;
  try {
    const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(15));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      container.innerHTML = '<p style="text-align:center; color: var(--text-muted); padding: 2rem;">No data yet.</p>';
      return;
    }
    const currentUid = auth?.currentUser?.uid;
    const users = [];
    snapshot.forEach(docSnap => users.push({ id: docSnap.id, ...docSnap.data() }));

    const top3 = users.slice(0, 3);
    const others = users.slice(3);

    let html = `<div class="leaderboard-grand-container">`;
    
    // Podium
    html += `<div class="leaderboard-podium">`;
    [1, 0, 2].forEach(idx => {
      const u = top3[idx];
      if (!u) { html += `<div></div>`; return; }
      const rank = idx + 1;
      const medal = rank === 1 ? '🥇' : (rank === 2 ? '🥈' : '🥉');
      const glow = rank === 1 ? 'lb-glow-gold' : (rank === 2 ? 'lb-glow-silver' : 'lb-glow-bronze');
      html += `
        <div class="podium-rank-box podium-rank-${rank} ${glow}">
          <div class="podium-medal">${medal}</div>
          <div class="podium-name">${u.name || 'User'}</div>
          <div class="podium-xp">${u.xp || 0} XP</div>
        </div>
      `;
    });
    html += `</div>`;

    // List
    html += `<div class="rankings-list">`;
    users.forEach((u, i) => {
      const rank = i + 1;
      const isYou = u.id === currentUid;
      html += `
        <div class="rankings-item-premium ${isYou ? 'you' : ''}">
          <div style="font-weight:900; font-size:1.2rem; color:rgba(255,255,255,0.15);">${rank}</div>
          <div style="display:flex; align-items:center; gap:0.8rem;">
            <div style="width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.75rem; border:1px solid rgba(255,255,255,0.1);">${(u.name || 'U').charAt(0)}</div>
            <div style="font-weight:600; font-size:0.95rem;">${u.name || 'User'} ${isYou ? '<span style="font-size:0.6rem; opacity:0.5;">(YOU)</span>' : ''}</div>
          </div>
          <div style="text-align:right; font-weight:800; font-size:1.1rem; color:var(--primary);">${u.xp || 0} <span style="font-size:0.7rem; font-weight:500; opacity:0.7;">XP</span></div>
        </div>
      `;
    });
    html += `</div></div>`;
    container.innerHTML = html;
  } catch (err) { console.error('Leaderboard error', err); }
}

// NAME EDITING
const editNameBtn = document.getElementById('edit-name-btn');
const editNameForm = document.getElementById('edit-name-form');
const editNameInput = document.getElementById('edit-name-input');
const saveNameBtn = document.getElementById('save-name-btn');
const cancelNameBtn = document.getElementById('cancel-name-btn');

if (editNameBtn) {
  editNameBtn.addEventListener('click', () => {
    if (!window.currentUserProfile) return;
    editNameInput.value = window.currentUserProfile.name || '';
    editNameForm.style.display = 'flex'; editNameBtn.style.display = 'none'; editNameInput.focus();
  });
}
if (cancelNameBtn) cancelNameBtn.addEventListener('click', () => { editNameForm.style.display = 'none'; if (editNameBtn) editNameBtn.style.display = 'flex'; });
if (saveNameBtn) {
  saveNameBtn.addEventListener('click', async () => {
    const newName = editNameInput.value.trim();
    if (!newName) return;
    saveNameBtn.innerText = "Saving...";
    await syncProfileUpdate({ name: newName });
    editNameForm.style.display = 'none'; if (editNameBtn) editNameBtn.style.display = 'flex';
    saveNameBtn.innerText = "Save";
  });
}

// SYMPTOM CHECKER
const commonSymptoms = ["Fever", "Cough", "Headache", "Fatigue", "Nausea", "Sore Throat", "Body Ache"];
const symptomsInput = document.getElementById('symptoms-input');
const analyzeBtn = document.getElementById('analyze-btn');
const tagsContainer = document.getElementById('common-symptoms');

if (tagsContainer && symptomsInput) {
  commonSymptoms.forEach(sym => {
    const span = document.createElement('span'); span.className = 'symptom-tag'; span.innerText = sym;
    span.addEventListener('click', () => { symptomsInput.value = symptomsInput.value ? symptomsInput.value + ', ' + sym : sym; });
    tagsContainer.appendChild(span);
  });
}

function processSymptoms(input, duration, severity) {
  input = input.toLowerCase();
  const conditions = [
    { id: "Dengue / Malaria", keywords: /fever|high fever|joint|muscle|mosquito|chills|shiver/g, advice: "Mosquito-borne illnesses require immediate blood tests (CBC, Dengue NS1).", medicines: ["Paracetamol", "ORS"] },
    { id: "Gastroenteritis", keywords: /stomach|belly|nausea|vomit|diarrhea|food/g, advice: "Inflamed stomach lining. Rest and hydrate.", medicines: ["ORS", "Antacids"] },
    { id: "COVID-19", keywords: /taste|smell|breath|chest|dry cough|covid/g, advice: "Possible COVID-19. Isolate and monitor O2.", medicines: ["Paracetamol", "Vitamin C"] },
    { id: "Acid Reflux", keywords: /heartburn|acid|burp|reflux/g, advice: "Avoid spicy food, stay upright after eating.", medicines: ["Antacids"] },
    { id: "Common Cold", keywords: /runny nose|sniff|cold|mild cough/g, advice: "Rest and hydration.", medicines: ["Nasal spray", "Lozenges"] }
  ];
  let maxScore = 0, topCondition = null;
  conditions.forEach(c => {
    const matches = input.match(c.keywords) || [];
    if (matches.length > maxScore) { maxScore = matches.length; topCondition = c; }
  });
  if (!topCondition) topCondition = { id: "Mild Viral Infection", advice: "Rest and monitor temperature.", medicines: ["Paracetamol"] };
  let result = { condition: topCondition.id, advice: topCondition.advice, medicines: topCondition.medicines, confidence: maxScore >= 2 ? "High" : "Low", warning: "" };
  if (severity === "Severe" || duration.includes("week")) result.warning = "🚨 Severe symptoms: Consult a doctor immediately.";
  return result;
}

if (analyzeBtn && symptomsInput) {
  analyzeBtn.addEventListener('click', () => {
    const input = symptomsInput.value.trim();
    if (!input) return;
    const duration = document.getElementById('symptoms-duration')?.value || "1-2 days";
    const severity = document.getElementById('symptoms-severity')?.value || "Mild";
    analyzeBtn.disabled = true;
    document.getElementById('checker-results')?.classList.remove('hidden');
    document.getElementById('checker-loading')?.classList.remove('hidden');
    document.getElementById('results-content')?.classList.add('hidden');
    setTimeout(() => {
      const res = processSymptoms(input, duration, severity);
      if (document.getElementById('res-condition')) document.getElementById('res-condition').innerText = res.condition;
      if (document.getElementById('res-advice')) document.getElementById('res-advice').innerText = res.advice;
      const medList = document.getElementById('res-medicines-list');
      if (medList) { medList.innerHTML = res.medicines.map(m => `<li style="margin-bottom:0.4rem; color:var(--text-main); font-weight:500;">${m}</li>`).join(''); }
      
      const resultsContent = document.getElementById('results-content');
      if (resultsContent) {
        resultsContent.classList.remove('hidden');
        resultsContent.style.animation = 'fadeIn 0.6s ease-out';
      }
      analyzeBtn.disabled = false;
      document.getElementById('checker-loading')?.classList.add('hidden');
      showToast(`${res.condition} analyzed!`, 'success');
    }, 1500);
  });
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `notif-item ${type}`;
  toast.style.position = 'fixed';
  toast.style.bottom = '1.5rem';
  toast.style.right = '1.5rem';
  toast.style.zIndex = '9999999';
  toast.style.animation = 'slideInRight 0.3s ease-out';
  toast.style.width = '300px';
  toast.innerHTML = `<div style="display:flex; align-items:center; gap:0.8rem; padding:1.2rem; background:rgba(15,23,42,0.9); border-radius:12px; border:1px solid rgba(255,255,255,0.1); backdrop-filter:blur(10px); box-shadow:0 10px 30px rgba(0,0,0,0.5);">
    <i class="ph-fill ${type === 'success' ? 'ph-check-circle text-green' : 'ph-info text-blue'}" style="font-size:1.5rem;"></i>
    <div style="color:white; font-weight:500; font-size:0.9rem;">${message}</div>
  </div>`;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(20px)'; setTimeout(() => toast.remove(), 400); }, 3500);
}

// CHATBOT
const CHATBOT_REPLIES = {
  en: {
    hello: "Namaste — I'm Saathi AI. How can I support you today?",
    crisis: "If in danger, dial 112. Tele MANAS: 14416.",
    defaults: ["I hear you. Tell me more, or pick a topic.", "Reaching out is brave. How can I help?"]
  },
  hi: {
    hello: "नमस्ते — मैं स्वास्थ्य साथी AI हूँ। आज मैं आपकी क्या मदद कर सकता हूँ?",
    crisis: "खतरे में होने पर 112 डायल करें। टेली मानस: 14416।",
    defaults: ["मैं समझ रहा हूँ। थोड़ा और बताएँ।", "बात करना आत्म-सम्मान का संकेत है।"]
  }
};

const chatInput = document.getElementById('chat-input');
const chatSendBtn = document.getElementById('chat-send-btn');
const chatHistory = document.getElementById('chat-history');

function addChatMessage(message, sender) {
  if (!chatHistory) return;
  const msgDiv = document.createElement('div'); msgDiv.className = `message ${sender}`;
  const msgBubble = document.createElement('div'); msgBubble.className = 'msg-bubble'; msgBubble.innerHTML = message;
  msgDiv.appendChild(msgBubble); chatHistory.appendChild(msgDiv);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

if (chatSendBtn && chatInput) {
  chatSendBtn.addEventListener('click', () => {
    const text = chatInput.value.trim(); if (!text) return;
    addChatMessage(text, 'user'); chatInput.value = '';
    setTimeout(() => {
      const L = CHATBOT_REPLIES[currentLang] || CHATBOT_REPLIES.en;
      const resp = text.toLowerCase().includes('help') ? L.crisis : L.defaults[0];
      addChatMessage(resp, 'bot');
    }, 1000);
  });
}


// ==========================================
// WELLNESS TEST LOGIC
// ==========================================
const wellnessQuestions = [
  { id: 'q1', key: 'wellness_q1' },
  { id: 'q2', key: 'wellness_q2' },
  { id: 'q3', key: 'wellness_q3' },
  { id: 'q4', key: 'wellness_q4' },
  { id: 'q5', key: 'wellness_q5' },
  { id: 'q6', key: 'wellness_q6' },
  { id: 'q7', key: 'wellness_q7' },
  { id: 'q8', key: 'wellness_q8' },
  { id: 'q9', key: 'wellness_q9' }
];

function renderWellnessQuestions() {
  const container = document.getElementById('wellness-questions');
  if (!container) return;
  const lang = currentLang || 'en';
  const T = translations[lang] || translations.en;
  
  container.innerHTML = wellnessQuestions.map((q, idx) => `
    <div class="wellness-question-card glass-panel" style="padding: 1.2rem; margin-bottom: 1rem; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
      <p style="font-weight:600; margin-bottom:1rem; color:var(--text-main);">${idx + 1}. ${T[q.key] || q.key}</p>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap:0.5rem;">
        ${[0, 1, 2, 3].map(v => `
          <label style="display:flex; flex-direction:column; align-items:center; gap:0.5rem; cursor:pointer; font-size:0.8rem; text-align:center; color:var(--text-muted);">
            <input type="radio" name="${q.id}" value="${v}" style="accent-color:var(--primary); width:1.2rem; height:1.2rem;">
            <span>${T['wellness_label_' + v] || v}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function calculateWellnessScore() {
  const radios = document.querySelectorAll('#wellness-questions input[type="radio"]:checked');
  const lang = currentLang || 'en';
  const T = translations[lang] || translations.en;

  if (radios.length < wellnessQuestions.length) {
    alert(T.answer_all_questions || 'Please answer all questions.');
    return;
  }

  let score = 0;
  radios.forEach(r => score += parseInt(r.value));

  const resultsDiv = document.getElementById('wellness-results');
  const scoreDisplay = document.getElementById('wellness-score-display');
  const riskLevel = document.getElementById('wellness-risk-level');
  const advice = document.getElementById('wellness-advice');

  let levelKey = '', advKey = '', colorClass = 'text-blue';

  if (score <= 4) { levelKey = 'depression_minimal'; advKey = 'depression_adv_0'; }
  else if (score <= 9) { levelKey = 'depression_mild'; advKey = 'depression_adv_1'; }
  else if (score <= 14) { levelKey = 'depression_moderate'; advKey = 'depression_adv_2'; colorClass = 'text-orange'; }
  else { levelKey = 'depression_severe'; advKey = 'depression_adv_3'; colorClass = 'text-red'; }

  if (scoreDisplay) { scoreDisplay.textContent = score; scoreDisplay.className = colorClass; }
  if (riskLevel) { riskLevel.textContent = T[levelKey] || levelKey; riskLevel.className = colorClass; }
  if (advice) advice.textContent = T[advKey] || advKey;

  if (resultsDiv) {
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
    if(typeof confetti === "function") {
       confetti({ particleCount: 100, spread: 70, origin: { y: 0.8 }, colors: ['#0ea5e9', '#8b5cf6'] });
    }
  }

  // Update Quest XP if quest 3 is active
  if (window.isUserLoggedIn && window.currentUserProfile) {
    const currentXP = window.currentUserProfile.xp || 0;
    syncProfileUpdate({ xp: currentXP + 30 }); // Mindful Moment quest
  }
}

function resetWellness() {
  document.querySelectorAll('#wellness-questions input[type="radio"]').forEach(r => r.checked = false);
  const res = document.getElementById('wellness-results');
  if (res) res.classList.add('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// GAMIFICATION & BUTTON HANDLERS
// ==========================================
function playNotificationSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(580, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
  } catch(e) { console.log("Audio play blocked"); }
}

// Global Event Listeners
document.addEventListener('click', async (e) => {
  const target = e.target;

  // Wellness Buttons
  if (target.id === 'submit-wellness-btn' || target.closest('#submit-wellness-btn')) {
    calculateWellnessScore();
  }
  if (target.id === 'reset-wellness-btn' || target.closest('#reset-wellness-btn')) {
    resetWellness();
  }

  // Reset Checker
  if (target.id === 'reset-checker-btn' || target.closest('#reset-checker-btn')) {
    if (symptomsInput) symptomsInput.value = '';
    const res = document.getElementById('checker-results');
    if (res) res.classList.add('hidden');
    navigateTo('checker-page');
  }

  // Daily Check-in
  if (target.id === 'daily-check-in-btn') {
    if(!window.isUserLoggedIn) {
       if (authModal) authModal.classList.remove('hidden');
       return;
    }
    target.disabled = true;
    target.innerText = "Checked In!";
    target.style.background = "var(--success)";
    if(typeof confetti === "function") confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    playNotificationSound();
    const current = window.currentUserProfile || {xp: 0, streak: 0};
    await syncProfileUpdate({ streak: (current.streak || 0) + 1, xp: (current.xp || 0) + 50 });
  }

  // Alerts Done Buttons
  const doneBtn = target.closest('.btn-done');
  if (doneBtn) {
    if(!window.isUserLoggedIn) { alert("Login to earn XP!"); return; }
    doneBtn.disabled = true;
    const li = doneBtn.closest('li');
    if (li) {
      li.style.opacity = '0.4';
      li.style.pointerEvents = 'none';
      const strong = li.querySelector('strong');
      if (strong) strong.style.textDecoration = 'line-through';
    }
    playNotificationSound();
    const current = window.currentUserProfile || {xp: 0};
    await syncProfileUpdate({ xp: (current.xp || 0) + 15 });
  }

  // Quest Buttons
  const questBtn = target.closest('.quest-btn');
  if (questBtn) {
    if(!window.isUserLoggedIn) { alert(translations[currentLang]?.quest_login_required || "Login required"); return; }
    if (questBtn.classList.contains('claimed')) return;
    const gainedXp = parseInt(questBtn.dataset.xp || "0");
    questBtn.disabled = true;
    questBtn.innerText = translations[currentLang]?.quest_completed || "Completed";
    questBtn.classList.add('claimed');
    questBtn.style.opacity = '0.5';
    if(typeof confetti === "function") confetti({ particleCount: 80, spread: 50, origin: { y: 0.7 } });
    playNotificationSound();
    const current = window.currentUserProfile || {xp: 0};
    await syncProfileUpdate({ xp: (current.xp || 0) + gainedXp });
  }
});


// FINAL INIT
document.addEventListener('DOMContentLoaded', () => {
    // Start Chatbot Engine
    if (typeof MentalHealthChatbot === 'function') {
        window.activeChatbot = new MentalHealthChatbot();
    }
    
    applyLanguage(currentLang);
    if (typeof renderWellnessQuestions === 'function') renderWellnessQuestions();
    fetchLeaderboard();
    setInterval(fetchLeaderboard, 300000); // 5 min refresh

    // --- HERO ENTRANCE ANIMATION ---
    if (typeof anime !== 'undefined') {
        anime.timeline({ easing: 'easeOutExpo' })
            .add({
                targets: '.hero-content h1, .hero-content p, .hero-buttons',
                translateY: [30, 0],
                opacity: [0, 1],
                delay: anime.stagger(150),
                duration: 1200
            })
            .add({
                targets: '.ring-laser',
                opacity: [0, 1],
                scale: [1.2, 1],
                duration: 800
            }, '-=500');
    }

    // --- NEXUS PARALLAX ---
    const nexus = document.querySelector('.neural-nexus');
    if (nexus) {
        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const x = (clientX - window.innerWidth / 2) / 40;
            const y = (clientY - window.innerHeight / 2) / 40;
            nexus.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
        });
    }
});
