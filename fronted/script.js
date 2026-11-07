/**
 * Triggers the Native Web Speech Synthesis Engine
 * Automatically interprets text arrays or inputs and voices them out loud in real Hindi accents.
 */
function speakHindi(text) {
    // Terminates any ongoing background audio instances immediately to prevent audio overlap
    window.speechSynthesis.cancel(); 
    
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN'; // Targets the specific localization accent engine for standard Hindi
    utterance.rate = 0.85;   // Moderates speech rate to a slightly slower pace for clearer comprehension
    
    // Commands the operating system voice mechanism to speak out
    window.speechSynthesis.speak(utterance);
    
    // Automatically injects the translated subtitle text inside the screen container
    document.getElementById('audioText').innerText = "🔊 " + text;
}

/**
 * Global Page Init Handler
 * Plays an automated friendly audio walkthrough prompt right when the system launches.
 */
window.onload = function() {
    setTimeout(() => {
        speakHindi("नमस्कार! जन धन सहायक ऐप में आपका स्वागत है। अपनी पहचान देखने और टोकन नंबर पाने के लिए नीले बटन को दबाएँ।");
    }, 1000); 
};

/**
 * ULTRA-UNIQUE FEATURE START: FACE RECOGNITION & AUDIO TOKEN GENERATOR
 * Simulated Client-Side Computer Vision framework mapping for illiterate users.
 */
function startBalance() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('guideScreen').style.display = 'block';
    document.getElementById('screenTitle').innerText = "👤 चेहरा पहचान और टोकन काउंटर";
    
    let stepArea = document.getElementById('stepArea');
    
    // Step 1: Trigger Simulated Live Face Camera Scan Frame
    stepArea.innerHTML = `
        <div style="font-weight:bold; color:#2c3e50;">कैमरे के सामने देखें (Look at Camera)</div>
        <div class="camera-box">👤</div>
        <div style="color:#e74c3c; font-weight:bold;">चेहरा स्कैन हो रहा है...</div>
    `;
    speakHindi("कृपया स्क्रीन के ऊपर लगे गोल शीशे यानी कैमरे की तरफ देखें। हम आपका चेहरा पहचान रहे हैं।");

    // Step 2: After 4 seconds, show matched face photo profile (Empowering trust)
    setTimeout(() => {
        if(document.getElementById('mainMenu').style.display === 'none') {
            stepArea.innerHTML = `
                <div style="color:green; font-weight:bold; font-size:20px;">✓ चेहरा मिल गया है!</div>
                <div style="font-size: 50px; margin: 10px 0;">👵</div>
                <div style="background:#e8f5e9; padding:10px; border-radius:8px; font-weight:bold;">
                    खाता धारक: रामकली देवी <br>
                    कुल जमा राशि: ₹8,500
                </div>
            `;
            speakHindi("चेहरा मिल गया है। आपका नाम रामकली देवी है और आपके खाते में आठ हजार पांच सौ रुपए जमा हैं। अब आपका टोकन नंबर बन रहा है।");
            
            // Step 3: After another 5 seconds, print the unique Automated Audio Token Slip
            setTimeout(() => {
                if(document.getElementById('mainMenu').style.display === 'none') {
                    stepArea.innerHTML = `
                        <div class="token-card">
                            🎫 आपका टोकन नंबर: 42<br>
                            <span style="font-size:16px; color:#555;">(Token Number: 42)</span>
                        </div>
                        <div style="background:#fce4d6; padding:10px; border-radius:8px; color:#c0392b; font-weight:bold; animation: blinker 1.5s linear infinite;">
                            🚶 आपके आगे केवल 2 लोग हैं।
                        </div>
                    `;
                    speakHindi("आपका टोकन नंबर बयालीस है। आपके आगे सिर्फ दो लोग और हैं। जब काउंटर से बयालीस नंबर की आवाज आये, तब आप अंदर जाएँ।");
                }
            }, 6000);
        }
    }, 4500);
}

// 🟢 PAISE NIKALNA (Form Step-by-Step Guide)
let withdrawalSteps = [
    "सबसे ऊपर इस लाल डिब्बे में आज की तारीख किसी से लिखवाएँ।",
    "अब इस बीच वाले डिब्बे में जितने पैसे चाहिए वो लिखें, जैसे पाँच हज़ार रुपए।",
    "सबसे नीचे इस डिब्बे में अपना अंगूठा लगाएँ या दस्तखत करें।"
];
let currentStep = 0;

function startWithdrawal() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('guideScreen').style.display = 'block';
    document.getElementById('screenTitle').innerText = "🟢 पैसे निकालने का फॉर्म";
    currentStep = 0;
    showWithdrawalStep();
}

function showWithdrawalStep() {
    let stepArea = document.getElementById('stepArea');
    if(currentStep === 0) {
        stepArea.innerHTML = `<div class="blink-box" style="padding:10px;">📅 [ यहाँ तारीख (DATE) लिखें ]</div><br><div>💰 [ पैसे (AMOUNT) ]</div><br><div>👍 [ अंगूठा (SIGN) ]</div>`;
        speakHindi(withdrawalSteps[0]);
    } else if(currentStep === 1) {
        stepArea.innerHTML = `<div>📅 [ तारीख (DATE) ]</div><br><div class="blink-box" style="padding:10px;">💰 [ यहाँ पैसे लिखें: ₹5000 ]</div><br><div>👍 [ अंगूठा (SIGN) ]</div>`;
        speakHindi(withdrawalSteps[1]);
    } else if(currentStep === 2) {
        stepArea.innerHTML = `<div>📅 [ तारीख (DATE) ]</div><br><div>💰 [ पैसे (AMOUNT) ]</div><br><div class="blink-box" style="padding:10px;">👍 [ यहाँ अपना अंगूठा लगाएँ ]</div>`;
        speakHindi(withdrawalSteps[2]);
    }
    currentStep++;
    if(currentStep <= 3) {
        setTimeout(() => { if(document.getElementById('mainMenu').style.display === 'none' && currentStep <= 3) showWithdrawalStep(); }, 7000);
    }
}

// 🟡 CHECK DROP GUIDE
function startCheck() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('guideScreen').style.display = 'block';
    document.getElementById('screenTitle').innerText = "🟡 चेक भरने का तरीका";
    document.getElementById('stepArea').innerHTML = `<div>👤 नाम: [ किसे पैसे देने हैं ]</div><br><div class="blink-box" style="padding:10px;">✍️ पीछे: [ चेक के पीछे अपना मोबाइल नंबर ज़रूर लिखें ]</div>`;
    speakHindi("चेक के पीछे अपना नाम और मोबाइल नंबर ज़रूर लिखें, और इसे बैंक के पीले रंग के ड्रॉप बॉक्स में डाल दें।");
}

// GO BACK TO MENU
function goBack() {
    window.speechSynthesis.cancel(); 
    document.getElementById('guideScreen').style.display = 'none';
    document.getElementById('mainMenu').style.display = 'flex'; 
    speakHindi("मुख्य मेनू। अपनी सुविधा चुनें।");
}
