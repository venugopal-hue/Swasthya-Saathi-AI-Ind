const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'main.js');
let content = fs.readFileSync(filePath, 'utf8');

console.log("Starting definitive repair...");

// --- BLOCK 1: GLOBAL CLICK LISTENERS & AUTH (Restoring structure and fixing braces) ---
const block1StartPattern = "// Global Click Listeners for Auth & Profile";
const block1EndPattern = "async function initializeUserProfile(user) {";

const correctBlock1 = `// Global Click Listeners for Auth & Profile
document.addEventListener('click', (e) => {
  const target = e.target;
  
  if (target.id === 'lang-toggle' || target.closest('#lang-toggle')) {
    const nextLang = currentLang === 'en' ? 'hi' : (currentLang === 'hi' ? 'kn' : 'en');
    applyLanguage(nextLang);
  }

  const navLink = target.closest('.nav-links a');
  if (navLink) {
    e.preventDefault();
    navigateTo(navLink.getAttribute('data-target'));
  }

  const dataNav = target.closest('[data-nav]');
  if(dataNav) {
    e.preventDefault();
    navigateTo(dataNav.getAttribute('data-nav'));
  }

  if (target.id === 'login-btn' || target.closest('#login-btn')) {
    isLoginMode = true;
    updateAuthUiMode();
    if(authModal) authModal.classList.remove('hidden');
  }

  if (target.id === 'close-auth-modal' || target.closest('#close-auth-modal')) {
    if(authModal) authModal.classList.add('hidden');
    if(authError) authError.classList.add('hidden');
    if(authForm) authForm.reset();
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

  if (target.id === 'menu-toggle' || target.closest('#menu-toggle')) {
    if (navLinksContainer) navLinksContainer.classList.toggle('show');
  }
  
  if (target.id === 'user-profile-btn' || target.closest('#user-profile-btn')) {
    e.stopPropagation();
    if(userDropdown) userDropdown.classList.toggle('hidden');
  } else if (userDropdown && !target.closest('#user-profile-btn')) {
    userDropdown.classList.add('hidden');
  }
});

// Handle Auth Form Submission
if(authForm) {
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if(authError) authError.classList.add('hidden');
    
    if (!auth) {
      console.warn("Firebase Auth not initialized, using mock.");
      handleMockAuth();
      return;
    }
    
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
      if(authError) {
        authError.innerText = err.message || "Authentication failed.";
        authError.classList.remove('hidden');
      }
    } finally {
      authSubmitBtn.innerText = isLoginMode ? "Sign In" : "Sign Up";
    }
  });
}

// Handle Logout
if(logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    if(auth) {
      signOut(auth).catch(err => console.error(err));
    } else {
      updateAuthUI(false);
      navigateTo('home-page');
    }
  });
}

// Firebase Auth State Observer
if (auth) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      updateAuthUI(true);
      await initializeUserProfile(user);
    } else {
      updateAuthUI(false);
      if(profileUnsubscribe) {
        profileUnsubscribe();
        profileUnsubscribe = null;
      }
      window.currentUserProfile = null;
      const currentActive = document.querySelector('.page.active');
      if(currentActive && ['telemedicine-page', 'quests-page', 'dashboard-page'].includes(currentActive.id)) {
        navigateTo('home-page');
      }
    }
  });
} else {
  updateAuthUI(false);
}

`;

const block1StartIndex = content.indexOf(block1StartPattern);
const block1EndIndex = content.indexOf(block1EndPattern);

if (block1StartIndex !== -1 && block1EndIndex !== -1) {
    content = content.substring(0, block1StartIndex) + correctBlock1 + "\n\n" + content.substring(block1EndIndex);
    console.log("Block 1 fixed.");
} else {
    console.error("Could not find patterns for Block 1.");
}

// --- BLOCK 2: DAILY CHECK-IN & QUESTS ---
const block2StartPattern = "// 1. Daily Check-in Streak";
const block2EndPattern = "// Sound utility for Gamification";

const correctBlock2 = `// 1. Daily Check-in Streak
const dailyCheckInBtn = document.getElementById('daily-check-in-btn');
if (dailyCheckInBtn) {
  dailyCheckInBtn.addEventListener('click', async () => {
    if(!window.currentUserProfile) {
       alert("Please login first to claim your daily points!");
       return;
    }
    
    // Prevent double clicking
    if (dailyCheckInBtn.disabled) return;
    dailyCheckInBtn.disabled = true;
    dailyCheckInBtn.innerText = "Checked In!";
    dailyCheckInBtn.style.background = "var(--success)";
    dailyCheckInBtn.style.color = "#fff";
    dailyCheckInBtn.style.border = "none";
    
    // Confetti effect!
    if(typeof confetti === "function") {
       confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b'] });
    }
    
    const currentStreak = window.currentUserProfile.streak || 0;
    const currentXP = window.currentUserProfile.xp || 0;
    
    await syncProfileUpdate({
       streak: currentStreak + 1,
       xp: currentXP + 50
    });
    
    playNotificationSound();
  });
}

// 2. Smart Reminders Completion
document.querySelectorAll('.alerts-card .btn-done').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    if(!window.currentUserProfile) {
       alert("Please login to earn XP for this task!");
       return;
    }
    
    const target = e.currentTarget;
    if (target.disabled) return;
    target.disabled = true;
    
    // UI Update
    const listItem = target.closest('li');
    listItem.style.opacity = '0.5';
    listItem.style.transition = 'all 0.3s ease';
    const textElement = listItem.querySelector('strong');
    if(textElement) textElement.style.textDecoration = 'line-through';
    
    target.style.background = 'var(--success)';
    target.innerHTML = '<i class="ph-bold ph-check"></i>';
    
    // Tiny confetti burst
    if(typeof confetti === "function") {
        confetti({
            particleCount: 30,
            spread: 40,
            origin: { y: 0.7, x: 0.5 },
            colors: ['#10b981']
        });
    }

    const currentXP = window.currentUserProfile.xp || 0;
    await syncProfileUpdate({ xp: currentXP + 15 });
    
    playNotificationSound();
  });
});

`;

const block2StartIndex = content.indexOf(block2StartPattern);
const block2EndIndex = content.indexOf(block2EndPattern);

if (block2StartIndex !== -1 && block2EndIndex !== -1) {
    content = content.substring(0, block2StartIndex) + correctBlock2 + "\n\n" + content.substring(block2EndIndex);
    console.log("Block 2 fixed.");
} else {
    console.error("Could not find patterns for Block 2.");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Repair complete.");
