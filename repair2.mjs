import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'src', 'main.js');
let content = fs.readFileSync(filePath, 'utf8');

console.log("Starting navigateTo repair...");

// Find and replace the entire corrupted block from navigateTo through updateAuthUiMode
const corruptedBlock = content.indexOf('function navigateTo(targetId)');
const afterBlock = content.indexOf('// Global Click Listeners for Auth & Profile');

if (corruptedBlock === -1 || afterBlock === -1) {
  console.error("Could not find the corrupted block. Aborting.");
  process.exit(1);
}

const correctBlock = `function navigateTo(targetId) {
  // Check protected route
  const protectedRoutes = ['quests-page', 'dashboard-page'];
  if (protectedRoutes.includes(targetId) && !window.isUserLoggedIn) {
     if(authModal) authModal.classList.remove('hidden');
     return;
  }
  
  // Update nav UI
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
  window.scrollTo(0, 0);

  // Refresh leaderboard whenever dashboard or quests page opened
  if (targetId === 'dashboard-page' || targetId === 'quests-page') {
    if (typeof fetchLeaderboard === 'function') fetchLeaderboard();
  }
}

function updateAuthUiMode() {
  if(authError) authError.classList.add('hidden');
  if (isLoginMode) {
    authTitle.innerText = "Welcome Back";
    authSubtitle.innerText = "Login to access premium features.";
    authSubmitBtn.innerText = "Sign In";
    if(authSwitchText) authSwitchText.innerText = "Don't have an account?";
    authSwitchBtn.innerText = "Sign Up";
  } else {
    authTitle.innerText = "Create Account";
    authSubtitle.innerText = "Join to track your health journey.";
    authSubmitBtn.innerText = "Sign Up";
    if(authSwitchText) authSwitchText.innerText = "Already have an account?";
    authSwitchBtn.innerText = "Sign In";
  }
}

`;

content = content.substring(0, corruptedBlock) + correctBlock + content.substring(afterBlock);

fs.writeFileSync(filePath, content, 'utf8');
console.log("navigateTo + updateAuthUiMode repaired successfully.");
