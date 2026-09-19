// Hjólameistarinn 1.1.0 - Mirko Garofalo (mig@hi.is)

const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const listBtn = document.getElementById("listsave");
const reductBtn = document.getElementById("noreduct");
spinBtn.disabled = true;
const secspace = document.getElementById("seconds");
const listspace = document.getElementById("names");
secspace.value = 10;
let counterx;
document.getElementById("abt").style.display = "none";
document.getElementById("descr").style.display = "none";

const lemmasnouns = ["hestur", "kona", "bók", "barn", "maður", "skóli", "umsókn", "tré", "hundur", "skór", "stærð", "hurð", "hús", "pabbi", "mamma", "móðir", "faðir", "sonur", "dóttir", "mál", "safi", "bolur", "hlekkur", "hnykkur", "vöxtur", "fjall", "vist", "lest", "list", "kirkja", "mynd", "bíómynd", "stund", "tími", "tæki", "bjór", "æfing", "lýsing", "frændi", "frænka", "bolti", "læknir", "hitamælir", "hjól", "blómapottur", "sófi", "strákur", "stelpa", "ferðataska", "vörn", "ferðalag", "banani", "epli", "dós", "land", "strönd", "hönd", "orð", "borð", "sveppur", "nemandi", "lás", "mús", "lús", "bíll", "brú", "vélmenni", "vinur", "kartafla", "leikari", "leikkona", "söngvari", "baun"];

const lemmasadjs = ["fallegur", "skemmtilegur", "blár", "stór", "gamall", "nýr", "svartur", "rauður", "grannur", "ríkur", "sannur", "laus", "vinsæll", "sterkur", "hávaxinn", "fyndinn", "mikill", "lítill", "hvítur", "þögull"];

const lemmasverbs = ["skrifa", "dansa", "bjóða", "fljúga", "drekka", "aðstoða", "hjálpa", "nema", "lesa", "standa", "aka", "læra", "æfa", "leyna", "elda", "gleyma", "styðja", "velja", "þurfa", "vilja", "verða"]

const casesnouns = ["ÞFET", "ÞGFET", "EFET", "NFETgr", "ÞFETgr", "ÞGFETgr", "EFETgr", "NFFT", "ÞFFT", "ÞGFFT", "EFFT", "NFFTgr", "ÞFFTgr", "ÞGFFTgr", "EFFTgr"];
const verbforms = ["GM-FH-NT-1P-ET", "GM-FH-NT-2P-ET", "GM-FH-NT-3P-ET","GM-FH-NT-1P-FT", "GM-FH-NT-2P-FT", "GM-FH-NT-3P-FT","GM-FH-ÞT-1P-ET", "GM-FH-ÞT-2P-ET", "GM-FH-ÞT-3P-ET","GM-FH-ÞT-1P-FT", "GM-FH-ÞT-2P-FT", "GM-FH-ÞT-3P-FT"];

const adjforms = ["FSB-KK-NFET", "FSB-KVK-NFET", "FSB-HK-NFET", "FSB-KK-ÞFET", "FSB-KVK-ÞFET", "FSB-HK-ÞFET", "FSB-KK-ÞGFET", "FSB-KVK-ÞGFET", "FSB-HK-ÞGFET", "FSB-KK-EFET", "FSB-KVK-EFET", "FSB-HK-EFET", "FSB-KK-NFFT", "FSB-KVK-NFFT", "FSB-HK-NFFT", "FSB-KK-ÞFFT", "FSB-KVK-ÞFFT", "FSB-HK-ÞFFT", "FSB-KK-ÞGFFT", "FSB-KVK-ÞGFFT", "FSB-HK-ÞGFFT", "FSB-KK-EFFT", "FSB-KVK-EFFT", "FSB-HK-EFFT", "FVB-KK-NFET", "FVB-KVK-NFET", "FVB-HK-NFET", "FVB-KK-ÞFET", "FVB-KVK-ÞFET", "FVB-HK-ÞFET", "FVB-KK-ÞGFET", "FVB-KVK-ÞGFET", "FVB-HK-ÞGFET", "FVB-KK-EFET", "FVB-KVK-EFET", "FVB-HK-EFET", "FVB-KK-NFFT", "FVB-KVK-NFFT", "FVB-HK-NFFT", "FVB-KK-ÞFFT", "FVB-KVK-ÞFFT", "FVB-HK-ÞFFT", "FVB-KK-ÞGFFT", "FVB-KVK-ÞGFFT", "FVB-HK-ÞGFFT", "FVB-KK-EFFT", "FVB-KVK-EFFT", "FVB-HK-EFFT"];

const tickSound = new Audio('tick.mp3');
const beepSound = new Audio('beep.mp3');
const alarmSound = new Audio('alarm.mp3');
let lastSegmentIndex = -1;
let animationFrameId = null;
let winningIndex = null;
let randomLemma;
let randomCase;
let countdownInterval;
let inflectedWord;
let wordgroup = ["nouns"];

function recalcwordgroups() {
    wordgroup.length = 0;
    let a = document.getElementById("nouns");
    let b = document.getElementById("adjectives");
    let c = document.getElementById("verbs");
    if (a.checked == true) {
        wordgroup.push("nouns");
    }
    if (b.checked == true) {
        wordgroup.push("adjectives");
    }
    if (c.checked == true) {
        wordgroup.push("verbs");
    }
}

function playTick() {
    tickSound.currentTime = 0;
    tickSound.volume = 0.3;
    tickSound.play().catch(err => console.log("Hljóð ræstist ekki:", err));
}

function playBeep() {
    beepSound.currentTime = 0;
    beepSound.volume = 0.1;
    beepSound.play().catch(err => console.log("Hljóð ræstist ekki:", err));
}

function playAlarm() {
    alarmSound.currentTime = 0;
    alarmSound.volume = 0.3;
    alarmSound.play().catch(err => console.log("Hljóð ræstist ekki:", err));
}

let options = [""];
let colors = ["#000000"];

let numSegments = options.length;
let segmentAngle = (2 * Math.PI) / numSegments;
const radius = canvas.width / 2;

let currentRotation = 0;
let isSpinning = false;

async function getInflectedFormNoun(lemma, targetCase) {
    const url = 'https://bin.arnastofnun.is/api/ord/no/' + encodeURIComponent(lemma);

    try {
        const response = await fetch(url, {
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0 || !data[0].bmyndir) {
            return lemma;
        }

        const paradigm = data[0].bmyndir;

        const match = paradigm.find(item => {
            const tag = item.g || "";
            return tag.includes(targetCase);
        });

        return match ? match.b : lemma;

    } catch (error) {
        console.error("Error fetching from BÍN:", error);
        return lemma;
    }
}

async function getInflectedFormAdj(lemma, targetCase) {
    const url = 'https://bin.arnastofnun.is/api/ord/lo/' + encodeURIComponent(lemma);

    try {
        const response = await fetch(url, {
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0 || !data[0].bmyndir) {
            return lemma;
        }

        const paradigm = data[0].bmyndir;

        const match = paradigm.find(item => {
            const tag = item.g || "";
            return tag.includes(targetCase);
        });

        return match ? match.b : lemma;

    } catch (error) {
        console.error("Error fetching from BÍN:", error);
        return lemma;
    }
}

async function getInflectedFormVerb(lemma, targetCase) {
    const url = 'https://bin.arnastofnun.is/api/ord/so/' + encodeURIComponent(lemma);

    try {
        const response = await fetch(url, {
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0 || !data[0].bmyndir) {
            return lemma;
        }

        const paradigm = data[0].bmyndir;

        const match = paradigm.find(item => {
            const tag = item.g || "";
            return tag.includes(targetCase);
        });

        return match ? match.b : lemma;

    } catch (error) {
        console.error("Error fetching from BÍN:", error);
        return lemma;
    }
}

function loadnames() {
    let textarea = document.getElementById('names');
    let linesArray = textarea.value.split(/\r?\n/);
    linesArray = linesArray.filter(item => item !== "");
    options.length = 0;
    winningIndex = null;
    options = [...linesArray];
    colors.length = 0;
    for (let i = 0; i < options.length; i++) {
        let getRandomHexColor = '#' + Math.floor(Math.random() * 10777215).toString(16).padStart(6, '0');
        colors.push(getRandomHexColor);
    }
    numSegments = options.length;
    segmentAngle = (2 * Math.PI) / numSegments;
    drawWheel();
    spinBtn.disabled = false;
}

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(radius, radius);
    if (options.length > 1 & winningIndex !== null & reductBtn.checked == false) {
        options.splice(winningIndex,1);
        colors.splice(winningIndex,1);
        numSegments = options.length;
        segmentAngle = (2 * Math.PI) / numSegments;
    }
    for (let i = 0; i < numSegments; i++) {
        const angle = i * segmentAngle;

        // Draw the color slice path
        ctx.beginPath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, angle, angle + segmentAngle);
        ctx.closePath();
        ctx.fill();

        ctx.save();
        ctx.rotate(angle + segmentAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText(options[i], radius - 20, 5);
        ctx.restore();
    }

    ctx.translate(-radius, -radius);
}

function checkTick() {
    if (!isSpinning) return;
    const style = window.getComputedStyle(canvas);
    const matrix = style.transform;

    if (matrix !== 'none') {
        const values = matrix.split('(')[1].split(')')[0].split(',');
        const a = values[0];
        const b = values[1];

        // Breytir fylkinu í gráður (0 - 360)
        let angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
        if (angle < 0) angle += 360;

        const pointerAnglePosition = 270;
        let landingAngle = (pointerAnglePosition - angle) % 360;
        if (landingAngle < 0) landingAngle += 360;

        let currentSegmentIndex = Math.floor(landingAngle / (360 / numSegments));

        if (currentSegmentIndex !== lastSegmentIndex) {
            playTick();
            lastSegmentIndex = currentSegmentIndex;
        }
    }
    animationFrameId = requestAnimationFrame(checkTick);
}

function stoptimer() {
    clearInterval(countdownInterval);
    document.getElementById("seccounter").innerHTML = "Búið að svara";
    document.getElementById('correctanswer').innerHTML = `Rétt svar: <strong>${inflectedWord}</strong>`;
    spinBtn.disabled = false;
    listBtn.disabled = false;
    reductBtn.disabled = false;
    secspace.disabled = false;
    listspace.disabled = false;
}

function spinWheel() {
    drawWheel();
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;
    listBtn.disabled = true;
    reductBtn.disabled = true;
    secspace.disabled = true;
    listspace.disabled = true;
    const extraSpins = Math.floor(Math.random() * 360);
    const spinDegrees = (15 * 360) + extraSpins;

    currentRotation += spinDegrees;

    canvas.style.transform = `rotate(${currentRotation}deg)`;
    animationFrameId = requestAnimationFrame(checkTick);
}

function countsec() {
    clearInterval(countdownInterval);
    document.getElementById('correctanswer').innerHTML = "---";
    counterx = parseInt(document.getElementById("seconds").value);
    const counterDisplay = document.getElementById("seccounter");

    countdownInterval = setInterval(() => {
        counterx--;
        if (counterx > 1) {
            counterDisplay.innerHTML = counterx + " sekúndur eftir <span class='sekund'><button class='menubutton' id='stopp' onclick='stoptimer()'>Stopp</button></span>";
            playBeep();
        } else if (counterx === 1) {
            counterDisplay.innerHTML = counterx + " sekúnda eftir <span class='sekund'><button class='menubutton' id='stopp' onclick='stoptimer()'>Stopp</button></span>";
            playBeep();
        } else {
            counterDisplay.innerHTML = "Tíminn rann út!";
            clearInterval(countdownInterval);
            playAlarm();
            document.getElementById('correctanswer').innerHTML = `Rétt svar: <strong>${inflectedWord}</strong>`;
            spinBtn.disabled = false;
            listBtn.disabled = false;
            reductBtn.disabled = false;
            secspace.disabled = false;
            listspace.disabled = false;
        }
    }, 1000);

    if (counterx > 1) counterDisplay.innerHTML = counterx + " sekúndur eftir <span class='sekund'><button class='menubutton' id='stopp' onclick='stoptimer()'>Stopp</button></span>";
    else if (counterx === 1) counterDisplay.innerHTML = counterx + " sekúnda eftir <span class='sekund'><button class='menubutton' id='stopp' onclick='stoptimer()'>Stopp</button></span>";
}

async function handleSpinEnd() {
    isSpinning = false;

    const actualDegrees = currentRotation % 360;

    const pointerAnglePosition = 270;
    let landingAngle = (pointerAnglePosition - actualDegrees) % 360;
    if (landingAngle < 0) landingAngle += 360; // Keep values positive

    winningIndex = Math.floor(landingAngle / (360 / numSegments));

    const winnerName = options[winningIndex];

    // 1. Update the UI with the wheel winner immediately
    document.getElementById('selected').innerHTML = `Nemandi: <b>${winnerName}</b>`;
    let randomWordGroup = wordgroup[Math.floor(Math.random() * wordgroup.length)];
    if (randomWordGroup == "nouns") {
        quiznouns();
    } else if (randomWordGroup == "verbs") {
        quizverbs();
    } else if (randomWordGroup == "adjectives") {
        quizadjs();
    }
}

async function quiznouns() {
    randomLemma = lemmasnouns[Math.floor(Math.random() * lemmasnouns.length)];
    randomCase = casesnouns[Math.floor(Math.random() * casesnouns.length)];

    document.getElementById('wordquest').innerHTML += `<br><small>Sæki málfræðiform fyrir "${randomLemma}"...</small>`;

    inflectedWord = await getInflectedFormNoun(randomLemma, randomCase);

    const caseNames = { "ÞFET": "þf. et., án greinis", "ÞGFET": "þgf. et., án greinis", "EFET": "ef. et., án greinis", "NFETgr": "nf. et., með greini", "ÞFETgr": "þf. et., með greini", "ÞGFETgr": "þgf. et., með greini", "EFETgr": "ef. et., með greini", "NFFT": "nf. ft., án greinis", "ÞFFT": "þf. ft., án greinis", "ÞGFFT": "þgf. ft., án greinis", "EFFT": "ef. ft., án greinis", "NFFTgr": "nf. ft., með greini", "ÞFFTgr": "þf. ft., með greini", "ÞGFFTgr": "þgf. ft., með greini", "EFFTgr": "ef. ft., með greini" };

    document.getElementById('wordquest').innerHTML = `Beygðu nafnorðið <em>${randomLemma}</em><br>í <strong>${caseNames[randomCase]}</strong>`;
    countsec();
}


async function quizadjs() {
    randomLemma = lemmasadjs[Math.floor(Math.random() * lemmasadjs.length)];
    randomForm = adjforms[Math.floor(Math.random() * adjforms.length)];

    document.getElementById('wordquest').innerHTML += `<br><small>Sæki málfræðiform fyrir "${randomLemma}"...</small>`;

    inflectedWord = await getInflectedFormAdj(randomLemma, randomForm);

    const caseNames = { "FSB-KK-NFET" : "kk. et. nf., í sterkri beygingu", "FSB-KVK-NFET" : "kvk. et. nf., í sterkri beygingu", "FSB-HK-NFET" : "hk. et. nf., í sterkri beygingu", "FSB-KK-ÞFET" : "kk. et. þf., í sterkri beygingu", "FSB-KVK-ÞFET" : "kvk. et. þf., í sterkri beygingu", "FSB-HK-ÞFET" : "hk. et. þf., í sterkri beygingu","FSB-KK-ÞGFET" : "kk. et. þgf., í sterkri beygingu", "FSB-KVK-ÞGFET" : "kvk. et. þgf., í sterkri beygingu", "FSB-HK-ÞGFET" : "hk. et. þgf., í sterkri beygingu", "FSB-KK-EFET" : "kk. et. ef., í sterkri beygingu", "FSB-KVK-EFET" : "kvk. et. ef., í sterkri beygingu", "FSB-HK-EFET" : "hk. et. ef., í sterkri beygingu", "FSB-KK-NFFT" : "kk. ft. nf., í sterkri beygingu", "FSB-KVK-NFFT" : "kvk. ft. nf., í sterkri beygingu", "FSB-HK-NFFT" : "hk. ft. nf., í sterkri beygingu", "FSB-KK-ÞFFT" : "kk. ft. þf., í sterkri beygingu", "FSB-KVK-ÞFFT" : "kvk. ft. þf., í sterkri beygingu", "FSB-HK-ÞFFT" : "hk. ft. þf., í sterkri beygingu","FSB-KK-ÞGFFT" : "kk. ft. þgf., í sterkri beygingu", "FSB-KVK-ÞGFFT" : "kvk. ft. þgf., í sterkri beygingu", "FSB-HK-ÞGFFT" : "hk. ft. þgf., í sterkri beygingu", "FSB-KK-EFFT" : "kk. ft. ef., í sterkri beygingu", "FSB-KVK-EFFT" : "kvk. ft. ef., í sterkri beygingu", "FSB-HK-EFFT" : "hk. ft. ef., í sterkri beygingu", "FVB-KK-NFET" : "kk. et. nf., í veikri beygingu", "FVB-KVK-NFET" : "kvk. et. nf., í veikri beygingu", "FVB-HK-NFET" : "hk. et. nf., í veikri beygingu", "FVB-KK-ÞFET" : "kk. et. þf., í veikri beygingu", "FVB-KVK-ÞFET" : "kvk. et. þf., í veikri beygingu", "FVB-HK-ÞFET" : "hk. et. þf., í veikri beygingu","FVB-KK-ÞGFET" : "kk. et. þgf., í veikri beygingu", "FVB-KVK-ÞGFET" : "kvk. et. þgf., í veikri beygingu", "FVB-HK-ÞGFET" : "hk. et. þgf., í veikri beygingu", "FVB-KK-EFET" : "kk. et. ef., í veikri beygingu", "FVB-KVK-EFET" : "kvk. et. ef., í veikri beygingu", "FVB-HK-EFET" : "hk. et. ef., í veikri beygingu", "FVB-KK-NFFT" : "kk. ft. nf., í veikri beygingu", "FVB-KVK-NFFT" : "kvk. ft. nf., í veikri beygingu", "FVB-HK-NFFT" : "hk. ft. nf., í veikri beygingu", "FVB-KK-ÞFFT" : "kk. ft. þf., í veikri beygingu", "FVB-KVK-ÞFFT" : "kvk. ft. þf., í veikri beygingu", "FVB-HK-ÞFFT" : "hk. ft. þf., í veikri beygingu","FVB-KK-ÞGFFT" : "kk. ft. þgf., í veikri beygingu", "FVB-KVK-ÞGFFT" : "kvk. ft. þgf., í veikri beygingu", "FVB-HK-ÞGFFT" : "hk. ft. þgf., í veikri beygingu", "FVB-KK-EFFT" : "kk. ft. ef., í veikri beygingu", "FVB-KVK-EFFT" : "kvk. ft. ef., í veikri beygingu", "FVB-HK-EFFT" : "hk. ft. ef., í veikri beygingu" };

    document.getElementById('wordquest').innerHTML = `Beygðu lýsingarorðið <em>${randomLemma}</em><br>í <strong>${caseNames[randomForm]}</strong>`;
    countsec();
}

async function quizverbs() {
    randomLemma = lemmasverbs[Math.floor(Math.random() * lemmasverbs.length)];
    randomForm = verbforms[Math.floor(Math.random() * verbforms.length)];

    document.getElementById('wordquest').innerHTML += `<br><small>Sæki málfræðiform fyrir "${randomLemma}"...</small>`;

    inflectedWord = await getInflectedFormVerb(randomLemma, randomForm);

    const caseNames = { "GM-FH-NT-1P-ET": "ég + nútíð", "GM-FH-NT-2P-ET": "þú + nútíð", "GM-FH-NT-3P-ET": "hann/hún/það + nútíð", "GM-FH-NT-1P-FT": "við + nútíð", "GM-FH-NT-2P-FT": "þið + nútíð", "GM-FH-NT-3P-FT": "þeir/þær/þau + nútíð", "GM-FH-ÞT-1P-ET": "ég + þátíð", "GM-FH-ÞT-2P-ET": "þú + þátíð", "GM-FH-ÞT-3P-ET": "hann/hún/það + þátíð", "GM-FH-ÞT-1P-FT": "við + þátíð", "GM-FH-ÞT-2P-FT": "þið + þátíð", "GM-FH-ÞT-3P-FT": "þeir/þær/þau + þátíð" };

    document.getElementById('wordquest').innerHTML = `Beygðu sögnina <em>${randomLemma}</em><br><strong>${caseNames[randomForm]}</strong>`;
    countsec();
}

function activeAbt() {
   document.getElementById("game1").style.display = "none";
   document.getElementById("game2").style.display = "none";
   document.getElementById("abt").style.display = "block";
   document.getElementById("descr").style.display = "none";
}

function activeDescr() {
    document.getElementById("game1").style.display = "none";
   document.getElementById("game2").style.display = "none";
    document.getElementById("abt").style.display = "none";
    document.getElementById("descr").style.display = "block";
}

function activeGame() {
    document.getElementById("game1").style.display = "flex";
   document.getElementById("game2").style.display = "flex";
    document.getElementById("abt").style.display = "none";
    document.getElementById("descr").style.display = "none";
}

drawWheel();
spinBtn.addEventListener("click", spinWheel);
canvas.addEventListener("transitionend", handleSpinEnd);
