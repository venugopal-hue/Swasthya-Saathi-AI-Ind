const fs = require('fs');

// PATCH CSS
const cssPath = 'src/style.css';
let css = fs.readFileSync(cssPath, 'utf-8');

const newCSS = `

/* --- New UI Features appended --- */
.leaderboard-row {
  transition: all 0.3s ease;
  position: relative;
}
.leaderboard-row:hover {
  background: rgba(255,255,255,0.1) !important;
  transform: translateX(8px);
}
.rank-icon {
  width: 30px;
  height: 30px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size: 1.5rem;
}
.rank-icon.gold { color: #fbbf24; filter: drop-shadow(0 0 8px rgba(251,191,36,0.6)); }
.rank-icon.silver { color: #cbd5e1; filter: drop-shadow(0 0 8px rgba(148,163,184,0.6)); }
.rank-icon.bronze { color: #b45309; filter: drop-shadow(0 0 8px rgba(180,83,9,0.6)); }

#notif-badge {
  animation: pulse-badge 2s infinite;
}
@keyframes pulse-badge {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

#notif-dropdown {
  transform-origin: top right;
  animation: notif-in 0.2s ease-out;
}
@keyframes notif-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.alert-item {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--glass-border);
  padding: 0.8rem;
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  transition: 0.2s;
  position: relative;
}
.alert-item:hover {
  background: rgba(14, 165, 233, 0.1);
  border-color: rgba(14, 165, 233, 0.3);
}

.alert-item.read {
  opacity: 0.6;
}

/* Home Page Steps */
.how-it-works .step-icon {
  transition: transform 0.3s;
}
.how-it-works div:hover .step-icon {
  transform: translateY(-10px) scale(1.1);
}
`;
if (!css.includes('.leaderboard-row:hover')) {
  fs.appendFileSync(cssPath, newCSS);
  console.log("Patched style.css");
}

// PATCH JS
const jsPath = 'src/main.js';
let js = fs.readFileSync(jsPath, 'utf-8');

// The JS file needs logic for smart alerts and Firebase. We will append the logic at the bottom and import firebase at the top.
if (!js.includes('import { db')) {
  const imports = `import { db, collection, getDocs, onSnapshot, query, orderBy, limit, setDoc, doc } from './firebase.js';\n`;
  js = imports + js;
}

const jsLogic = `

// ==========================================
// SMART ALERTS SYSTEM (With Sound)
// ==========================================

// Create Audio Context for synthesized notification sound
// We use simple Web Audio API to avoid needing external mp3 files that might fail to load
function playNotificationSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const playTone = (freq, type, duration, startTime) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startTime);
      
      gain.gain.setValueAtTime(0, audioCtx.currentTime + startTime);
      gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + startTime + duration);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + startTime);
      osc.stop(audioCtx.currentTime + startTime + duration);
    };

    // A pleasant "ding-ding" sound
    playTone(523.25, 'sine', 0.5, 0); // C5
    playTone(659.25, 'sine', 0.8, 0.15); // E5
  } catch (e) {
    console.warn("AudioContext prohibited by browser without interaction.", e);
  }
}

const unreadBadge = document.getElementById('notif-badge');
const notifDropdown = document.getElementById('notif-dropdown');
const notifBtn = document.getElementById('notif-btn');
const notifList = document.getElementById('notif-list');
const clearNotifs = document.getElementById('clear-notifs');
const emptyMsg = document.getElementById('empty-notif-msg');
const dashboardAlertsList = document.querySelector('.alerts-list');

let smartAlerts = [];

function renderAlerts() {
  // Update badge
  const unreadCount = smartAlerts.filter(a => !a.read).length;
  if(unreadCount > 0) {
    unreadBadge.innerText = unreadCount > 9 ? '9+' : unreadCount;
    unreadBadge.classList.remove('hidden');
  } else {
    unreadBadge.classList.add('hidden');
  }

  // Render Dropdown List
  notifList.innerHTML = '';
  if(smartAlerts.length === 0) {
    emptyMsg.style.display = 'block';
    notifList.appendChild(emptyMsg);
  } else {
    emptyMsg.style.display = 'none';
    smartAlerts.forEach(alert => {
      const el = document.createElement('div');
      el.className = \`alert-item \${alert.read ? 'read' : ''}\`;
      const iconColor = alert.type === 'exercise' ? 'text-orange' : (alert.type === 'symptom' ? 'text-red' : 'text-blue');
      const iconClass = alert.type === 'exercise' ? 'ph-sneaker' : (alert.type === 'symptom' ? 'ph-thermometer' : 'ph-bell-ringing');
      
      el.innerHTML = \`
        <i class="ph-fill \${iconClass} \${iconColor}" style="font-size:1.5rem; margin-top:2px;"></i>
        <div style="flex:1;">
          <h5 style="margin:0; font-size:0.95rem;">\${alert.title}</h5>
          <p class="text-muted" style="margin:0; font-size:0.8rem; line-height:1.3;">\${alert.desc}</p>
        </div>
        <button class="btn-done dismiss-alert" data-id="\${alert.id}" style="width:25px; height:25px; font-size:0.8rem;"><i class="ph-bold ph-check"></i></button>
      \`;
      notifList.appendChild(el);
    });
  }

  // Render Dashboard Alerts Card
  if(dashboardAlertsList) {
    dashboardAlertsList.innerHTML = '';
    const unreadAlerts = smartAlerts.filter(a => !a.read).slice(0, 4); // Show top 4 unread on dashboard
    
    if(unreadAlerts.length === 0) {
      dashboardAlertsList.innerHTML = '<li style="text-align:center; padding:1rem; border:none;" class="text-muted">No pending alerts. You are all caught up!</li>';
    } else {
      unreadAlerts.forEach(alert => {
        const li = document.createElement('li');
        li.innerHTML = \`
          <div class="alert-info">
            <strong>\${alert.title}</strong>
            <span style="font-size: 0.85rem;">\${alert.desc}</span>
          </div>
          <button class="btn-done dismiss-alert" data-id="\${alert.id}"><i class="ph-bold ph-check"></i></button>
        \`;
        dashboardAlertsList.appendChild(li);
      });
    }
  }
}

function processAlertDismissal(e) {
  const btn = e.target.closest('.dismiss-alert');
  if(!btn) return;
  const id = btn.getAttribute('data-id');
  const alertIndex = smartAlerts.findIndex(a => a.id == id);
  if(alertIndex !== -1) {
    smartAlerts[alertIndex].read = true;
    renderAlerts();
  }
}

document.addEventListener('click', processAlertDismissal);

// Add a new alert to the system
window.addSmartAlert = function(type, title, desc) {
  const newAlert = {
    id: Date.now(),
    type,
    title,
    desc,
    read: false,
    timestamp: new Date()
  };
  smartAlerts.unshift(newAlert); // add to top
  playNotificationSound();
  renderAlerts();
}

// Generate an exercise reminder automatically after 5 seconds of loading to demonstrate
setTimeout(() => {
  addSmartAlert('exercise', 'Time to Move!', 'It has been a while since your last activity. Try completing a 15-minute walk to maintain your streak.');
}, 5000);

// Set up UI interactions
if(notifBtn) {
  notifBtn.addEventListener('click', () => {
    notifDropdown.classList.toggle('hidden');
    // Mark as read when opened? Optional.
  });
}

if(clearNotifs) {
  clearNotifs.addEventListener('click', () => {
    smartAlerts = smartAlerts.map(a => ({...a, read: true}));
    renderAlerts();
  });
}

// Ensure clicking outside closes dropdown
document.addEventListener('click', (e) => {
  if (notifBtn && notifDropdown && !notifBtn.contains(e.target) && !notifDropdown.contains(e.target) && !e.target.closest('.dismiss-alert')) {
    notifDropdown.classList.add('hidden');
  }
});


// ==========================================
// GLOBAL LEADERBOARD (FIREBASE)
// ==========================================

async function initLeaderboard() {
  const lbContainer = document.getElementById('leaderboard-container');
  if (!lbContainer) return;
  
  if (!db) {
    console.warn("DB not initialized. Leaderboard uses fallback local data.");
    loadMockLeaderboard();
    return;
  }

  try {
    const q = query(collection(db, "leaderboard"), orderBy("xp", "desc"), limit(10));
    
    // Realtime Listener
    onSnapshot(q, (querySnapshot) => {
      lbContainer.innerHTML = '';
      
      if(querySnapshot.empty) {
        lbContainer.innerHTML = '<div style="padding:2rem;text-align:center;" class="text-muted">No users found. Wait for users to join!</div>';
        return;
      }
      
      let index = 1;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        lbContainer.appendChild(createLeaderboardRow(data, index));
        index++;
      });
    });
    
  } catch (err) {
    console.error("Error setting up leaderboard snapshot", err);
    loadMockLeaderboard();
  }
}

function getLeaderboardIcon(rank) {
  if(rank === 1) return \`<div class="rank-icon gold"><i class="ph-fill ph-crown"></i></div>\`;
  if(rank === 2) return \`<div class="rank-icon silver"><i class="ph-fill ph-medal"></i></div>\`;
  if(rank === 3) return \`<div class="rank-icon bronze"><i class="ph-fill ph-medal"></i></div>\`;
  return \`<span style="font-size:1.2rem; font-weight:900; color:var(--text-muted); width: 30px; text-align: center;">\${rank}</span>\`;
}

function getInitialColors(name) {
  const colors = [
    'linear-gradient(135deg, #334155, #1e293b)',
    'linear-gradient(135deg, var(--primary), var(--primary-dark))',
    'linear-gradient(135deg, var(--secondary), var(--secondary-dark))',
    'linear-gradient(135deg, #a855f7, #9333ea)',
    'linear-gradient(135deg, #f59e0b, #d97706)'
  ];
  return colors[name.length % colors.length];
}

function createLeaderboardRow(data, rank, isCurrentUser = false) {
  const row = document.createElement('div');
  row.className = 'leaderboard-row' + (isCurrentUser ? ' user-row' : '');
  
  let bgStyle = isCurrentUser ? 'background:rgba(14, 165, 233, 0.1); border-left: 4px solid var(--primary);' : 'border-bottom:1px solid var(--glass-border);';
  if(rank === 1) bgStyle = 'background: rgba(251, 191, 36, 0.05); border-bottom:1px solid rgba(251, 191, 36, 0.2);';
  
  row.style = \`display:flex; align-items:center; gap:1rem; padding:\${rank===1?'1.2rem':'1rem'} 1.5rem; \${bgStyle}\`;
  
  const rankIcon = getLeaderboardIcon(rank);
  const initial = data.name.charAt(0).toUpperCase();
  const avatarBg = getInitialColors(data.name);
  
  const rankHighlights = rank === 1 ? \`<span style="font-size: 0.7rem; color: #10b981;"><i class="ph-bold ph-caret-up"></i> TOP RANK</span>\` : '';
  const youBadge = isCurrentUser ? \`<span class="bg-blue" style="font-size: 0.6rem; padding: 2px 6px; border-radius: 10px; margin-left: 5px;">YOU</span>\` : '';
  const xpColor = rank === 1 ? '#fbbf24' : (isCurrentUser ? 'var(--primary)' : 'var(--secondary)');

  row.innerHTML = \`
    \${rankIcon}
    <div style="width:\${rank===1?'45px':'40px'}; height:\${rank===1?'45px':'40px'}; border-radius:50%; background:\${avatarBg}; color:white; \${rank===1?'border: 2px solid #fbbf24;':''} display:flex; align-items:center; justify-content:center; font-weight:bold; font-size: 1.2rem;">\${initial}</div>
    <div style="flex:1;">
      <h4 style="margin:0; \${rank===1||isCurrentUser?'font-size:1.1rem;':''}">\${data.name} \${youBadge}</h4>
      <p style="margin:0; font-size:0.85rem; color:var(--text-muted);">\${data.title} (Lvl \${data.level})</p>
    </div>
    <div style="text-align: right;">
      <span style="display:block; font-weight:800; color:\${xpColor}; font-size: 1.1rem;">\${data.xp.toLocaleString()} XP</span>
      \${rankHighlights}
    </div>
  \`;
  return row;
}

function loadMockLeaderboard() {
  const lbContainer = document.getElementById('leaderboard-container');
  if(!lbContainer) return;
  lbContainer.innerHTML = '';
  
  const mockUsers = [
    { name: "Aarav S.", title: "Swasthya Guru", level: 12, xp: 1250 },
    { name: "Priya K.", title: "Vitality Champion", level: 8, xp: 840 },
    { name: "You", title: "Health Novice", level: userLevel, xp: userXP },
    { name: "Rahul D.", title: "Wellness Warrior", level: 5, xp: 510 },
    { name: "Sneha V.", title: "Wellness Warrior", level: 4, xp: 420 },
    { name: "Rohan M.", title: "Health Novice", level: 2, xp: 190 }
  ];
  
  let i = 1;
  mockUsers.forEach(u => {
    lbContainer.appendChild(createLeaderboardRow(u, i, u.name === "You"));
    i++;
  });
}

// Hook into existing quest completion to update leaderboard dynamically and send alerts
const originalProcessQuestCompletion = window.processQuestCompletion || function(){};
window.processQuestCompletionOriginal = originalProcessQuestCompletion;

// We need to inject the alert logic when checker finishes too
const originalAnalyzeBtnClick = document.getElementById('analyze-btn') ? document.getElementById('analyze-btn').onclick : null;
if (document.getElementById('analyze-btn')) {
  document.getElementById('analyze-btn').addEventListener('click', () => {
    // Schedule a symptom follow-up alert 15 seconds after analyzing
    setTimeout(() => {
      window.addSmartAlert('symptom', 'Health Check-in', 'How are you feeling after your recent symptom analysis? Have your symptoms improved?');
    }, 15000);
  });
}

// Initialize Leaderboard after setup
setTimeout(initLeaderboard, 1000);
`;

if (!js.includes('SMART ALERTS SYSTEM (With Sound)')) {
  fs.appendFileSync(jsPath, jsLogic);
  console.log("Patched main.js");
} else {
  console.log("main.js already contains Smart Alerts logic.");
}
