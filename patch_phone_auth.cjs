const fs = require('fs');

// 1. UPDATE FIREBASE JS
let fbPath = 'src/firebase.js';
let fbContent = fs.readFileSync(fbPath, 'utf8');

if (!fbContent.includes('RecaptchaVerifier')) {
  fbContent = fbContent.replace(
    "import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';",
    "import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged, signOut } from 'firebase/auth';"
  );
  fbContent = fbContent.replace(
    "export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword,",
    "export { auth, RecaptchaVerifier, signInWithPhoneNumber,"
  );
  fs.writeFileSync(fbPath, fbContent);
  console.log("Patched firebase.js for Phone Auth");
}

// 2. UPDATE INDEX.HTML
let htmlPath = 'index.html';
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Remove Success Stories
const regexStories = /<!-- Testimonials Section -->[\s\S]*?<\/section>/;
htmlContent = htmlContent.replace(regexStories, '</section>');

// Replace old Auth Modal with Phone Auth Modal
const regexAuthModal = /<!-- Auth Modal -->[\s\S]*?<\/form>\s*<p[\s\S]*?<\/p>\s*<\/div>\s*<\/div>/;
const phoneAuthHtml = `<!-- Auth Modal -->
    <div id="auth-modal" class="hidden" style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
      <div class="glass-panel" style="width: 90%; max-width: 400px; padding: 2rem; position: relative; animation: fadeIn 0.3s ease;">
        <button id="close-auth-modal" style="position: absolute; top: 1rem; right: 1rem; background: transparent; color: white; border: none; font-size: 1.2rem; cursor: pointer;"><i class="ph-bold ph-x"></i></button>
        <h2 id="auth-title" style="text-align: center; margin-bottom: 0.5rem;">Access AI Health Hub</h2>
        <p id="auth-subtitle" class="text-muted" style="text-align: center; margin-bottom: 2rem; font-size: 0.9rem;">Sign in using your mobile number.</p>

        <div id="recaptcha-container" style="margin-bottom: 1rem;"></div>
        
        <form id="auth-form" style="display: flex; flex-direction: column; gap: 1rem;">
          <div id="phone-input-group">
            <label style="display: block; margin-bottom: 0.3rem; font-size: 0.9rem;">Phone Number (with country code)</label>
            <input type="tel" id="auth-phone" required style="width: 100%; padding: 0.8rem; border-radius: var(--border-radius-sm); border: 1px solid var(--glass-border); background: rgba(15, 23, 42, 0.6); color: white;" placeholder="+919876543210">
          </div>
          
          <div id="otp-input-group" class="hidden">
             <label style="display: block; margin-bottom: 0.3rem; font-size: 0.9rem;">6-Digit OTP</label>
             <input type="text" id="auth-otp" style="width: 100%; padding: 0.8rem; border-radius: var(--border-radius-sm); border: 1px solid var(--glass-border); background: rgba(15, 23, 42, 0.6); color: white; letter-spacing: 5px; text-align: center; font-weight: bold; font-size: 1.2rem;" placeholder="------" maxlength="6">
          </div>

          <div id="auth-error" class="hidden text-red" style="font-size: 0.85rem; text-align: center;"></div>
          <button type="submit" id="auth-submit-btn" class="btn-primary" style="margin-top: 1rem;">Send OTP</button>
        </form>
      </div>
    </div>`;

htmlContent = htmlContent.replace(regexAuthModal, phoneAuthHtml);

// Add Footer
const footerHtml = `
    <!-- Global Footer -->
    <footer class="glass-panel" style="margin-top: auto; padding: 3rem 5% 1.5rem; text-align: center; border-radius: 0; border-top: 1px solid var(--glass-border); background: rgba(15, 23, 42, 0.9);">
       <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 2rem; margin-bottom: 2rem;">
          <a href="#" class="footer-link" data-target="home-page">Home</a>
          <a href="#" class="footer-link" data-target="checker-page">Symptom Checker</a>
          <a href="#" class="footer-link" data-target="chatbot-page">Chatbot</a>
          <a href="#" class="footer-link" data-target="dashboard-page">Dashboard</a>
          <a href="#" class="footer-link" data-target="telemedicine-page">Telemedicine</a>
          <a href="#" class="footer-link" data-target="quests-page">Health Quests</a>
       </div>
       <div style="margin-bottom: 1rem;">
          <div class="logo" style="justify-content: center;">
            <i class="ph-fill ph-heartbeat"></i>
            <span>Swasthya Saathi</span>
          </div>
       </div>
       <p class="text-muted" style="font-size: 0.9rem; margin: 0;">Designed by Karma Crew</p>
    </footer>

    <!-- Emergency Modal -->`;

if (!htmlContent.includes('<!-- Global Footer -->')) {
  htmlContent = htmlContent.replace('<!-- Emergency Modal -->', footerHtml);
  fs.writeFileSync(htmlPath, htmlContent);
  console.log("Patched index.html with Phone Auth and Footer");
}


// 3. UPDATE main.js AUTHENTICATION LOGIC
let jsPath = 'src/main.js';
let jsContent = fs.readFileSync(jsPath, 'utf8');

// Replace everything from // AUTHENTICATION LOGIC to the end of exactly updateAuthUI function
const startTag = '// ==========================================\n// AUTHENTICATION LOGIC\n// ==========================================';
const startIndex = jsContent.indexOf(startTag);

if (startIndex !== -1) {
  // We'll replace everything after it since it's structurally the very block of the file.
  const authLogicReplacement = \`// ==========================================
// AUTHENTICATION LOGIC (PHONE / OTP)
// ==========================================
import { auth, RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged, signOut } from './firebase.js';

window.isUserLoggedIn = false;

const authModal = document.getElementById('auth-modal');
const closeAuthModal = document.getElementById('close-auth-modal');
const loginBtn = document.getElementById('login-btn');
const userProfileBtn = document.getElementById('user-profile-btn');
const logoutBtn = document.getElementById('logout-btn');
const userDropdown = document.getElementById('user-dropdown');
const authForm = document.getElementById('auth-form');
const authPhone = document.getElementById('auth-phone');
const authOtp = document.getElementById('auth-otp');
const authError = document.getElementById('auth-error');
const authSubmitBtn = document.getElementById('auth-submit-btn');

const phoneInputGroup = document.getElementById('phone-input-group');
const otpInputGroup = document.getElementById('otp-input-group');

let confirmationResult = null; // Stores firebase confirmation result

// Setup hidden recapture
function getRecaptcha() {
  if (!window.recaptchaVerifier && auth) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible'
    });
  }
}

if(loginBtn) {
  loginBtn.addEventListener('click', () => {
    resetAuthModal();
    authModal.classList.remove('hidden');
    getRecaptcha();
  });
}

function resetAuthModal() {
  authError.classList.add('hidden');
  phoneInputGroup.classList.remove('hidden');
  otpInputGroup.classList.add('hidden');
  authPhone.value = '';
  authOtp.value = '';
  authPhone.required = true;
  authOtp.required = false;
  authSubmitBtn.innerText = "Send OTP";
  confirmationResult = null;
}

if(closeAuthModal) {
  closeAuthModal.addEventListener('click', () => {
    authModal.classList.add('hidden');
    resetAuthModal();
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

if(authForm) {
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    authError.classList.add('hidden');
    
    // If Firebase isn't fully configured
    if (!auth) {
      console.warn("Using Mock Login since Firebase Auth isn't wired.");
      if(authSubmitBtn.innerText === "Send OTP") {
         authSubmitBtn.innerText = "Verification...";
         setTimeout(() => {
           phoneInputGroup.classList.add('hidden');
           otpInputGroup.classList.remove('hidden');
           authSubmitBtn.innerText = "Verify OTP";
           authOtp.required = true;
           authPhone.required = false;
         }, 800);
      } else {
         authSubmitBtn.innerText = "Logging in...";
         setTimeout(() => {
           updateAuthUI(true);
           authModal.classList.add('hidden');
           resetAuthModal();
         }, 800);
      }
      return;
    }
    
    // Firebase LIVE flow
    if (!confirmationResult) {
       // Step 1: Request OTP
       authSubmitBtn.innerText = "Sending...";
       try {
         const ph = authPhone.value;
         confirmationResult = await signInWithPhoneNumber(auth, ph, window.recaptchaVerifier);
         phoneInputGroup.classList.add('hidden');
         otpInputGroup.classList.remove('hidden');
         authSubmitBtn.innerText = "Verify OTP";
         authOtp.required = true;
         authPhone.required = false;
       } catch(err) {
         authError.innerText = err.message || "Failed to send OTP.";
         authError.classList.remove('hidden');
         authSubmitBtn.innerText = "Send OTP";
         // Reset recaptcha on failure
         if(window.recaptchaVerifier) window.recaptchaVerifier.render().then((vId) => window.recaptchaVerifier.reset(vId));
       }
    } else {
       // Step 2: Verify OTP
       authSubmitBtn.innerText = "Verifying...";
       try {
         const code = authOtp.value;
         await confirmationResult.confirm(code);
         authModal.classList.add('hidden');
         resetAuthModal();
       } catch(err) {
         authError.innerText = "Invalid OTP code.";
         authError.classList.remove('hidden');
         authSubmitBtn.innerText = "Verify OTP";
       }
    }
  });
}

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

if (auth) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      updateAuthUI(true);
    } else {
      updateAuthUI(false);
      const currentActive = document.querySelector('.page.active');
      if(currentActive && ['telemedicine-page', 'quests-page', 'dashboard-page'].includes(currentActive.id)) {
        navigateTo('home-page');
      }
    }
  });
} else {
  updateAuthUI(false);
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

  // We are replacing standard Auth Logic code previously written to exactly this point
  jsContent = jsContent.substring(0, startIndex) + authLogicReplacement;
  
  // Also we need to attach routing logic to the new footer links
  const footerLinksHook = \`
// Attach footer navigation
document.querySelectorAll('.footer-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = e.currentTarget.getAttribute('data-target');
    navigateTo(target);
    window.scrollTo(0, 0);
  });
});
\`;
  jsContent += footerLinksHook;

  fs.writeFileSync(jsPath, jsContent);
  console.log('Patched main.js with Phone Auth logic and Footer events');
}

// 4. UPDATE CSS
const cssPath = 'src/style.css';
let cssCode = fs.readFileSync(cssPath, 'utf8');
if (!cssCode.includes('footer-link')) {
  cssCode += \`\n/* Footer Links */\n.footer-link {\n  color: var(--text-muted);\n  font-weight: 500;\n  transition: var(--trans-fast);\n}\n.footer-link:hover {\n  color: var(--primary-dark);\n}\n\`;
  fs.writeFileSync(cssPath, cssCode);
  console.log('Patched style.css');
}
