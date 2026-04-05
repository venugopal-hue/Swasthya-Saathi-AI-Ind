const fs = require('fs');

const filePath = 'index.html';
let html = fs.readFileSync(filePath, 'utf-8');

// 1. Add Notification Bell to Navbar
const navSearch = '<button id="lang-toggle" class="btn-secondary">A/अ</button>';
const navReplace = `<button id="lang-toggle" class="btn-secondary">A/अ</button>
        <div class="notification-container" style="position: relative; margin: 0 0.5rem;" id="notification-bell-container">
          <button id="notif-btn" class="btn-secondary" style="padding: 0.5rem; position: relative;">
            <i class="ph-fill ph-bell" style="font-size: 1.2rem;"></i>
            <span id="notif-badge" class="hidden" style="position: absolute; top: -5px; right: -5px; background: var(--danger); color: white; border-radius: 50%; width: 18px; height: 18px; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; font-weight: bold;">0</span>
          </button>
          
          <div id="notif-dropdown" class="hidden glass-panel" style="position: absolute; top: 120%; right: -50px; width: 320px; z-index: 1000; display: flex; flex-direction: column; padding: 1rem; border-radius: var(--border-radius-sm); box-shadow: 0 10px 40px rgba(0,0,0,0.6); max-height: 400px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 0.5rem;">
              <h4 style="margin:0;"><i class="ph-fill ph-bell-ringing text-blue"></i> Smart Alerts</h4>
              <button id="clear-notifs" style="background:transparent; color:var(--text-muted); font-size: 0.8rem; border:none; cursor:pointer;">Clear All</button>
            </div>
            <div id="notif-list" style="display:flex; flex-direction:column; gap:0.5rem; overflow-y: auto; overflow-x: hidden;">
              <p class="text-muted" style="text-align:center; font-size:0.9rem; margin:1rem 0;" id="empty-notif-msg">No new alerts at the moment.</p>
            </div>
          </div>
        </div>`;
html = html.replace(navSearch, navReplace);


// 2. Home Page Stats and How it Works
const hcSearch = '<div class="features-section">';
const hcReplace = `
        <!-- Dynamic Stats Hero extension -->
        <div class="stats-banner" style="display:flex; justify-content:center; gap: 2rem; margin-bottom: 4rem; flex-wrap: wrap;">
          <div class="glass-card stat-item" style="flex:1; min-width: 200px; text-align:center; flex-direction:column;">
            <i class="ph-fill ph-users text-blue" style="font-size:2rem; margin-bottom:0.5rem;"></i>
            <h3 class="stat-number text-white" style="font-size:2rem; font-weight:bold;">10,000+</h3>
            <p class="text-muted" style="font-size:0.9rem;">Active Users</p>
          </div>
          <div class="glass-card stat-item" style="flex:1; min-width: 200px; text-align:center; flex-direction:column;">
            <i class="ph-fill ph-stethoscope text-green" style="font-size:2rem; margin-bottom:0.5rem;"></i>
            <h3 class="stat-number text-white" style="font-size:2rem; font-weight:bold;">15,000+</h3>
            <p class="text-muted" style="font-size:0.9rem;">Consultations</p>
          </div>
          <div class="glass-card stat-item" style="flex:1; min-width: 200px; text-align:center; flex-direction:column;">
            <i class="ph-fill ph-shield-check text-orange" style="font-size:2rem; margin-bottom:0.5rem;"></i>
            <h3 class="stat-number text-white" style="font-size:2rem; font-weight:bold;">98.5%</h3>
            <p class="text-muted" style="font-size:0.9rem;">AI Accuracy</p>
          </div>
        </div>

        <!-- How It Works Section -->
        <div class="how-it-works" style="margin-bottom: 5rem;">
          <h2 class="section-title">How It Works</h2>
          <div style="display:flex; flex-direction:row; justify-content:space-between; align-items:flex-start; position:relative; flex-wrap:wrap; gap: 2rem;">
            
            <div style="flex:1; min-width:250px; text-align:center; position:relative; z-index:2;">
              <div class="step-icon" style="width:80px; height:80px; border-radius:50%; background:var(--primary); color:white; font-size:2.5rem; display:flex; align-items:center; justify-content:center; margin:0 auto 1.5rem; box-shadow: 0 0 20px rgba(14,165,233,0.4);">1</div>
              <h3 style="margin-bottom:0.5rem;">Share Symptoms</h3>
              <p class="text-muted" style="font-size:0.95rem;">Describe how you're feeling to our AI checker or chatbot.</p>
            </div>
            
            <div style="flex:1; min-width:250px; text-align:center; position:relative; z-index:2;">
              <div class="step-icon" style="width:80px; height:80px; border-radius:50%; background:var(--secondary); color:white; font-size:2.5rem; display:flex; align-items:center; justify-content:center; margin:0 auto 1.5rem; box-shadow: 0 0 20px rgba(16,185,129,0.4);">2</div>
              <h3 style="margin-bottom:0.5rem;">AI Analysis</h3>
              <p class="text-muted" style="font-size:0.95rem;">Our intelligent engine processes context and suggests possible conditions safely.</p>
            </div>
            
            <div style="flex:1; min-width:250px; text-align:center; position:relative; z-index:2;">
              <div class="step-icon" style="width:80px; height:80px; border-radius:50%; background:var(--warning); color:white; font-size:2.5rem; display:flex; align-items:center; justify-content:center; margin:0 auto 1.5rem; box-shadow: 0 0 20px rgba(245,158,11,0.4);">3</div>
              <h3 style="margin-bottom:0.5rem;">Take Action</h3>
              <p class="text-muted" style="font-size:0.95rem;">Book a telemedicine call immediately or follow wellness advice.</p>
            </div>
          </div>
        </div>
        <div class="features-section">`;
html = html.replace('<div class="features-section">', hcReplace);


// 3. Home Page Testimonials
const testSearch = '</div>\n        </div>\n      </section>'; // End of home page
const testReplace = `</div>\n        </div>\n
        <!-- Testimonials Section -->
        <div class="testimonials-section" style="margin-top: 5rem; text-align:center;">
          <h2 class="section-title">Success Stories</h2>
          <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); text-align:left;">
            <div class="glass-card" style="flex-direction:column; align-items:flex-start; border-top: 4px solid var(--primary);">
              <div style="display:flex; justify-content:space-between; width:100%; margin-bottom:1rem;">
                <h4 style="margin:0;"><i class="ph-fill ph-user-circle"></i> Rohan M.</h4>
                <div class="text-yellow"><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i></div>
              </div>
              <p class="text-muted" style="font-style:italic;">"The AI correctly identified my early dengue symptoms before things got serious. The telemedicine connect was instant!"</p>
            </div>
            <div class="glass-card" style="flex-direction:column; align-items:flex-start; border-top: 4px solid var(--secondary);">
              <div style="display:flex; justify-content:space-between; width:100%; margin-bottom:1rem;">
                <h4 style="margin:0;"><i class="ph-fill ph-user-circle"></i> Sneha K.</h4>
                <div class="text-yellow"><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i></div>
              </div>
              <p class="text-muted" style="font-style:italic;">"The mental wellness companion is beautifully made. It truly feels like a judgement-free space after a long day."</p>
            </div>
          </div>
        </div>
      </section>`;
html = html.replace('</div>\n        </div>\n      </section>', testReplace);


// 4. Leaderboard Container Update
// We need to replace the static HTML within the global leaderboard
const lbStart = '<h3 style="margin-bottom: 1rem; font-size:1.5rem;"><span data-i18n="leaderboard_title">Global Leaderboard</span></h3>';
const lbEndRegex = /<div class="leaderboard-row user-row"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;

// We will just do a standard replace to wipe the static users and drop in the container.
// It's easier to find the div class="glass-card full-width" that contains the leaderboard-row elements.
const searchBlock1 = '<div class="glass-card full-width" style="flex-direction:column; padding:0; overflow:hidden;">';
const lbReplace = `<div class="glass-card full-width" style="flex-direction:column; padding:0; overflow-y:auto; max-height: 400px; position:relative;" id="leaderboard-container">
              <!-- Dynamically populated from JS (Firebase) -->
              <div id="lb-loader" style="padding: 2rem; text-align:center;" class="text-muted"><i class="ph-bold ph-spinner ph-spin" style="font-size:2rem; color:var(--primary); margin-bottom:1rem; display:block;"></i> Syncing latest ranks...</div>`;

html = html.replace(searchBlock1, lbReplace);

// Now kill the static contents inside leaderboard until its closing div
// Actually, it's safer to just replace using specific string matches.

const row1 = html.indexOf('<div class="leaderboard-row top-rank"');
const endRow = html.indexOf('</div>\n          </div>\n\n        </div>\n      </section>');
let toRemove = html.substring(row1, endRow);
// toRemove contains all the static rows.
html = html.replace(toRemove, '</div>\n');

fs.writeFileSync(filePath, html, 'utf-8');
console.log('Successfully patched index.html with new UI');
