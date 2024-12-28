let timer;
let timeLeft;
let isRunning = false;

// Audio elements
const sounds = {
    rain: new Audio('sounds/rain.wav'),
    waves: new Audio('sounds/waves.wav'),
    forest: new Audio('sounds/forest.wav')
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const soundButtons = document.querySelectorAll('[data-sound]');

    startBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    // Sound button event listeners
    soundButtons.forEach(button => {
        button.addEventListener('click', () => playSound(button.dataset.sound));
    });
});

// Timer functions
function toggleTimer() {
    const startBtn = document.getElementById('start-btn');
    
    if (!isRunning) {
        startTimer();
        startBtn.textContent = 'Pause';
    } else {
        pauseTimer();
        startBtn.textContent = 'Resume';
    }
    
    isRunning = !isRunning;
}

function startTimer() {
    if (!timeLeft) {
        timeLeft = 5 * 60; // 5 minutes in seconds
    }
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            isRunning = false;
            document.getElementById('start-btn').textContent = 'Start Session';
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    // 모든 사운드 정지
    Object.values(sounds).forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 5 * 60;
    isRunning = false;
    document.getElementById('start-btn').textContent = 'Start Session';
    updateTimerDisplay();
    
    // 모든 사운드 정지
    Object.values(sounds).forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Sound functions
function playSound(soundName) {
    // Stop all sounds first
    Object.values(sounds).forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });
    
    // Play selected sound
    if (sounds[soundName].paused) {
        sounds[soundName].loop = true;
        sounds[soundName].play();
    }
}

// Breathing animation
function updateBreathingText() {
    const breathingText = document.querySelector('.breathing-text');
    let phase = 'in';
    
    setInterval(() => {
        if (phase === 'in') {
            breathingText.textContent = 'Breathe Out';
            phase = 'out';
        } else {
            breathingText.textContent = 'Breathe In';
            phase = 'in';
        }
    }, 6000);
}

updateBreathingText(); 
