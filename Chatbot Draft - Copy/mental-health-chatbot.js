/**
 * Mental health support chatbot — India-focused, EN / हिन्दी / ಕನ್ನಡ.
 * Not medical advice. Plug in an API inside getBotReply() if needed.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "mh-chatbot-lang";
  var LANG_ORDER = ["en", "hi", "kn"];

  /** Web Speech API language tags (speech-to-text + TTS) */
  var VOICE_LANG_MAP = { en: "en-IN", hi: "hi-IN", kn: "kn-IN" };

  var CATEGORY_IDS = [
    { id: "general", crisis: false },
    { id: "anxiety", crisis: false },
    { id: "mood", crisis: false },
    { id: "stress", crisis: false },
    { id: "sleep", crisis: false },
    { id: "relationships", crisis: false },
    { id: "selfcare", crisis: false },
    { id: "crisis", crisis: true },
  ];

  var CRISIS_NUMBERS_EN =
    "<p><strong>If you or someone else is in immediate danger, dial <a href=\"tel:112\" style=\"color:inherit\">112</a> (India emergency) or your local emergency number.</strong></p>" +
    "<p><strong>Tele MANAS</strong> (national mental health helpline): <strong>14416</strong> or <strong>1-800-891-4416</strong> (toll-free).</p>" +
    "<p><strong>KIRAN</strong> mental health helpline: <strong>1800-599-0019</strong> (24×7).</p>" +
    "<p><strong>Vandrevala Foundation</strong>: <strong>99996665555</strong> or <strong>1860-2662-345</strong>.</p>" +
    "<p><strong>iCall</strong> (TISS, Mon–Sat): <strong>9152987821</strong>.</p>" +
    "<p>These services are confidential. You deserve support right now.</p>";

  var CRISIS_NUMBERS_HI =
    "<p><strong>अगर आप या कोई और तुरंत खतरे में है, तो <a href=\"tel:112\" style=\"color:inherit\">112</a> (भारत आपातकालीन) पर कॉल करें।</strong></p>" +
    "<p><strong>टेली मानस</strong> (राष्ट्रीय मानसिक स्वास्थ्य हेल्पलाइन): <strong>14416</strong> या <strong>1-800-891-4416</strong>।</p>" +
    "<p><strong>KIRAN</strong> हेल्पलाइन: <strong>1800-599-0019</strong> (२४×७)।</p>" +
    "<p><strong>Vandrevala Foundation</strong>: <strong>99996665555</strong> / <strong>1860-2662-345</strong>।</p>" +
    "<p><strong>iCall</strong> (TISS, सोम–शनि): <strong>9152987821</strong>।</p>" +
    "<p>ये सेवाएँ गोपनीय हैं। आपकी मदद ज़रूरी है।</p>";

  var CRISIS_NUMBERS_KN =
    "<p><strong>ನೀವು ಅಥವಾ ಬೇರೆ ಯಾರಾದರೂ ತಕ್ಷಣದ ಅಪಾಯದಲ್ಲಿದ್ದರೆ, <a href=\"tel:112\" style=\"color:inherit\">112</a> (ಭಾರತ ತುರ್ತು ಸಹಾಯ) ಕರೆ ಮಾಡಿ.</strong></p>" +
    "<p><strong>ಟೆಲಿ ಮಾನಸ್</strong> (ರಾಷ್ಟ್ರೀಯ ಮಾನಸಿಕ ಆರೋಗ್ಯ ಹೆಲ್ಪ್‌ಲೈನ್): <strong>14416</strong> ಅಥವಾ <strong>1-800-891-4416</strong>.</p>" +
    "<p><strong>KIRAN</strong> ಹೆಲ್ಪ್‌ಲೈನ್: <strong>1800-599-0019</strong> (೨೪×೭).</p>" +
    "<p><strong>Vandrevala Foundation</strong>: <strong>99996665555</strong> / <strong>1860-2662-345</strong>.</p>" +
    "<p><strong>iCall</strong> (TISS, ಸೋಮ–ಶನಿ): <strong>9152987821</strong>.</p>" +
    "<p>ಈ ಸೇವೆಗಳು ಗೋಪ್ಯವಾಗಿವೆ. ನಿಮಗೆ ಈಗ ಬೆಂಬಲ ಬೇಕು.</p>";

  var COPY = {
    en: {
      ariaRegion: "Saathi AI Companion — mental health support chat",
      openChat: "Open Saathi AI Companion chat",
      closeChat: "Close chat",
      sendMessage: "Send message",
      yourMessage: "Your message",
      title: "Saathi AI Companion",
      statusOnline: "Online — Here to listen",
      callManas: "Call MANAS (14416)",
      callManasAria: "Call Tele MANAS helpline 14416",
      disclaimer: "Not a substitute for professional care. Emergency: 112.",
      topics: "Topics",
      placeholder: "Type your message here…",
      thinking: "Thinking",
      langLabel: "Language",
      voiceStart: "Start voice input",
      voiceStop: "Stop listening",
      readAloudEnable: "Read assistant replies aloud",
      readAloudDisable: "Stop reading replies aloud",
      voiceUnavailable: "Voice typing needs a supported browser (e.g. Chrome) and HTTPS",
      crisis: CRISIS_NUMBERS_EN,
      categoryLabels: {
        general: "General",
        anxiety: "Anxiety",
        mood: "Low mood",
        stress: "Stress",
        sleep: "Sleep",
        relationships: "Relations",
        selfcare: "Self-care",
        crisis: "Crisis",
      },
      intros: {
        general:
          "<p>Hello! I’m your Saathi AI. I’m here to support your mental well-being. How has your day been?</p>",
        anxiety:
          "<p>Anxiety is very common. Small grounding steps can calm your nervous system over time.</p>" +
          "<p>What’s been triggering worry — situations, thoughts, or body sensations?</p>",
        mood:
          "<p>Low mood can make everything feel heavier. Your feelings are valid.</p>" +
          "<p>How long has this been going on, and is anything helping even a little?</p>",
        stress:
          "<p>Stress and burnout often build slowly — your load may have been high for too long.</p>" +
          "<p>Is work, family, studies, or health weighing on you the most?</p>",
        sleep:
          "<p>Sleep and mood affect each other. We can talk simple habits and when to see a doctor.</p>" +
          "<p>Is falling asleep, staying asleep, or waking too early hardest for you?</p>",
        relationships:
          "<p>Relationships can comfort us or hurt us — both deserve care.</p>" +
          "<p>Is there one relationship or pattern you’d like to explore?</p>",
        selfcare:
          "<p>Self-care is what sustainably supports you — not only “treat yourself” moments.</p>" +
          "<p>Which need feels most neglected: rest, food, movement, people, or purpose?</p>",
        crisis: CRISIS_NUMBERS_EN,
      },
      replies: {
        anxiety:
          "<p>It makes sense that anxiety feels heavy — your body may be trying to protect you.</p>" +
          "<p>Try grounding: 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste. Breathe in for 4, hold 2, out for 6.</p>" +
          "<p>If worry disrupts daily life, a psychologist or psychiatrist in India (including via Tele MANAS referral) can help with therapy and, if needed, medicine.</p>",
        mood:
          "<p>Thank you for sharing. Feeling low doesn’t mean you’re weak.</p>" +
          "<p>Small steps help: daylight, a short walk, texting someone you trust, or steady sleep and meals.</p>" +
          "<p>If this lasts two weeks or more, or you have thoughts of self-harm, please reach out to a professional or the helplines above.</p>",
        stress:
          "<p>Burnout builds quietly — by the time we notice, we’re often running on empty.</p>" +
          "<p>Try one boundary: a real break, saying no once, or protecting sleep. Rest is maintenance, not laziness.</p>" +
          "<p>If things feel unsustainable, counseling (including many affordable options in Indian cities) can help you plan next steps.</p>",
        sleep:
          "<p>Sleep and mental health often go together. A fixed wake time and dim evenings can help your rhythm.</p>" +
          "<p>If you’re awake in bed a long time, get up, do something calm in low light, then return when sleepy.</p>" +
          "<p>Persistent insomnia is worth discussing with a doctor — sometimes it links to anxiety or depression.</p>",
        relationships:
          "<p>Relationships can bring comfort or pain — both are real.</p>" +
          "<p>Kind, clear words (“I feel ___ when ___”) often work better than blame. If you feel unsafe, prioritize safety and local support.</p>" +
          "<p>Family or couples counseling is available in many Indian clinics and online platforms.</p>",
        selfcare:
          "<p>Self-care includes basics that hold you steady: food, movement, sleep, connection.</p>" +
          "<p>When energy is low, aim for “good enough” routines — small consistency beats big bursts.</p>",
        hello:
          "<p>Namaste — I’m glad you’re here. I offer support ideas, not a replacement for licensed care.</p>" +
          "<p>Choose a topic or type freely in your language.</p>",
        thanks:
          "<p>You’re welcome. Reaching out is a form of self-respect.</p>" +
          "<p>Come back whenever you need this space.</p>",
        bye:
          "<p>Take care. You can open this chat again anytime.</p>" +
          "<p>If things feel urgent, use 112 or the helplines in the Crisis help topic.</p>",
      },
      defaults: [
        "<p>I hear you. Naming feelings without judging them can already ease the pressure.</p>" +
          "<p>One tiny step — water, fresh air, or a message to someone you trust — can help. For severe or long-lasting symptoms, a mental health professional in your city can guide you.</p>",
        "<p>Thank you for trusting this chat.</p>" +
          "<p>Add a little more detail, or pick a topic in the strip above.</p>",
        "<p>What you’re carrying matters. You don’t have to fix everything today.</p>" +
          "<p>Breathing slowly, writing a few lines, or stepping away for five minutes can create space. Professional support is a strong option when you feel stuck.</p>",
      ],
    },
    hi: {
      ariaRegion: "साथी AI सहयोगी — मानसिक स्वास्थ्य चैट",
      openChat: "साथी AI चैट खोलें",
      closeChat: "चैट बंद करें",
      sendMessage: "भेजें",
      yourMessage: "आपका संदेश",
      title: "साथी AI सहयोगी",
      statusOnline: "ऑनलाइन — सुनने के लिए यहाँ",
      callManas: "मानस कॉल (14416)",
      callManasAria: "टेली मानस हेल्पलाइन 14416 पर कॉल करें",
      disclaimer: "पेशेवर देखभाल का विकल्प नहीं। आपात: 112।",
      topics: "विषय",
      placeholder: "अपना संदेश यहाँ लिखें…",
      thinking: "जवाब तैयार हो रहा है",
      langLabel: "भाषा",
      voiceStart: "आवाज़ इनपुट शुरू करें",
      voiceStop: "सुनना बंद करें",
      readAloudEnable: "जवाब आवाज़ में सुनें",
      readAloudDisable: "आवाज़ बंद करें",
      voiceUnavailable: "आवाज़ टाइपिंग के लिए समर्थित ब्राउज़र (जैसे Chrome) और HTTPS चाहिए",
      crisis: CRISIS_NUMBERS_HI,
      categoryLabels: {
        general: "सामान्य",
        anxiety: "चिंता",
        mood: "उदासी",
        stress: "तनाव",
        sleep: "नींद",
        relationships: "रिश्ते",
        selfcare: "देखभाल",
        crisis: "संकट",
      },
      intros: {
        general:
          "<p>नमस्ते! मैं आपकी साथी AI हूँ। मैं आपके मानसिक स्वास्थ्य का समर्थन करने के लिए यहाँ हूँ। आपका दिन कैसा रहा?</p>",
        anxiety:
          "<p>चिंता बहुत आम है। छोटे कदम समय के साथ मदद कर सकते हैं।</p>" +
          "<p>किस चीज़ से ज़्यादा चिंता हो रही है?</p>",
        mood:
          "<p>उदासी सब कुछ भारी लगा सकती है। आपकी भावनाएँ मायने रखती हैं।</p>" +
          "<p>कब से ऐसा महसूस हो रहा है? कुछ हल्का सा अच्छा लगता है?</p>",
        stress:
          "<p>तनाव धीरे-धीरे बढ़ता है — हो सकता है बोझ बहुत दिनों से ज़्यादा हो।</p>" +
          "<p>काम, परिवार, पढ़ाई या सेहत में से क्या सबसे दबाव डाल रहा है?</p>",
        sleep:
          "<p>नींद और मूड एक-दूसरे को प्रभावित करते हैं। आदतों और डॉक्टर से कब मिलें, इस पर बात कर सकते हैं।</p>" +
          "<p>सोने में, सोए रहने में, या जल्दी जागने में क्या सबसे मुश्किल है?</p>",
        relationships:
          "<p>रिश्ते सुकून या दर्द दोनों दे सकते हैं — दोनों सच हैं।</p>" +
          "<p>क्या कोई एक रिश्ता या पैटर्न है जिस पर बात करनी है?</p>",
        selfcare:
          "<p>खुद की देखभाल वह है जो लगातार आपको संभाले — सिर्फ मज़े नहीं।</p>" +
          "<p>आराम, खाना, हलचल, लोग, या मकसद — क्या सबसे कम ध्यान मिल रहा है?</p>",
        crisis: CRISIS_NUMBERS_HI,
      },
      replies: {
        anxiety:
          "<p>चिंता भारी लगना स्वाभाविक है — शरीर आपकी रक्षा करने की कोशिश कर रहा हो सकता है।</p>" +
          "<p>ज़मीन से जुड़ें: 5 चीज़ें देखें, 4 महसूस करें, 3 सुनें… धीमी साँस लें।</p>" +
          "<p>अगर चिंता रोज़मर्रा बाधित करे, मनोवैज्ञानिक या मनोचिकित्सक मदद कर सकते हैं।</p>",
        mood:
          "<p>बांटने के लिए धन्यवाद। उदास महसूस करना कमजोरी नहीं है।</p>" +
          "<p>छोटे कदम: धूप, छोटी सैर, किसी भरोसेमंद को संदेश, नियमित नींद और खाना।</p>" +
          "<p>अगर हफ्तों तक रहे या आत्महानि के विचार आएं, कृपया विशेषज्ञ या हेल्पलाइन से संपर्क करें।</p>",
        stress:
          "<p>बर्नआउट धीरे बनता है — ऊर्जा कम हो चुकी हो सकती है।</p>" +
          "<p>एक सीमा आज़माएँ: असली ब्रेक, एक बार ‘ना’, या नींद बचाना। आराम ज़रूरी है।</p>" +
          "<p>काउंसलिंग कई भारतीय शहरों में उपलब्ध है — योजना में मदद मिल सकती है।</p>",
        sleep:
          "<p>नींद और मन एक-दूसरे से जुड़े हैं। एक ही समय उठना और शाम को कम रोशनी मदद कर सकती है।</p>" +
          "<p>बिस्तर पर जागते रहें तो उठकर हल्की रोशनी में शांत काम करें, फिर नींद आने पर लौटें।</p>" +
          "<p>लगातार दिक्कत हो तो डॉक्टर से बात करें।</p>",
        relationships:
          "<p>रिश्ते सुख या दुख दोनों दे सकते हैं।</p>" +
          "<p>साफ, दयालु शब्द अक्सर आरोप से बेहतर काम करते हैं। अगर असुरक्षित लगे तो सुरक्षा पहले।</p>" +
          "<p>पारिवारिक या जोड़ा परामर्श क्लीनिक और ऑनलाइन पर मिल सकता है।</p>",
        selfcare:
          "<p>खुद की देखभाल में बुनियादी चीज़ें हैं: खाना, हलचल, नींद, जुड़ाव।</p>" +
          "<p>ऊर्जा कम हो तो ‘काफी अच्छा’ लक्ष्य रखें — छोटी नियमितता बड़े उछालों से बेहतर।</p>",
        hello:
          "<p>नमस्ते — आप यहाँ आए, यह अच्छा है। मैं सहयोग के विचार देता/देती हूँ, लाइसेंस प्रोफेशनल का स्थान नहीं लेता/लेती।</p>" +
          "<p>कोई विषय चुनें या अपनी भाषा में लिखें।</p>",
        thanks:
          "<p>आपका स्वागत है। संपर्क करना आत्म-सम्मान है।</p>" +
          "<p>जब चाहें वापस आएँ।</p>",
        bye:
          "<p>अपना ख्याल रखें। यह चैट फिर खोल सकते हैं।</p>" +
          "<p>तुरंत दिक्कत हो तो 112 या संकट विषय की हेल्पलाइन।</p>",
      },
      defaults: [
        "<p>मैं समझ रहा/रही हूँ। भावनाओं को बिना दोष दिए नाम देने से कभी-कभी राहत मिलती है।</p>" +
          "<p>एक छोटा कदम — पानी, हवा, या किसी को संदेश — मदद कर सकता है। गंभीर या लंबे लक्षणों के लिए विशेषज्ञ से बात करें।</p>",
        "<p>विचार साझा करने के लिए धन्यवाद।</p>" +
          "<p>थोड़ा और विवरण दें, या ऊपर पट्टी से दूसरा विषय चुनें।</p>",
        "<p>जो आप महसूस कर रहे हैं, वह मायने रखता है। सब कुछ आज ठीक नहीं करना पड़ता।</p>" +
          "<p>धीमी साँस, कुछ पंक्तियाँ लिखना, या पाँच मिनट अलग — सोच में जगह बना सकता है।</p>",
      ],
    },
    kn: {
      ariaRegion: "ಸಾತಿ AI ಸಹಚರ — ಮಾನಸಿಕ ಆರೋಗ್ಯ ಚಾಟ್",
      openChat: "ಸಾತಿ AI ಚಾಟ್ ತೆರೆಯಿರಿ",
      closeChat: "ಚಾಟ್ ಮುಚ್ಚಿ",
      sendMessage: "ಕಳುಹಿಸಿ",
      yourMessage: "ನಿಮ್ಮ ಸಂದೇಶ",
      title: "ಸಾತಿ AI ಸಹಚರ",
      statusOnline: "ಆನ್‌ಲೈನ್ — ಕೇಳಲು ಇಲ್ಲಿದ್ದೇನೆ",
      callManas: "MANAS ಕರೆ (14416)",
      callManasAria: "ಟೆಲಿ ಮಾನಸ್ ಹೆಲ್ಪ್‌ಲೈನ್ 14416 ಗೆ ಕರೆ ಮಾಡಿ",
      disclaimer: "ವೃತ್ತಿಪರ ಚಿಕಿತ್ಸೆಯ ಬದಲಿ ಅಲ್ಲ. ತುರ್ತು: 112.",
      topics: "ವಿಷಯಗಳು",
      placeholder: "ನಿಮ್ಮ ಸಂದೇಶ ಇಲ್ಲಿ ಬರೆಯಿರಿ…",
      thinking: "ಜವಾಬ್ ಸಿದ್ಧವಾಗುತ್ತಿದೆ",
      langLabel: "ಭಾಷೆ",
      voiceStart: "ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಪ್ರಾರಂಭಿಸಿ",
      voiceStop: "ಕೇಳುವುದನ್ನು ನಿಲ್ಲಿಸಿ",
      readAloudEnable: "ಉತ್ತರಗಳನ್ನು ಧ್ವನಿಯಲ್ಲಿ ಕೇಳಿ",
      readAloudDisable: "ಧ್ವನಿ ಓದುವುದನ್ನು ನಿಲ್ಲಿಸಿ",
      voiceUnavailable: "ಧ್ವನಿ ಟೈಪಿಂಗ್‌ಗೆ Chrome/Edge ಮತ್ತು HTTPS ಬೇಕು",
      crisis: CRISIS_NUMBERS_KN,
      categoryLabels: {
        general: "ಸಾಮಾನ್ಯ",
        anxiety: "ಚಿಂತೆ",
        mood: "ಮನ",
        stress: "ಒತ್ತಡ",
        sleep: "ನಿದ್ರೆ",
        relationships: "ಸಂಬಂಧ",
        selfcare: "ಸ್ವಪಾಲನೆ",
        crisis: "ತುರ್ತು",
      },
      intros: {
        general:
          "<p>ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಸಾತಿ AI. ನಿಮ್ಮ ಮಾನಸಿಕ ಕ್ಷೇಮಕ್ಕೆ ನಾನು ಇಲ್ಲಿದ್ದೇನೆ. ನಿಮ್ಮ ದಿನ ಹೇಗಿತ್ತು?</p>",
        anxiety:
          "<p>ಚಿಂತೆ ತುಂಬಾ ಸಾಮಾನ್ಯ. ಸಣ್ಣ ಹೆಜ್ಜೆಗಳು ಕಾಲಾಂತರದಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಹುದು.</p>" +
          "<p>ಏನು ಹೆಚ್ಚು ಚಿಂತೆ ತರುತ್ತಿದೆ?</p>",
        mood:
          "<p>ಮನಸ್ಸು ಕೆಡಿದಾಗ ಎಲ್ಲವೂ ಭಾರವಾಗಿ ತೋರುತ್ತದೆ. ನಿಮ್ಮ ಭಾವನೆಗಳು ಮುಖ್ಯ.</p>" +
          "<p>ಎಷ್ಟು ಕಾಲ ಇದೆ? ಸ್ವಲ್ಪವೂ ಉತ್ತಮ ಅನಿಸುತ್ತಿದೆಯೇ?</p>",
        stress:
          "<p>ಒತ್ತಡ ನಿಧಾನವಾಗಿ ಬೆಳೆಯುತ್ತದೆ — ಬಹಳ ದಿನಗಳಿಂದ ಹೊರೆ ಹೆಚ್ಚಾಗಿರಬಹುದು.</p>" +
          "<p>ಕೆಲಸ, ಕುಟುಂಬ, ಅಧ್ಯಯನ ಅಥವಾ ಆರೋಗ್ಯ — ಏನು ಹೆಚ್ಚು ಒತ್ತಡ?</p>",
        sleep:
          "<p>ನಿದ್ರೆ ಮತ್ತು ಮನಸ್ಸು ಒಬ್ಬರನ್ನೊಬ್ಬರು ಪ್ರಭಾವಿಸುತ್ತವೆ. ಅಭ್ಯಾಸಗಳು ಮತ್ತು ವೈದ್ಯರನ್ನು ಯಾವಾಗ ಭೇಟಿ ಮಾಡಬೇಕು ಎಂದು ಮಾತಾಡಬಹುದು.</p>" +
          "<p>ನಿದ್ರೆ ಬರಲು, ನಿದ್ರಿಸುವುದು, ಅಥವಾ ಬೇಗ ಎಚ್ಚರಾಗುವುದು — ಏನು ಕಷ್ಟ?</p>",
        relationships:
          "<p>ಸಂಬಂಧಗಳು ಸಾಂತ್ವನ ಅಥವಾ ನೋವು — ಎರಡೂ ನಿಜ.</p>" +
          "<p>ನಿರ್ದಿಷ್ಟ ಸಂಬಂಧ ಅಥವಾ ಮಾದರಿಯ ಬಗ್ಗೆ ಮಾತಾಡಬೇಕೇ?</p>",
        selfcare:
          "<p>ಸ್ವ-ಪಾಲನೆ ಎಂದರೆ ನಿಮ್ಮನ್ನು ಸ್ಥಿರವಾಗಿ ನಿಲ್ಲಿಸುವುದು — ಕೇವಲ ಮಜಾ ಅಲ್ಲ.</p>" +
          "<p>ವಿಶ್ರಾಂತಿ, ಆಹಾರ, ಚಲನೆ, ಸಂಪರ್ಕ, ಅರ್ಥ — ಏನು ಕಡಿಮೆ ಗಮನ?</p>",
        crisis: CRISIS_NUMBERS_KN,
      },
      replies: {
        anxiety:
          "<p>ಚಿಂತೆ ಭಾರವಾಗಿ ಅನಿಸುವುದು ಸಹಜ — ದೇಹ ರಕ್ಷಿಸಲು ಪ್ರಯತ್ನಿಸುತ್ತಿರಬಹುದು.</p>" +
          "<p>ನೆಲಕ್ಕೆ ಸಂಬಂಧಿಸಿ: 5 ನೋಡಿ, 4 ಮುಟ್ಟಿ, 3 ಕೇಳಿ… ನಿಧಾನವಾಗಿ ಉಸಿರಾಡಿ.</p>" +
          "<p>ಚಿಂತೆ ದೈನಂದಿನ ಜೀವನವನ್ನು ತಡೆಹಿಡಿದರೆ, ಮನೋವಿಜ್ಞಾನಿ ಅಥವಾ ಮನೋವೈದ್ಯರು ಸಹಾಯ ಮಾಡಬಹುದು.</p>",
        mood:
          "<p>ಹಂಚಿಕೊಂಡಿದ್ದಕ್ಕೆ ಧನ್ಯವಾದಗಳು. ಮನಸ್ಸು ಕೆಟ್ಟಿರುವುದು ದುರ್ಬಲತೆ ಅಲ್ಲ.</p>" +
          "<p>ಸಣ್ಣ ಹೆಜ್ಜೆಗಳು: ಬೆಳಕು, ಸಣ್ಣ ನಡಿಗೆ, ನಂಬಿಕಸ್ತರಿಗೆ ಸಂದೇಶ, ನಿದ್ರೆ ಮತ್ತು ಆಹಾರ.</p>" +
          "<p>ವಾರಗಳ ಕಾಲ ಇದ್ದರೆ ಅಥವಾ ಆತ್ಮಹಾನಿಯ ಯೋಚನೆಗಳಿದ್ದರೆ, ದಯವಿಟ್ಟು ತಜ್ಞರು ಅಥವಾ ಹೆಲ್ಪ್‌ಲೈನ್‌ಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ.</p>",
        stress:
          "<p>ಬರ್ನ್‌ಔಟ್ ನಿಧಾನವಾಗಿ ಬರುತ್ತದೆ — ಊರ್ಜೆ ಕಡಿಮೆಯಾಗಿರಬಹುದು.</p>" +
          "<p>ಒಂದು ಎಲೆ: ನಿಜವಾದ ವಿರಾಮ, ಒಮ್ಮೆ ‘ಇಲ್ಲ’, ಅಥವಾ ನಿದ್ರೆ ರಕ್ಷಿಸುವುದು. ವಿಶ್ರಾಂತಿ ಅಗತ್ಯ.</p>" +
          "<p>ಕೌನ್ಸೆಲಿಂಗ್ ಭಾರತದ ಅನೇಕ ನಗರಗಳಲ್ಲಿ ಲಭ್ಯ — ಮುಂದಿನ ಹೆಜ್ಜೆಗಳಿಗೆ ಸಹಾಯ.</p>",
        sleep:
          "<p>ನಿದ್ರೆ ಮತ್ತು ಮನಸ್ಸು ಒಟ್ಟಿಗೆ ಬದಲಾಗುತ್ತವೆ. ಒಂದೇ ಸಮಯದಲ್ಲಿ ಎಚ್ಚರ, ಮಂದ ಬೆಳಕು ಸಹಾಯ.</p>" +
          "<p>ಹಾಸಿಗೆಯಲ್ಲಿ ಬಹಳ ಜಾಗೃತರಾಗಿದ್ದರೆ, ಎದ್ದು ಮಂದ ಬೆಳಕಿನಲ್ಲಿ ಶಾಂತವಾಗಿ, ನಂತರ ಮರಳಿ.</p>" +
          "<p>ನಿರಂತರ ಸಮಸ್ಯೆಗೆ ವೈದ್ಯರನ್ನು ಕಾಣಿ.</p>",
        relationships:
          "<p>ಸಂಬಂಧಗಳು ಸಂತೋಷ ಅಥವಾ ನೋವು ನೀಡಬಹುದು.</p>" +
          "<p>ಸ್ಪಷ್ಟ, ದಯೆಯುತ ಮಾತುಗಳು ಆಗಾಗ್ಗೆ ದೋಷಾರೋಪಕ್ಕಿಂತ ಉತ್ತಮ. ಅಸುರಕ್ಷಿತವಾಗಿದ್ದರೆ ಸುರಕ್ಷತೆ ಮೊದಲು.</p>" +
          "<p>ಕುಟುಂಬ ಅಥವಾ ಜೋಡಿ ಸಲಹೆ ಕ್ಲಿನಿಕ್‌ಗಳು ಮತ್ತು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಲಭ್ಯ.</p>",
        selfcare:
          "<p>ಸ್ವ-ಪಾಲನೆಯಲ್ಲಿ ಮೂಲಭೂತ: ಆಹಾರ, ಚಲನೆ, ನಿದ್ರೆ, ಸಂಪರ್ಕ.</p>" +
          "<p>ಊರ್ಜೆ ಕಡಿಮೆಯಿದ್ದರೆ ‘ಸಾಕಷ್ಟು ಒಳ್ಳೆಯದು’ ಗುರಿ ಇಡಿ — ಸಣ್ಣ ಸ್ಥಿರತೆ ದೊಡ್ಡ ಹಾರಾಟಗಳಿಗಿಂತ ಉತ್ತಮ.</p>",
        hello:
          "<p>ನಮಸ್ಕಾರ — ನೀವು ಬಂದಿದ್ದೀರಿ, ಇದು ಒಳ್ಳೆಯದು. ನಾನು ಬೆಂಬಲದ ಕಲ್ಪನೆಗಳನ್ನು ನೀಡುತ್ತೇನೆ, ಪರವಾನಗಿ ಪಡೆದ ವೃತ್ತಿಪರರ ಬದಲಿ ಅಲ್ಲ.</p>" +
          "<p>ವಿಷಯ ಆಯ್ಕೆ ಮಾಡಿ ಅಥವಾ ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಬರೆಯಿರಿ.</p>",
        thanks:
          "<p>ಸ್ವಾಗತ. ಸಂಪರ್ಕಿಸುವುದು ಸ್ವಾಭಿಮಾನದ ಚಿಹ್ನೆ.</p>" +
          "<p>ಬೇಕಾದಾಗ ಮರಳಿ ಬನ್ನಿ.</p>",
        bye:
          "<p>ನಿಮ್ಮ ಆರೈಕೆ ಮಾಡಿಕೊಳ್ಳಿ. ಈ ಚಾಟ್ ಮತ್ತೆ ತೆರೆಯಬಹುದು.</p>" +
          "<p>ತುರ್ತಾದರೆ 112 ಅಥವಾ ತುರ್ತು ಸಹಾಯ ವಿಷಯದ ಹೆಲ್ಪ್‌ಲೈನ್‌ಗಳು.</p>",
      },
      defaults: [
        "<p>ನಾನು ಕೇಳುತ್ತಿದ್ದೇನೆ. ಭಾವನೆಗಳನ್ನು ದೋಷವಿಲ್ಲದೆ ಹೆಸರಿಸುವುದು ಕೆಲವೊಮ್ಮೆ ಒತ್ತಡ ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.</p>" +
          "<p>ಒಂದು ಸಣ್ಣ ಹೆಜ್ಜೆ — ನೀರು, ಗಾಳಿ, ಅಥವಾ ನಂಬಿಕಸ್ತರಿಗೆ ಸಂದೇಶ — ಸಹಾಯ ಮಾಡಬಹುದು. ತೀವ್ರ ಅಥವಾ ದೀರ್ಘಕಾಲದ ಲಕ್ಷಣಗಳಿಗೆ ತಜ್ಞರನ್ನು ಭೇಟಿ ಮಾಡಿ.</p>",
        "<p>ನಿಮ್ಮ ಆಲೋಚನೆಗಳನ್ನು ಹಂಚಿಕೊಂಡಿದ್ದಕ್ಕೆ ಧನ್ಯವಾದಗಳು.</p>" +
          "<p>ಸ್ವಲ್ಪ ಹೆಚ್ಚು ವಿವರ ನೀಡಿ, ಅಥವಾ ಮೇಲಿನ ಪಟ್ಟಿಯಿಂದ ಬೇರೆ ವಿಷಯ ಆಯ್ಕೆ ಮಾಡಿ.</p>",
        "<p>ನೀವು ಅನುಭವಿಸುತ್ತಿರುವುದು ಮುಖ್ಯ. ಇಂದು ಎಲ್ಲವನ್ನೂ ಸರಿಪಡಿಸಬೇಕಾಗಿಲ್ಲ.</p>" +
          "<p>ನಿಧಾನ ಉಸಿರು, ಕೆಲವು ಸಾಲುಗಳು, ಅಥವಾ ಐದು ನಿಮಿಷ ಅಂತರ — ಆಲೋಚನೆಗೆ ಜಾಗ ಮಾಡಬಹುದು.</p>",
      ],
    },
  };

  var KEYWORD_ROWS = [
    {
      keys: [
        "suicide",
        "kill myself",
        "end my life",
        "want to die",
        "hurt myself",
        "self harm",
        "no reason to live",
        "आत्महत्या",
        "खुदकुशी",
        "मरना चाह",
        "जान दे",
        "खुद को खत्म",
        "ಆತ್ಮಹತ್ಯೆ",
        "ಸಾಯಲು",
        "ಜೀವ ತ್ಯಜ",
      ],
      replyKey: "crisis",
      crisis: true,
    },
    {
      keys: [
        "anxious",
        "anxiety",
        "panic",
        "worried",
        "worry",
        "nervous",
        "overwhelming",
        "चिंता",
        "घबराहट",
        "बेचैनी",
        "डर",
        "ಚಿಂತೆ",
        "ಆತಂಕ",
        "ಭಯ",
        "ಪಾನಿಕ್",
      ],
      replyKey: "anxiety",
    },
    {
      keys: [
        "sad",
        "depressed",
        "depression",
        "hopeless",
        "empty",
        "down",
        "cry",
        "उदास",
        "उदासी",
        "निराश",
        "खालीपन",
        "ಉದಾಸೀನ",
        "ನಿರಾಶೆ",
        "ಖಾಲಿ",
        "ಅಳು",
      ],
      replyKey: "mood",
    },
    {
      keys: [
        "stress",
        "burnout",
        "overwork",
        "exhausted",
        "too much",
        "overwhelmed",
        "तनाव",
        "थकान",
        "थकावट",
        "ಒತ್ತಡ",
        "ಬರ್ನ್",
        "ಥಕ್ವೆ",
        "ಕೆಲಸ ಹೆಚ್ಚು",
      ],
      replyKey: "stress",
    },
    {
      keys: [
        "sleep",
        "insomnia",
        "can't sleep",
        "cant sleep",
        "tired",
        "exhausted at night",
        "नींद",
        "अनिद्रा",
        "नींद नहीं",
        "ನಿದ್ರೆ",
        "ನಿದ್ರೆ ಬರುವುದಿಲ್ಲ",
        "ಉಂಟಾಗುತ್ತಿಲ್ಲ ನಿದ್ರೆ",
      ],
      replyKey: "sleep",
    },
    {
      keys: [
        "relationship",
        "partner",
        "family",
        "friend",
        "lonely",
        "alone",
        "argue",
        "fight",
        "रिश्ता",
        "परिवार",
        "अकेला",
        "अकेलापन",
        "झगड़ा",
        "ಸಂಬಂಧ",
        "ಕುಟುಂಬ",
        "ಸ್ನೇಹಿತ",
        "ಒಂಟಿತನ",
        "ಜಗಳ",
      ],
      replyKey: "relationships",
    },
    {
      keys: [
        "self care",
        "self-care",
        "routine",
        "habits",
        "motivation",
        "खुद की देखभाल",
        "दिनचर्या",
        "ಸ್ವ ಪಾಲನೆ",
        "ದಿನಚರಿ",
        "ಅಭ್ಯಾಸ",
        "ಪ್ರೇರಣೆ",
      ],
      replyKey: "selfcare",
    },
    {
      keys: [
        "hello",
        "hi",
        "hey",
        "namaste",
        "नमस्ते",
        "नमस्कार",
        "namaskar",
        "namaskara",
        "ನಮಸ್ಕಾರ",
        "namaskāra",
        "good morning",
        "good afternoon",
        "good evening",
        "सुप्रभात",
        "ಶುಭೋದಯ",
      ],
      replyKey: "hello",
    },
    {
      keys: ["thank", "thanks", "धन्यवाद", "शुक्रिया", "ಧನ್ಯವಾದ"],
      replyKey: "thanks",
    },
    {
      keys: ["bye", "goodbye", "see you", "later", "alvida", "अलविदा", "ವಿದಾಯ", "ಮತ್ತೆ ಸಿಗೋಣ"],
      replyKey: "bye",
    },
  ];

  function normalize(text) {
    return (text || "").toLowerCase().trim();
  }

  function getCopy(lang) {
    return COPY[lang] || COPY.en;
  }

  function getBotReply(userText, activeCategory, lang) {
    var L = getCopy(lang);
    var lower = normalize(userText);
    var t = userText || "";

    var i, k, row, key;
    for (i = 0; i < KEYWORD_ROWS.length; i++) {
      row = KEYWORD_ROWS[i];
      for (k = 0; k < row.keys.length; k++) {
        key = row.keys[k];
        if (key.length <= 2) continue;
        if (lower.indexOf(key.toLowerCase()) !== -1 || t.indexOf(key) !== -1) {
          if (row.replyKey === "crisis") {
            return { html: L.crisis, crisis: true };
          }
          return { html: L.replies[row.replyKey], crisis: false };
        }
      }
    }

    /* No keyword match: use topic-aware reply when a specific category is active */
    var cat = activeCategory;
    if (cat && cat !== "general" && cat !== "crisis" && L.replies[cat]) {
      if (Math.random() < 0.5) {
        return { html: L.replies[cat], crisis: false };
      }
    }

    var defaults = L.defaults;
    var idx = Math.floor(Math.random() * defaults.length);
    return { html: defaults[idx], crisis: false };
  }

  function MentalHealthChatbot(container) {
    this.container = typeof container === "string" ? document.querySelector(container) : container;
    this.activeCategory = "general";
    this.open = false;
    this.lang = "en";
    this.readAloudOn = false;
    this.listening = false;
    this.recog = null;
    this.voiceSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    this.readAloudSupported =
      typeof window.speechSynthesis !== "undefined" && typeof SpeechSynthesisUtterance !== "undefined";
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && COPY[saved]) this.lang = saved;
    } catch (e) {}
    this.init();
  }

  MentalHealthChatbot.prototype.getStrings = function () {
    return getCopy(this.lang);
  };

  MentalHealthChatbot.prototype.init = function () {
    var S = this.getStrings();
    var root = document.createElement("div");
    root.className = "mh-chatbot";
    root.setAttribute("role", "region");
    root.setAttribute("aria-label", S.ariaRegion);

    root.innerHTML =
      '<button type="button" class="mh-chatbot__launcher" aria-label="" aria-expanded="false">' +
      '<span class="mh-chatbot__launcher-icon" aria-hidden="true">' +
      '<svg viewBox="0 0 40 40" width="34" height="34" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="20" cy="20" r="20" fill="#0d9488"/>' +
      '<rect x="11" y="14" width="18" height="14" rx="3" fill="#134e4a"/>' +
      '<circle cx="15" cy="20" r="2" fill="#99f6e4"/>' +
      '<circle cx="25" cy="20" r="2" fill="#99f6e4"/>' +
      '<path d="M14 26 Q20 29 26 26" stroke="#99f6e4" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
      "</svg></span></button>" +
      '<div class="mh-chatbot__panel" aria-hidden="true">' +
      '<header class="mh-chatbot__header">' +
      '<div class="mh-chatbot__header-row">' +
      '<div class="mh-chatbot__avatar" aria-hidden="true">' +
      '<svg viewBox="0 0 40 40" width="40" height="40" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="20" cy="20" r="20" fill="#0d9488"/>' +
      '<rect x="11" y="14" width="18" height="14" rx="3" fill="#134e4a"/>' +
      '<circle cx="15" cy="20" r="2" fill="#99f6e4"/>' +
      '<circle cx="25" cy="20" r="2" fill="#99f6e4"/>' +
      '<path d="M14 26 Q20 29 26 26" stroke="#99f6e4" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
      "</svg></div>" +
      '<div class="mh-chatbot__header-text">' +
      '<h2 class="mh-chatbot__title"></h2>' +
      '<p class="mh-chatbot__status">' +
      '<span class="mh-chatbot__status-dot" aria-hidden="true"></span>' +
      '<span class="mh-chatbot__status-text"></span>' +
      "</p></div>" +
      '<button type="button" class="mh-chatbot__close" aria-label="">&times;</button>' +
      "</div>" +
      '<div class="mh-chatbot__header-row2">' +
      '<a href="tel:14416" class="mh-chatbot__manas">' +
      '<svg class="mh-chatbot__manas-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
      '<path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />' +
      "</svg>" +
      '<span class="mh-chatbot__manas-label"></span></a>' +
      '<button type="button" class="mh-chatbot__read-aloud" aria-pressed="false" aria-label="">' +
      '<svg class="mh-chatbot__read-aloud-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
      '<path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />' +
      "</svg></button>" +
      '<div class="mh-chatbot__lang" role="group" aria-label="">' +
      '<button type="button" class="mh-chatbot__lang-btn" data-lang="en" aria-pressed="false">EN</button>' +
      '<button type="button" class="mh-chatbot__lang-btn" data-lang="hi" aria-pressed="false">हि</button>' +
      '<button type="button" class="mh-chatbot__lang-btn" data-lang="kn" aria-pressed="false">ಕ</button>' +
      "</div></div>" +
      '<p class="mh-chatbot__disclaimer"></p>' +
      "</header>" +
      '<div class="mh-chatbot__topics-bar">' +
      '<span class="mh-chatbot__topics-label"></span>' +
      '<div class="mh-chatbot__categories-scroller">' +
      '<div class="mh-chatbot__categories"></div>' +
      "</div></div>" +
      '<div class="mh-chatbot__messages"></div>' +
      '<div class="mh-chatbot__input-wrap">' +
      '<textarea class="mh-chatbot__input" rows="1" placeholder="" aria-label=""></textarea>' +
      '<button type="button" class="mh-chatbot__mic" aria-label="">' +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path fill="currentColor" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>' +
      "</svg></button>" +
      '<button type="button" class="mh-chatbot__send" aria-label="">' +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />' +
      "</svg></button>" +
      "</div>" +
      "</div>";

    if (this.container) {
      this.container.appendChild(root);
    } else {
      document.body.appendChild(root);
    }

    this.el = root;
    this.launcher = root.querySelector(".mh-chatbot__launcher");
    this.panel = root.querySelector(".mh-chatbot__panel");
    this.titleEl = root.querySelector(".mh-chatbot__title");
    this.statusTextEl = root.querySelector(".mh-chatbot__status-text");
    this.disclaimerEl = root.querySelector(".mh-chatbot__disclaimer");
    this.topicsLabelEl = root.querySelector(".mh-chatbot__topics-label");
    this.manasLink = root.querySelector(".mh-chatbot__manas");
    this.manasLabelEl = root.querySelector(".mh-chatbot__manas-label");
    this.messagesEl = root.querySelector(".mh-chatbot__messages");
    this.categoriesEl = root.querySelector(".mh-chatbot__categories");
    this.input = root.querySelector(".mh-chatbot__input");
    this.sendBtn = root.querySelector(".mh-chatbot__send");
    this.micBtn = root.querySelector(".mh-chatbot__mic");
    this.readAloudBtn = root.querySelector(".mh-chatbot__read-aloud");
    this.closeBtn = root.querySelector(".mh-chatbot__close");
    this.langGroup = root.querySelector(".mh-chatbot__lang");

    this.applyStaticCopy();
    this.renderChips();
    this.bindEvents();
    this.messagesEl.innerHTML = "";
    this.addBotMessage(this.getStrings().intros.general, false);
  };

  MentalHealthChatbot.prototype.applyStaticCopy = function () {
    var S = this.getStrings();
    this.el.setAttribute("aria-label", S.ariaRegion);
    this.launcher.setAttribute("aria-label", S.openChat);
    this.closeBtn.setAttribute("aria-label", S.closeChat);
    this.sendBtn.setAttribute("aria-label", S.sendMessage);
    this.input.setAttribute("aria-label", S.yourMessage);
    this.input.setAttribute("placeholder", S.placeholder);
    this.titleEl.textContent = S.title;
    this.statusTextEl.textContent = S.statusOnline;
    this.disclaimerEl.textContent = S.disclaimer;
    this.topicsLabelEl.textContent = S.topics;
    this.manasLabelEl.textContent = S.callManas;
    this.manasLink.setAttribute("aria-label", S.callManasAria);
    this.langGroup.setAttribute("aria-label", S.langLabel);

    var btns = this.langGroup.querySelectorAll(".mh-chatbot__lang-btn");
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      var code = b.getAttribute("data-lang");
      b.classList.toggle("is-active", code === this.lang);
      b.setAttribute("aria-pressed", code === this.lang ? "true" : "false");
    }

    if (this.micBtn) {
      this.micBtn.hidden = !this.voiceSupported;
      this.micBtn.title = this.voiceSupported ? "" : S.voiceUnavailable;
    }
    if (this.readAloudBtn) {
      this.readAloudBtn.hidden = !this.readAloudSupported;
    }
    this.updateVoiceChrome();
  };

  MentalHealthChatbot.prototype.updateVoiceChrome = function () {
    var S = this.getStrings();
    if (this.micBtn && this.voiceSupported) {
      this.micBtn.setAttribute("aria-label", this.listening ? S.voiceStop : S.voiceStart);
    }
    if (this.readAloudBtn && this.readAloudSupported) {
      this.readAloudBtn.setAttribute("aria-label", this.readAloudOn ? S.readAloudDisable : S.readAloudEnable);
      this.readAloudBtn.setAttribute("aria-pressed", this.readAloudOn ? "true" : "false");
      this.readAloudBtn.classList.toggle("is-active", this.readAloudOn);
    }
  };

  MentalHealthChatbot.prototype.stopVoiceInput = function () {
    if (this.recog) {
      try {
        this.recog.onend = null;
        this.recog.onerror = null;
        this.recog.onresult = null;
        this.recog.abort();
      } catch (e) {}
      this.recog = null;
    }
    this.listening = false;
    if (this.micBtn) {
      this.micBtn.classList.remove("is-listening");
    }
    this.updateVoiceChrome();
  };

  MentalHealthChatbot.prototype.toggleMic = function () {
    var self = this;
    var S = this.getStrings();
    if (!this.voiceSupported) {
      return;
    }
    if (this.listening) {
      this.stopVoiceInput();
      return;
    }
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.stopVoiceInput();
    this.recog = new SR();
    this.recog.lang = VOICE_LANG_MAP[this.lang] || "en-IN";
    this.recog.continuous = false;
    this.recog.interimResults = true;
    this.recog.onstart = function () {
      self.listening = true;
      if (self.micBtn) {
        self.micBtn.classList.add("is-listening");
      }
      self.updateVoiceChrome();
    };
    this.recog.onend = function () {
      self.recog = null;
      self.listening = false;
      if (self.micBtn) {
        self.micBtn.classList.remove("is-listening");
      }
      self.updateVoiceChrome();
    };
    this.recog.onerror = function () {
      self.stopVoiceInput();
    };
    this.recog.onresult = function (e) {
      var text = "";
      var i;
      for (i = e.resultIndex; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      self.input.value = text;
      self.resizeInput();
    };
    try {
      this.recog.start();
    } catch (err) {
      this.stopVoiceInput();
      if (this.micBtn) {
        this.micBtn.title = S.voiceUnavailable;
      }
    }
  };

  MentalHealthChatbot.prototype.toggleReadAloud = function () {
    if (!this.readAloudSupported) return;
    this.readAloudOn = !this.readAloudOn;
    if (!this.readAloudOn) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    this.updateVoiceChrome();
  };

  MentalHealthChatbot.prototype.speakHtml = function (html) {
    if (!this.readAloudOn || !this.readAloudSupported) return;
    var div = document.createElement("div");
    div.innerHTML = html;
    var text = (div.textContent || div.innerText || "").replace(/\s+/g, " ").trim();
    if (!text) return;
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
    var u = new SpeechSynthesisUtterance(text);
    u.lang = VOICE_LANG_MAP[this.lang] || "en-IN";
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  };

  MentalHealthChatbot.prototype.setLanguage = function (code) {
    if (!COPY[code]) return;
    this.stopVoiceInput();
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
    this.lang = code;
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch (e) {}
    this.applyStaticCopy();
    this.renderChips();
    this.messagesEl.innerHTML = "";
    this.activeCategory = "general";
    this.addBotMessage(this.getStrings().intros.general, false);
  };

  MentalHealthChatbot.prototype.renderChips = function () {
    var self = this;
    var S = this.getStrings();
    this.categoriesEl.innerHTML = "";
    CATEGORY_IDS.forEach(function (cat) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mh-chatbot__chip" + (cat.crisis ? " mh-chatbot__chip--crisis" : "");
      if (cat.id === self.activeCategory) btn.classList.add("is-active");
      btn.textContent = S.categoryLabels[cat.id];
      btn.setAttribute("data-category", cat.id);
      self.categoriesEl.appendChild(btn);
    });
  };

  MentalHealthChatbot.prototype.setCategory = function (id) {
    if (id !== this.activeCategory) {
      this.activeCategory = id;
      var chips = this.categoriesEl.querySelectorAll(".mh-chatbot__chip");
      for (var i = 0; i < chips.length; i++) {
        chips[i].classList.toggle("is-active", chips[i].getAttribute("data-category") === id);
      }
    }
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
    this.messagesEl.innerHTML = "";
    var intro = this.getStrings().intros[id];
    if (intro) {
      this.addBotMessage(intro, id === "crisis");
    }
    this.scrollToBottom();
  };

  MentalHealthChatbot.prototype.togglePanel = function (show) {
    this.open = show;
    this.launcher.setAttribute("aria-expanded", show ? "true" : "false");
    this.panel.classList.toggle("is-open", show);
    this.panel.setAttribute("aria-hidden", show ? "false" : "true");
    if (!show) {
      this.stopVoiceInput();
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    } else {
      this.input.focus();
    }
  };

  MentalHealthChatbot.prototype.addBotMessage = function (html, crisis) {
    var wrap = document.createElement("div");
    wrap.className = "mh-chatbot__msg mh-chatbot__msg--bot" + (crisis ? " mh-chatbot__msg--crisis" : "");
    wrap.innerHTML = html;
    this.messagesEl.appendChild(wrap);
    this.scrollToBottom();
    this.speakHtml(html);
  };

  MentalHealthChatbot.prototype.addUserMessage = function (text) {
    var wrap = document.createElement("div");
    wrap.className = "mh-chatbot__msg mh-chatbot__msg--user";
    wrap.textContent = text;
    this.messagesEl.appendChild(wrap);
    this.scrollToBottom();
  };

  MentalHealthChatbot.prototype.showTyping = function () {
    var el = document.createElement("div");
    el.className = "mh-chatbot__typing";
    el.setAttribute("aria-live", "polite");
    var S = this.getStrings();
    el.innerHTML = escapeTyping(S.thinking);
    this.messagesEl.appendChild(el);
    this.scrollToBottom();
    return el;
  };

  function escapeTyping(s) {
    var div = document.createElement("div");
    div.textContent = s;
    var t = div.innerHTML;
    return t + "<span>.</span><span>.</span><span>.</span>";
  }

  MentalHealthChatbot.prototype.scrollToBottom = function () {
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  };

  MentalHealthChatbot.prototype.sendUserText = function () {
    var text = (this.input.value || "").trim();
    if (!text) return;
    this.input.value = "";
    this.resizeInput();
    this.addUserMessage(text);

    var typing = this.showTyping();
    var self = this;
    window.setTimeout(function () {
      typing.remove();
      var result = getBotReply(text, self.activeCategory, self.lang);
      self.addBotMessage(result.html, result.crisis);
    }, 500 + Math.random() * 400);
  };

  MentalHealthChatbot.prototype.resizeInput = function () {
    this.input.style.height = "auto";
    this.input.style.height = Math.min(this.input.scrollHeight, 100) + "px";
  };

  MentalHealthChatbot.prototype.bindEvents = function () {
    var self = this;

    this.launcher.addEventListener("click", function () {
      self.togglePanel(true);
    });

    this.closeBtn.addEventListener("click", function () {
      self.togglePanel(false);
    });

    this.langGroup.addEventListener("click", function (e) {
      var b = e.target.closest(".mh-chatbot__lang-btn");
      if (!b) return;
      self.setLanguage(b.getAttribute("data-lang"));
    });

    this.categoriesEl.addEventListener("click", function (e) {
      var chip = e.target.closest(".mh-chatbot__chip");
      if (!chip) return;
      self.setCategory(chip.getAttribute("data-category"));
    });

    this.sendBtn.addEventListener("click", function () {
      self.sendUserText();
    });

    this.input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        self.sendUserText();
      }
    });

    this.input.addEventListener("input", function () {
      self.resizeInput();
    });

    if (this.micBtn) {
      this.micBtn.addEventListener("click", function () {
        self.toggleMic();
      });
    }

    if (this.readAloudBtn) {
      this.readAloudBtn.addEventListener("click", function () {
        self.toggleReadAloud();
      });
    }
  };

  window.MentalHealthChatbot = MentalHealthChatbot;
  window.MHLanguages = LANG_ORDER;
})();
