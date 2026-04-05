const fs = require('fs');

const filePath = 'e:/Swasthya Saathi AI Draft BKP - Copy/index.html';
let html = fs.readFileSync(filePath, 'utf-8');

const replacements = [
    [
        '<li><a href="#" data-target="quests-page" style="color:var(--secondary); font-weight:700;"><i\\n              class="ph-fill ph-star"></i> Health Quests</a></li>',
        '<li><a href="#" data-target="quests-page" style="color:var(--secondary); font-weight:700;"><i\\n              class="ph-fill ph-star"></i> <span data-i18n="nav_quests">Health Quests</span></a></li>'
    ],
    [
        '<i class="ph-fill ph-star"></i> Health Quests</a></li>',
        '<i class="ph-fill ph-star"></i> <span data-i18n="nav_quests">Health Quests</span></a></li>'
    ],
    [
        '<i\\n              class="ph-fill ph-star"></i> Health Quests</a></li>',
        '<i\\n              class="ph-fill ph-star"></i> <span data-i18n="nav_quests">Health Quests</span></a></li>'
    ],
    ["<h3>Dr. Aarti Sharma</h3>", '<h3 data-i18n="tele_doc1_name">Dr. Aarti Sharma</h3>'],
    ["<p>General Physician • 10+ yrs exp</p>", '<p data-i18n="tele_doc1_spec">General Physician • 10+ yrs exp</p>'],
    ["4.9 (120 reviews)", '<span data-i18n="tele_doc1_rating">4.9 (120 reviews)</span>'],
    ["Available Now", '<span data-i18n="tele_avail_now">Available Now</span>'],
    ["> Chat</button>", '> <span data-i18n="tele_btn_chat">Chat</span></button>'],
    ["> Video</button>", '> <span data-i18n="tele_btn_video">Video</span></button>'],

    ["<h3>Dr. Vikram Singh</h3>", '<h3 data-i18n="tele_doc2_name">Dr. Vikram Singh</h3>'],
    ["<p>Psychiatrist • 15+ yrs exp</p>", '<p data-i18n="tele_doc2_spec">Psychiatrist • 15+ yrs exp</p>'],
    ["4.8 (95 reviews)", '<span data-i18n="tele_doc2_rating">4.8 (95 reviews)</span>'],

    ["<h3>Dr. Priya Patel</h3>", '<h3 data-i18n="tele_doc3_name">Dr. Priya Patel</h3>'],
    ["<p>Pediatrician • 8+ yrs exp</p>", '<p data-i18n="tele_doc3_spec">Pediatrician • 8+ yrs exp</p>'],
    ["4.9 (200 reviews)", '<span data-i18n="tele_doc3_rating">4.9 (200 reviews)</span>'],
    ["Offline (Next: 2 PM)", '<span data-i18n="tele_offline">Offline (Next: 2 PM)</span>'],
    ["Book Appointment</button>", '<span data-i18n="tele_btn_book">Book Appointment</span></button>'],

    ["Health Quests</h2>", '<span data-i18n="quests_title">Health Quests</span></h2>'],
    ['<p class="text-muted">Turn healthy habits into a rewarding adventure.</p>', '<p class="text-muted" data-i18n="quests_subtitle">Turn healthy habits into a rewarding adventure.</p>'],
    ['Day Streak', '<span data-i18n="streak_day_text">Day Streak</span>'],
    ['Level <span', '<span data-i18n="level_text">Level</span> <span'],
    
    ['Daily\\n          Challenges</h3>', 'Daily\\n          Challenges</span></h3>'],
    ['Daily\\n          Challenges', '<span data-i18n="quests_daily_title">Daily\\n          Challenges</span>'],
    ['Daily Challenges</h3>', '<span data-i18n="quests_daily_title">Daily Challenges</span></h3>'],
    
    ['<h4 style="font-size:1.2rem; margin:0;">Hydration Hero</h4>', '<h4 style="font-size:1.2rem; margin:0;" data-i18n="quest_1_title">Hydration Hero</h4>'],
    ['<p class="text-muted" style="font-size:0.9rem; margin:0;">Drink 8 glasses of water today.</p>', '<p class="text-muted" style="font-size:0.9rem; margin:0;" data-i18n="quest_1_desc">Drink 8 glasses of water today.</p>'],
    
    ['<h4 style="font-size:1.2rem; margin:0;">Active Walker</h4>', '<h4 style="font-size:1.2rem; margin:0;" data-i18n="quest_2_title">Active Walker</h4>'],
    ['<p class="text-muted" style="font-size:0.9rem; margin:0;">Complete a 15-minute walk.</p>', '<p class="text-muted" style="font-size:0.9rem; margin:0;" data-i18n="quest_2_desc">Complete a 15-minute walk.</p>'],

    ['<h4 style="font-size:1.2rem; margin:0;">Mindful Moment</h4>', '<h4 style="font-size:1.2rem; margin:0;" data-i18n="quest_3_title">Mindful Moment</h4>'],
    ['<p class="text-muted" style="font-size:0.9rem; margin:0;">Take the Wellness Test.</p>', '<p class="text-muted" style="font-size:0.9rem; margin:0;" data-i18n="quest_3_desc">Take the Wellness Test.</p>'],
    
    ['>Complete</button>', ' data-i18n="quest_btn">Complete</button>'],
    
    ['Weekly Milestones</h3>', '<span data-i18n="quests_weekly_title">Weekly Milestones</span></h3>'],
    ['<h4 style="font-size:1.2rem; margin:0; color:var(--orange);">Tele-Health Pioneer</h4>', '<h4 style="font-size:1.2rem; margin:0; color:var(--orange);" data-i18n="quest_w1_title">Tele-Health Pioneer</h4>'],
    ['<p class="text-muted" style="font-size:0.9rem; margin:0;">Complete 1 Telemedicine consultation this week.</p>', '<p class="text-muted" style="font-size:0.9rem; margin:0;" data-i18n="quest_w1_desc">Complete 1 Telemedicine consultation this week.</p>'],
    ['<p class="text-muted" style="font-size:0.9rem; margin:0;">Complete 1 Telemedicine consultation this\\n                    week.</p>', '<p class="text-muted" style="font-size:0.9rem; margin:0;" data-i18n="quest_w1_desc">Complete 1 Telemedicine consultation this week.</p>'],

    ['Trophy Case\\n            </h3>', '<span data-i18n="trophy_title">Trophy Case</span>\\n            </h3>'],
    ['Trophy Case</h3>', '<span data-i18n="trophy_title">Trophy Case</span></h3>'],
    
    ['First Steps</p>', '<span data-i18n="badge1_name">First Steps</span></p>'],
    ['7-Day Streak\\n                </p>', '<span data-i18n="badge2_name">7-Day Streak</span>\\n                </p>'],
    ['7-Day Streak</p>', '<span data-i18n="badge2_name">7-Day Streak</span></p>'],
    ['Symptom Solver\\n                </p>', '<span data-i18n="badge3_name">Symptom Solver</span>\\n                </p>'],
    ['Symptom Solver</p>', '<span data-i18n="badge3_name">Symptom Solver</span></p>'],
    ['Mind Master</p>', '<span data-i18n="badge4_name">Mind Master</span></p>'],

    ['Global\\n              Leaderboard</h3>', '<span data-i18n="leaderboard_title">Global Leaderboard</span></h3>'],
    ['Global Leaderboard</h3>', '<span data-i18n="leaderboard_title">Global Leaderboard</span></h3>'],

    ['<h4 style="margin:0; font-size: 1.1rem;">Aarav S.</h4>', '<h4 style="margin:0; font-size: 1.1rem;" data-i18n="lb_rank1_name">Aarav S.</h4>'],
    ['Swasthya Guru (Lvl 12)', '<span data-i18n="lb_rank1_title">Swasthya Guru (Lvl 12)</span>'],
    ['TOP RANK</span>', '<span data-i18n="lb_top_rank">TOP RANK</span></span>'],
    
    ['<h4 style="margin:0;">Priya K.</h4>', '<h4 style="margin:0;" data-i18n="lb_rank2_name">Priya K.</h4>'],
    ['Vitality Champion (Lvl 8)', '<span data-i18n="lb_rank2_title">Vitality Champion (Lvl 8)</span>'],

    ['You <span', '<span data-i18n="lb_you">You</span> <span'],
    ['YOU</span>', '<span data-i18n="lb_you_badge">YOU</span></span>'],
    ['Trending Up</span>', '<span data-i18n="lb_trending_up">Trending Up</span></span>']
];

for (const [oldStr, newStr] of replacements) {
    if (html.includes(oldStr)) {
        html = html.split(oldStr).join(newStr);
    } else if (oldStr.replace(/\\n/g, '\n') !== oldStr) {
        let unescaped = oldStr.replace(/\\n/g, '\n');
        if (html.includes(unescaped)) {
            html = html.split(unescaped).join(newStr.replace(/\\n/g, '\n'));
        }
    }
}

// Handling special cases
let telemedicineDesc = 'Complete 1 Telemedicine consultation this\n                    week.';
if (html.includes(telemedicineDesc)) {
    html = html.replace(telemedicineDesc, '<span data-i18n="quest_w1_desc">Complete 1 Telemedicine consultation this week.</span>');
}

fs.writeFileSync(filePath, html, 'utf-8');
console.log('Successfully patched index.html');
