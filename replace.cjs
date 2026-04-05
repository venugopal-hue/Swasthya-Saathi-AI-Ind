const fs = require('fs');
let c = fs.readFileSync('src/main.js', 'utf8');

const replacement = `function renderDashboardProfile() {
  const profile = window.currentUserProfile;
  if(!profile) return;

  const dashName = document.getElementById('dash-user-name');
  const dashEmail = document.getElementById('dash-user-email');
  const dashInitial = document.getElementById('dash-user-initial');
  const dashLevel = document.getElementById('dash-user-level');
  const dashXP = document.getElementById('dash-user-xp');
  const navUserSpan = document.querySelector('.user-profile-btn span');
  
  const dropdownGreeting = document.getElementById('dropdown-greeting-name');
  const streakCounter = document.getElementById('streak-counter');
  const userLevelQ = document.getElementById('user-level');
  const userXpQ = document.getElementById('user-xp');
  const xpProgressBar = document.getElementById('xp-progress-bar');
  const lbXpDisplay = document.getElementById('lb-user-xp-display');

  if(dropdownGreeting) dropdownGreeting.innerText = profile.name ? profile.name.split(' ')[0] : 'User';

  if(dashName) dashName.innerText = profile.name || 'User';
  if(dashEmail) dashEmail.innerText = profile.email || '';
  if(profile.name) {
      const initial = profile.name.charAt(0).toUpperCase();
      if(dashInitial) dashInitial.innerText = initial;
      if(navUserSpan) navUserSpan.innerText = initial;
  }
  
  const xp = profile.xp || 0;
  const streak = profile.streak || 0;
  
  if(dashXP) dashXP.innerText = xp + " XP";
  if(streakCounter) streakCounter.innerText = streak;
  if(lbXpDisplay) lbXpDisplay.innerText = xp + " XP";
  
  const level = Math.floor(xp / 100) + 1;
  const nextLevelXp = level * 100;
  
  if(userLevelQ) userLevelQ.innerText = level;
  if(userXpQ) userXpQ.innerText = \`\${xp} XP / \${nextLevelXp} XP\`;
  
  if(xpProgressBar) {
      const percentage = (xp % 100); 
      xpProgressBar.style.width = percentage + '%';
  }
  
  if(dashLevel) {
    let rank = "Bronze";
    let icon = "ph-medal";
    let color = "var(--primary)";
    
    if(xp >= 1000) { rank = "Diamond"; color = "#7dd3fc"; icon = "ph-sketch-logo"; }
    else if(xp >= 500) { rank = "Gold"; color = "#fbbf24"; }
    else if(xp >= 200) { rank = "Silver"; color = "#94a3b8"; }
    
    dashLevel.innerHTML = \`<i class="ph-fill \${icon}"></i> \${rank}\`;
    dashLevel.style.color = color;
  }
}`;

c = c.replace(/function renderDashboardProfile\(\) \{[\s\S]*?dashLevel\.style\.color = color;\s*\}\s*\}/, replacement);
fs.writeFileSync('src/main.js', c);
console.log("Done");
