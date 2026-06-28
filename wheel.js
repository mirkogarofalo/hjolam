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

// 1. Array of lemmas you want to use
const lemmas = ["hestur", "kona", "bók", "barn", "maður", "skóli", "umsókn", "tré", "hundur", "skór", "stærð", "hurð", "hús", "pabbi", "mamma", "móðir", "faðir", "sonur", "dóttir", "mál", "safi", "bolur", "hlekkur", "hnykkur", "vöxtur", "fjall", "vist", "lest", "list", "kirkja", "mynd", "bíómynd", "stund", "tími", "tæki", "bjór", "æfing", "lýsing", "frændi", "frænka", "bolti", "hilla", "læknir", "hitamælir", "hjól", "blómapottur", "sófi", "strákur", "stelpa", "ferðataska", "vörn"];

// 2. Array of cases to pick from randomly
const cases = ["ÞFET", "ÞGFET", "EFET", "NFETgr", "ÞFETgr", "ÞGFETgr", "EFETgr", "NFFT", "ÞFFT", "ÞGFFT", "EFFT", "NFFTgr", "ÞFFTgr", "ÞGFFTgr", "EFFTgr"];

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

function playTick() {
    tickSound.currentTime = 0;
    tickSound.play().catch(err => console.log("Hljóð ræstist ekki:", err));
}

function playBeep() {
    beepSound.currentTime = 0;
    beepSound.play().catch(err => console.log("Hljóð ræstist ekki:", err));
}

function playAlarm() {
    alarmSound.currentTime = 0;
    alarmSound.play().catch(err => console.log("Hljóð ræstist ekki:", err));
}

let options = [""];
let colors = ["#000000"];

let numSegments = options.length;
let segmentAngle = (2 * Math.PI) / numSegments;
const radius = canvas.width / 2;

let currentRotation = 0;
let isSpinning = false;

async function getInflectedForm(lemma, targetCase) {
    // encodeURIComponent is required for lemmas like "bók" or "maður"
    const url = 'https://bin.arnastofnun.is/api/ord/' + encodeURIComponent(lemma);

    try {
        const response = await fetch(url, {
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();

        // BÍN returns an array of matching word objects.
        // We take the first match and its 'beyging' (inflection) array.
        if (!Array.isArray(data) || data.length === 0 || !data[0].bmyndir) {
            return lemma;
        }

        const paradigm = data[0].bmyndir;

        // Search the paradigm for the correct tag
        // item.g contains strings like "KK-NFET", "NFET", or "NFETgr"
        const match = paradigm.find(item => {
            const tag = item.g || "";
            return tag.includes(targetCase);
        });

        // 'b' is the property containing the actual inflected word string
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
        let getRandomHexColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
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
    counterx = 0;
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
    const spinDegrees = (6 * 360) + extraSpins;

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
            counterDisplay.innerHTML = counterx + " sekúndur eftir <button id='stopp' onclick='stoptimer()'>Stopp</button>";
            playBeep();
        } else if (counterx === 1) {
            counterDisplay.innerHTML = counterx + " sekúnda eftir <button id='stopp' onclick='stoptimer()'>Stopp</button>";
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

    if (counterx > 1) counterDisplay.innerHTML = counterx + " sekúndur <button id='stopp' onclick='stoptimer()'>Stopp</button>";
    else if (counterx === 1) counterDisplay.innerHTML = counterx + " sekúnda <button id='stopp' onclick='stoptimer()'>Stopp</button>";
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

    // 2. Select a random lemma and case from your arrays
    randomLemma = lemmas[Math.floor(Math.random() * lemmas.length)];
    randomCase = cases[Math.floor(Math.random() * cases.length)];

    // Show a loading text while querying the API
    document.getElementById('wordquest').innerHTML += `<br><small>Sæki málfræðiform fyrir "${randomLemma}"...</small>`;

    // 3. Fetch the specific inflected form from BÍN
    inflectedWord = await getInflectedForm(randomLemma, randomCase);

    // Map the tag back to a friendly display string for the user
    const caseNames = { "ÞFET": "þolfalli eintölu, án greinis", "ÞGFET": "þágufalli eintölu, án greinis", "EFET": "eignarfalli eintölu, án greinis", "NFETgr": "nefnifalli eintölu, með greini", "ÞFETgr": "þolfalli eintölu, með greini", "ÞGFETgr": "þágufalli eintölu, með greini", "EFETgr": "eignarfalli eintölu, með greini", "NFFT": "nefnifalli fleirtölu, án greinis", "ÞFFT": "þolfalli fleirtölu, án greinis", "ÞGFFT": "þágufalli fleirtölu, án greinis", "EFFT": "eignarfalli fleirtölu, án greinis", "NFFTgr": "nefnifalli fleirtölu, með greini", "ÞFFTgr": "þolfalli fleirtölu, með greini", "ÞGFFTgr": "þágufalli fleirtölu, með greini", "EFFTgr": "eignarfalli fleirtölu, með greini" };

    // 4. Update the final UI text output
    document.getElementById('wordquest').innerHTML = `Beygðu nafnorðið <em>${randomLemma}</em><br>í <strong>${caseNames[randomCase]}</strong>`;
    countsec();
}

drawWheel();
spinBtn.addEventListener("click", spinWheel);
canvas.addEventListener("transitionend", handleSpinEnd);
