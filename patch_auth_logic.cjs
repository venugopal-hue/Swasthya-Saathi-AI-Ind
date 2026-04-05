const fs = require('fs');

let jsPath = 'src/main.js';
let jsContent = fs.readFileSync(jsPath, 'utf8');

const authLogicPattern = '// AUTHENTICATION LOGIC';

if (!jsContent.includes(authLogicPattern)) {
  const authLogicCode = `
// ==========================================
// AUTHENTICATION LOGIC
// ==========================================
window.isUserLoggedIn = false;

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

if(loginBtn) {
  loginBtn.addEventListener('click', () => {
    isLoginMode = true;
    updateAuthUiMode();
    authModal.classList.remove('hidden');
  });
}

if(closeAuthModal) {
  closeAuthModal.addEventListener('click', () => {
    authModal.classList.add('hidden');
    authError.classList.add('hidden');
    authForm.reset();
  });
}

if(authSwitchBtn) {
  authSwitchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    updateAuthUiMode();
  });
}

if(userProfileBtn) {
  userProfileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle('hidden');
  });
  document.addEventListener('click', (e) => {
    if(!userProfileBtn.contains(e.target)) userDropdown.classList.add('hidden');
  });
}

function updateAuthUiMode() {
  authError.classList.add('hidden');
  if (isLoginMode) {
    authTitle.innerText = "Welcome Back";
    authSubtitle.innerText = "Login to access premium features.";
    authSubmitBtn.innerText = "Sign In";
    authSwitchText.innerText = "Don't have an account?";
    authSwitchBtn.innerText = "Sign Up";
  } else {
    authTitle.innerText = "Create Account";
    authSubtitle.innerText = "Join to track your health journey.";
    authSubmitBtn.innerText = "Sign Up";
    authSwitchText.innerText = "Already have an account?";
    authSwitchBtn.innerText = "Sign In";
  }
}

// Ensure auth is loaded
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from './firebase.js';

// Handle Form Submit
if(authForm) {
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    authError.classList.add('hidden');
    
    // If auth is not setup with real backend keys, perform mock login
    if (!auth) {
      console.warn("Using Mock Login since Firebase Auth isn't wired with real credentials.");
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
      authError.innerText = err.message || "Authentication failed.";
      authError.classList.remove('hidden');
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
  onAuthStateChanged(auth, (user) => {
    if (user) {
      updateAuthUI(true);
    } else {
      updateAuthUI(false);
      // Kick user to home if they are on a protected page
      const currentActive = document.querySelector('.page.active');
      if(currentActive && ['telemedicine-page', 'quests-page', 'dashboard-page'].includes(currentActive.id)) {
        navigateTo('home-page');
      }
    }
  });
} else {
  // Mock fallback defaults to guest initially
  updateAuthUI(false);
}

function handleMockAuth() {
  setTimeout(() => {
    updateAuthUI(true);
    authModal.classList.add('hidden');
    authForm.reset();
  }, 1000);
}

function updateAuthUI(isLoggedIn) {
  window.isUserLoggedIn = isLoggedIn;
  if(isLoggedIn) {
    if(loginBtn) loginBtn.classList.add('hidden');
    if(userProfileBtn) userProfileBtn.classList.remove('hidden');
  } else {
    if(loginBtn) loginBtn.classList.remove('hidden');
    if(userProfileBtn) userProfileBtn.classList.add('hidden');
  }
}
`;
  // Prepend imports safely, or it's just appended above. Wait, imports should ideally be at the top level of a module.
  // The import statement is inside the appended block. In ES modules, imports can technically be anywhere if supported, 
  // but it's best to move them to top. However, we already exported and imported auth at the top during an earlier step!
  // Wait, I did not import auth at the top in main.js. Let's fix that too.
  
  jsContent = jsContent.replace("import { db, collection", "import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, db, collection");
  
  jsContent += authLogicCode;
  
  fs.writeFileSync(jsPath, jsContent);
  console.log('Patched main.js with Auth logic');
}
