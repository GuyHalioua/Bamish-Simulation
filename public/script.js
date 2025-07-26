const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const role = urlParams.get('role');

// Elements
let numberEl = document.getElementById('number');
let inputEl = document.getElementById('numInput');
let controls = document.getElementById('controls');

let numberEl2 = document.getElementById('number2');
let inputEl2 = document.getElementById('numInput2');
let controls2 = document.getElementById('controls2');

let numberEl3 = document.getElementById('number3');
let inputEl3 = document.getElementById('numInput3');
let controls3 = document.getElementById('controls3');

let numberEl4 = document.getElementById('number4');
let inputEl4 = document.getElementById('numInput4');
let controls4 = document.getElementById('controls4');

// Master or Slave
const isMaster = (role === 'master');

if (isMaster) {
    controls.style.display = 'flex';
    controls2.style.display = 'flex';
    controls3.style.display = 'flex';
    controls4.style.display = 'flex';
} else {
    document.getElementById('fullscreenBtn').style.display = 'block';
}

// Number 1
function changeNumber(delta) {
    let newVal = parseInt(inputEl.value || 0) + delta;
    inputEl.value = newVal;
    updateNumber(newVal);
}

function updateNumber(val) {
    if (val !== 0) {
        numberEl.textContent = val; // Show the value
    } else {
        numberEl.textContent = "?"; // Show "?" if the value is 0
    }

    if (isMaster) socket.emit('update-data', getAllValues());
}

// Number 2
function changeNumber2(delta) {
    let newVal = parseInt(inputEl2.value || 0) + delta;
    inputEl2.value = newVal;
    updateNumber2(newVal);
}

function updateNumber2(val) {
    if (val !== 0) {
        numberEl2.textContent = val; // Show the value
    } else {
        numberEl2.textContent = "?"; // Show "?" if the value is 0
    }

    if (isMaster) socket.emit('update-data', getAllValues());
}

// Number 3
function changeNumber3(delta) {
    let newVal = parseInt(inputEl3.value || 0) + delta;
    inputEl3.value = newVal;
    updateNumber3(newVal);
}

function updateNumber3(val) {
    if (val !== 0) {
        numberEl3.textContent = val; // Show the value
    } else {
        numberEl3.textContent = "?"; // Show "?" if the value is 0
    }

    if (isMaster) socket.emit('update-data', getAllValues());
}

// Number 4
function changeNumber4(delta) {
    let newVal = parseInt(inputEl4.value || 0) + delta;
    inputEl4.value = newVal;
    updateNumber4(newVal);
}

function updateNumber4(val) {
    if (val !== 0) {
        numberEl4.textContent = val; // Show the value
    } else {
        numberEl4.textContent = "?"; // Show "?" if the value is 0
    }

    if (isMaster) socket.emit('update-data', getAllValues());
}

// Reset buttons (only display "?" without changing input)
document.getElementById('resetNumber').addEventListener('click', () => {
    numberEl.textContent = "?";  // Reset display to "?"
    socket.emit('update-data', getAllValues());
});

document.getElementById('resetNumber2').addEventListener('click', () => {
    numberEl2.textContent = "?";  // Reset display to "?"
    socket.emit('update-data', getAllValues());
});

document.getElementById('resetNumber3').addEventListener('click', () => {
    numberEl3.textContent = "?";  // Reset display to "?"
    socket.emit('update-data', getAllValues());
});

document.getElementById('resetNumber4').addEventListener('click', () => {
    numberEl4.textContent = "?";  // Reset display to "?"
    socket.emit('update-data', getAllValues());
});

// Fullscreen toggle
function triggerFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Fullscreen button event
document.getElementById('fullscreenBtn').addEventListener('click', triggerFullscreen);

// Get all values (if value is "?")
function getAllValues() {
    return {
        number: numberEl.textContent === "?" ? "?" : parseInt(inputEl.value || 0),
        number2: numberEl2.textContent === "?" ? "?" : parseInt(inputEl2.value || 0),
        number3: numberEl3.textContent === "?" ? "?" : parseInt(inputEl3.value || 0),
        number4: numberEl4.textContent === "?" ? "?" : parseInt(inputEl4.value || 0)
    };
}

// Sync from server
socket.on('sync-data', (data) => {
    // Master sends "?" when reset
    numberEl.textContent = data.number === "?" ? "?" : data.number;
    inputEl.value = data.number !== "?" ? data.number : inputEl.value;

    numberEl2.textContent = data.number2 === "?" ? "?" : data.number2;
    inputEl2.value = data.number2 !== "?" ? data.number2 : inputEl2.value;

    numberEl3.textContent = data.number3 === "?" ? "?" : data.number3;
    inputEl3.value = data.number3 !== "?" ? data.number3 : inputEl3.value;

    numberEl4.textContent = data.number4 === "?" ? "?" : data.number4;
    inputEl4.value = data.number4 !== "?" ? data.number4 : inputEl4.value;
});


//Timer

let timerInterval = null;
let totalSeconds = 0;
let isRunning = false;
const timerDisplay = document.getElementById('timer-display');
const startStopBtn = document.getElementById('startStopBtn');

function updateTimerDisplay() {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function runTimer() {
  timerInterval = setInterval(() => {
    totalSeconds++;
    updateTimerDisplay();
  }, 1000);
}

function toggleTimer() {
  if (!isRunning) {
    isRunning = true;
    startStopBtn.textContent = "Stop";
    startStopBtn.classList.add("active");
    socket.emit('timer-control', { action: 'start', time: totalSeconds });
    runTimer();
  } else {
    isRunning = false;
    startStopBtn.textContent = "Start";
    startStopBtn.classList.remove("active");
    clearInterval(timerInterval);
    socket.emit('timer-control', { action: 'stop', time: totalSeconds });
  }
}

function resetTimer() {
  isRunning = false;
  totalSeconds = 0;
  clearInterval(timerInterval);
  startStopBtn.textContent = "Start";
  startStopBtn.classList.remove("active");
  updateTimerDisplay();
  socket.emit('timer-control', { action: 'reset' });
}

socket.on('timer-control', (data) => {
  totalSeconds = data.time || 0;
  updateTimerDisplay();

  if (data.action === 'start') {
    if (!isRunning) {
      isRunning = true;
      startStopBtn.textContent = "Stop";
      startStopBtn.classList.add("active");
      runTimer();
    }
  } else if (data.action === 'stop') {
    isRunning = false;
    clearInterval(timerInterval);
    startStopBtn.textContent = "Start";
    startStopBtn.classList.remove("active");
  } else if (data.action === 'reset') {
    isRunning = false;
    totalSeconds = 0;
    clearInterval(timerInterval);
    updateTimerDisplay();
    startStopBtn.textContent = "Start";
    startStopBtn.classList.remove("active");
  }
});


// Manual input (for master)
if (isMaster) {
    inputEl.addEventListener('change', () => updateNumber(parseInt(inputEl.value || 0)));
    inputEl2.addEventListener('change', () => updateNumber2(parseInt(inputEl2.value || 0)));
    inputEl3.addEventListener('change', () => updateNumber3(parseInt(inputEl3.value || 0)));
    inputEl4.addEventListener('change', () => updateNumber4(parseInt(inputEl4.value || 0)));
}
