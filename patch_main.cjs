const fs = require('fs');

const mainPath = 'src/main.js';
let mainContent = fs.readFileSync(mainPath, 'utf-8');

const enAdditions = `
    nav_quests: "Health Quests", quests_title: "Health Quests", quests_subtitle: "Turn healthy habits into a rewarding adventure.",
    streak_day_text: "Day Streak", level_text: "Level", quests_daily_title: "Daily Challenges",
    quest_1_title: "Hydration Hero", quest_1_desc: "Drink 8 glasses of water today.",
    quest_2_title: "Active Walker", quest_2_desc: "Complete a 15-minute walk.",
    quest_3_title: "Mindful Moment", quest_3_desc: "Take the Wellness Test.",
    quest_btn: "Complete", quests_weekly_title: "Weekly Milestones",
    quest_w1_title: "Tele-Health Pioneer", quest_w1_desc: "Complete 1 Telemedicine consultation this week.",
    trophy_title: "Trophy Case", badge1_name: "First Steps", badge2_name: "7-Day Streak", badge3_name: "Symptom Solver", badge4_name: "Mind Master",
    leaderboard_title: "Global Leaderboard", lb_rank1_name: "Aarav S.", lb_rank1_title: "Swasthya Guru (Lvl 12)", lb_top_rank: "TOP RANK",
    lb_rank2_name: "Priya K.", lb_rank2_title: "Vitality Champion (Lvl 8)", lb_you: "You", lb_you_badge: "YOU", lb_trending_up: "Trending Up",
    tele_doc1_name: "Dr. Aarti Sharma", tele_doc1_spec: "General Physician • 10+ yrs exp", tele_doc1_rating: "4.9 (120 reviews)", tele_avail_now: "Available Now",
    tele_btn_chat: "Chat", tele_btn_video: "Video", tele_doc2_name: "Dr. Vikram Singh", tele_doc2_spec: "Psychiatrist • 15+ yrs exp", tele_doc2_rating: "4.8 (95 reviews)",
    tele_doc3_name: "Dr. Priya Patel", tele_doc3_spec: "Pediatrician • 8+ yrs exp", tele_doc3_rating: "4.9 (200 reviews)", tele_offline: "Offline (Next: 2 PM)", tele_btn_book: "Book Appointment",`;

const hiAdditions = `
    nav_quests: "स्वास्थ्य खोज", quests_title: "स्वास्थ्य खोज", quests_subtitle: "स्वस्थ आदतों को एक रोमांचक साहसिक कार्य में बदलें।",
    streak_day_text: "दिन का स्ट्रीक", level_text: "स्तर", quests_daily_title: "दैनिक चुनौतियां",
    quest_1_title: "हाइड्रेशन हीरो", quest_1_desc: "आज 8 गिलास पानी पिएं।",
    quest_2_title: "सक्रिय वॉकर", quest_2_desc: "15 मिनट की सैर पूरी करें।",
    quest_3_title: "सचेत पल", quest_3_desc: "कल्याण परीक्षण दें।",
    quest_btn: "पूरा करें", quests_weekly_title: "साप्ताहिक माइलस्टोन",
    quest_w1_title: "टेली-हेल्थ पायनियर", quest_w1_desc: "इस सप्ताह 1 टेलीमेडिसिन परामर्श पूरा करें।",
    trophy_title: "ट्रॉफी केस", badge1_name: "पहला कदम", badge2_name: "7-दिन स्ट्रीक", badge3_name: "लक्षण समाधानकर्ता", badge4_name: "माइंड मास्टर",
    leaderboard_title: "ग्लोबल लीडरबोर्ड", lb_rank1_name: "आरव एस.", lb_rank1_title: "स्वास्थ्य गुरु (Lvl 12)", lb_top_rank: "शीर्ष रैंक",
    lb_rank2_name: "प्रिया के.", lb_rank2_title: "विटैलिटी चैंपियन (Lvl 8)", lb_you: "आप", lb_you_badge: "आप", lb_trending_up: "ऊपर जा रहा है",
    tele_doc1_name: "डॉ. आरती शर्मा", tele_doc1_spec: "सामान्य चिकित्सक • 10+ वर्ष का अनुभव", tele_doc1_rating: "4.9 (120 समीक्षाएं)", tele_avail_now: "अभी उपलब्ध है",
    tele_btn_chat: "चैट", tele_btn_video: "वीडियो", tele_doc2_name: "डॉ. विक्रम सिंह", tele_doc2_spec: "मनोचिकित्सक • 15+ वर्ष का अनुभव", tele_doc2_rating: "4.8 (95 समीक्षाएं)",
    tele_doc3_name: "डॉ. प्रिया पटेल", tele_doc3_spec: "बाल रोग विशेषज्ञ • 8+ वर्ष का अनुभव", tele_doc3_rating: "4.9 (200 समीक्षाएं)", tele_offline: "ऑफ़लाइन (अगला: 2 PM)", tele_btn_book: "अपॉइंटमेंट बुक करें",`;

const knAdditions = `
    nav_quests: "ಆರೋಗ್ಯ ಪ್ರಶ್ನೆಗಳು", quests_title: "ಆರೋಗ್ಯ ಪ್ರಶ್ನೆಗಳು", quests_subtitle: "ಆರೋಗ್ಯಕರ ಅಭ್ಯಾಸಗಳನ್ನು ಲಾಭದಾಯಕ ಸಾಹಸವಾಗಿ ಪರಿವರ್ತಿಸಿ.",
    streak_day_text: "ದಿನದ ಸ್ಟ್ರೀಕ್", level_text: "ಮಟ್ಟ", quests_daily_title: "ದೈನಂದಿನ ಸವಾಲುಗಳು",
    quest_1_title: "ಹೈಡ್ರೇಶನ್ ಹೀರೋ", quest_1_desc: "ಇಂದು 8 ಲೋಟ ನೀರು ಕುಡಿಯಿರಿ.",
    quest_2_title: "ಸಕ್ರಿಯ ವಾಕರ್", quest_2_desc: "15 ನಿಮಿಷಗಳ ನಡಿಗೆಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.",
    quest_3_title: "ಎಚ್ಚರಿಕೆಯ ಕ್ಷಣ", quest_3_desc: "ಕ್ಷೇಮ ಪರೀಕ್ಷೆಯನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ.",
    quest_btn: "ಪೂರ್ಣಗೊಳಿಸಿ", quests_weekly_title: "ಸಾಪ್ತಾಹಿಕ ಮೈಲಿಗಲ್ಲುಗಳು",
    quest_w1_title: "ಟೆಲಿ-ಹೆಲ್ತ್ ಪ್ರವರ್ತಕ", quest_w1_desc: "ಈ ವಾರ 1 ಟೆಲಿಮೆಡಿಸಿನ್ ಸಮಾಲೋಚನೆಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.",
    trophy_title: "ಟ್ರೋಫಿ ಕೇಸ್", badge1_name: "ಮೊದಲ ಹೆಜ್ಜೆಗಳು", badge2_name: "7-ದಿನಗಳ ಸ್ಟ್ರೀಕ್", badge3_name: "ರೋಗಲಕ್ಷಣ ಪರಿಹಾರಕ", badge4_name: "ಮೈಂಡ್ ಮಾಸ್ಟರ್",
    leaderboard_title: "ಜಾಗತಿಕ ಲೀಡರ್‌ಬೋರ್ಡ್", lb_rank1_name: "ಆರವ್ ಎಸ್.", lb_rank1_title: "ಸ್ವಾಸ್ಥ್ಯ ಗುರು (Lvl 12)", lb_top_rank: "ಟಾಪ್ ರ‍್ಯಾಂಕ್",
    lb_rank2_name: "ಪ್ರಿಯಾ ಕೆ.", lb_rank2_title: "ವೈಟಾಲಿಟಿ ಚಾಂಪಿಯನ್ (Lvl 8)", lb_you: "ನೀವು", lb_you_badge: "ನೀವು", lb_trending_up: "ಟ್ರೆಂಡಿಂಗ್ ಅಪ್",
    tele_doc1_name: "ಡಾ. ಆರತಿ ಶರ್ಮಾ", tele_doc1_spec: "ಸಾಮಾನ್ಯ ವೈದ್ಯರು • 10+ ವರ್ಷಗಳ ಅನುಭವ", tele_doc1_rating: "4.9 (120 ವಿಮರ್ಶೆಗಳು)", tele_avail_now: "ಈಗ ಲಭ್ಯವಿದೆ",
    tele_btn_chat: "ಚಾಟ್", tele_btn_video: "ವೀಡಿಯೊ", tele_doc2_name: "ಡಾ. ವಿಕ್ರಮ್ ಸಿಂಗ್", tele_doc2_spec: "ಮನೋವೈದ್ಯರು • 15+ ವರ್ಷಗಳ ಅನುಭವ", tele_doc2_rating: "4.8 (95 ವಿಮರ್ಶೆಗಳು)",
    tele_doc3_name: "ಡಾ. ಪ್ರಿಯಾ ಪಟೇಲ್", tele_doc3_spec: "ಮಕ್ಕಳ ವೈದ್ಯರು • 8+ ವರ್ಷಗಳ ಅನುಭವ", tele_doc3_rating: "4.9 (200 ವಿಮರ್ಶೆಗಳು)", tele_offline: "ಆಫ್‌ಲೈನ್ (ಮುಂದೆ: 2 PM)", tele_btn_book: "ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಕಾಯ್ದಿರಿಸಿ",`;

const enMarker = 'btn_reset_wellness_text: "Reset Test"';
const hiMarker = 'btn_reset_wellness_text: "रीसेट करें"';
const knMarker = 'btn_reset_wellness_text: "ಮರುಹೊಂದಿಸಿ"';

mainContent = mainContent.replace(enMarker, enMarker + ',' + enAdditions);
mainContent = mainContent.replace(hiMarker, hiMarker + ',' + hiAdditions);
mainContent = mainContent.replace(knMarker, knMarker + ',' + knAdditions);

fs.writeFileSync(mainPath, mainContent, 'utf-8');
console.log('Successfully patched src/main.js');
