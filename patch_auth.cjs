const fs = require('fs');

// --- Patch firebase.js ---
let fbPath = 'src/firebase.js';
let fbContent = fs.readFileSync(fbPath, 'utf8');
if (!fbContent.includes('from \'firebase/auth\'')) {
  fbContent = fbContent.replace(
    "import { initializeApp } from 'firebase/app';",
    "import { initializeApp } from 'firebase/app';\nimport { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';"
  );
  fbContent = fbContent.replace(
    "let db;",
    "let db;\nlet auth = null;"
  );
  fbContent = fbContent.replace(
    "db = getFirestore(app);",
    "db = getFirestore(app);\n    auth = getAuth(app);"
  );
  fbContent = fbContent.replace(
    "export { db, collection",
    "export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, db, collection"
  );
  fs.writeFileSync(fbPath, fbContent);
  console.log("Patched firebase.js");
}

// --- Patch index.html ---
let htmlPath = 'index.html';
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Add Login buttons
const navActionsSpot = '<div class="notification-container" style="position: relative; margin: 0 0.5rem;" id="notification-bell-container">';
const navLoginInject = `        <button id="login-btn" class="btn-primary-small" style="margin-right: 0.5rem;"><i class="ph-bold ph-sign-in"></i> Login</button>
        <div id="user-profile-btn" class="btn-icon hidden" style="margin-right: 0.5rem; width: 35px; height: 35px; cursor: pointer; position: relative;">
          <i class="ph-fill ph-user"></i>
          <div id="user-dropdown" class="hidden glass-panel" style="position: absolute; top: 120%; right: 0; padding: 0.5rem; min-width: 150px; z-index: 1000;">
             <button id="logout-btn" class="btn-danger-small full-width" style="margin-top:0.5rem;">Logout</button>
          </div>
        </div>
        ` + navActionsSpot;

if (!htmlContent.includes('id="login-btn"')) {
  htmlContent = htmlContent.replace(navActionsSpot, navLoginInject);
}

// Add Auth Modal
const authModalHtml = `
    <!-- Auth Modal -->
    <div id="auth-modal" class="hidden" style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
      <div class="glass-panel" style="width: 90%; max-width: 400px; padding: 2rem; position: relative; animation: fadeIn 0.3s ease;">
        <button id="close-auth-modal" style="position: absolute; top: 1rem; right: 1rem; background: transparent; color: white; border: none; font-size: 1.2rem; cursor: pointer;"><i class="ph-bold ph-x"></i></button>
        <h2 id="auth-title" style="text-align: center; margin-bottom: 0.5rem;">Welcome Back</h2>
        <p id="auth-subtitle" class="text-muted" style="text-align: center; margin-bottom: 2rem; font-size: 0.9rem;">Login to access premium features.</p>
        
        <form id="auth-form" style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label style="display: block; margin-bottom: 0.3rem; font-size: 0.9rem;">Email Address</label>
            <input type="email" id="auth-email" required style="width: 100%; padding: 0.8rem; border-radius: var(--border-radius-sm); border: 1px solid var(--glass-border); background: rgba(15, 23, 42, 0.6); color: white;" placeholder="you@example.com">
          </div>
          <div>
            <label style="display: block; margin-bottom: 0.3rem; font-size: 0.9rem;">Password</label>
            <input type="password" id="auth-password" required style="width: 100%; padding: 0.8rem; border-radius: var(--border-radius-sm); border: 1px solid var(--glass-border); background: rgba(15, 23, 42, 0.6); color: white;" placeholder="••••••••">
          </div>
          <div id="auth-error" class="hidden text-red" style="font-size: 0.85rem; text-align: center;"></div>
          <button type="submit" id="auth-submit-btn" class="btn-primary" style="margin-top: 1rem;">Sign In</button>
        </form>
        
        <p style="text-align: center; margin-top: 1.5rem; font-size: 0.9rem;" class="text-muted">
          <span id="auth-switch-text">Don't have an account?</span> 
          <a href="#" id="auth-switch-btn" class="text-blue" style="font-weight: bold;">Sign Up</a>
        </p>
      </div>
    </div>
</body>`;

if (!htmlContent.includes('id="auth-modal"')) {
  htmlContent = htmlContent.replace('</body>', authModalHtml);
  fs.writeFileSync(htmlPath, htmlContent);
  console.log("Patched index.html");
}

// --- Patch main.js ---
let jsPath = 'src/main.js';
let jsContent = fs.readFileSync(jsPath, 'utf8');

if (!jsContent.includes('window.isUserLoggedIn')) {
  // Inject firebase auth imports
  jsContent = jsContent.replace(
    "import { db, collection", 
    "import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, db, collection"
  );
  
  // Update navigateTo for protected routes
  const navToStart = 'function navigateTo(targetId) {';
  const navToProtected = `function navigateTo(targetId) {
  const protectedRoutes = ['telemedicine-page', 'quests-page', 'dashboard-page'];
  if (protectedRoutes.includes(targetId) && !window.isUserLoggedIn) {
    document.getElementById('auth-modal').classList.remove('hidden');
    return;
  }
`;
  jsContent = jsContent.replace(navToStart, navToProtected);

  // Appending Auth Logic
  const authLogicCode = \`
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
\`;

  jsContent += authLogicCode;
  
  fs.writeFileSync(jsPath, jsContent);
  console.log('Patched main.js with Auth logic');
}
