let timer;
let timeLeft;
let isRunning = false;
let currentSound = null;  // 현재 재생 중인 사운드 추적

// Audio context 추가
let audioContext;

// Audio elements
const sounds = {
    rain: new Audio('sounds/rain.wav'),
    waves: new Audio('sounds/waves.wav'),
    forest: new Audio('sounds/forest.wav')
};

// 오디오 객체들 초기화
Object.values(sounds).forEach(sound => {
    sound.addEventListener('error', (e) => {
        console.error('Error loading sound:', e);
    });
});

// 오디오 초기화 함수
async function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        await audioContext.resume();
    } catch (error) {
        console.error('Error initializing audio:', error);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const soundButtons = document.querySelectorAll('[data-sound]');

    // 페이지 클릭 시 오디오 초기화
    document.addEventListener('click', async () => {
        if (!audioContext) {
            await initAudio();
        }
    }, { once: true });

    startBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    // Sound button event listeners
    soundButtons.forEach(button => {
        button.addEventListener('click', async () => {
            try {
                await playSound(button.dataset.sound);
            } catch (error) {
                console.error('Error playing sound:', error);
            }
        });
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
    try {
        Object.values(sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
        currentSound = null;
    } catch (error) {
        console.error('Error pausing sounds:', error);
    }
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 5 * 60;
    isRunning = false;
    document.getElementById('start-btn').textContent = 'Start Session';
    updateTimerDisplay();
    
    // 모든 사운드 정지
    try {
        Object.values(sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
        currentSound = null;
    } catch (error) {
        console.error('Error resetting sounds:', error);
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Sound functions
async function playSound(soundName) {
    try {
        // 오디오 컨텍스트가 없으면 초기화
        if (!audioContext) {
            await initAudio();
        }

        // 이전 사운드 정지
        if (currentSound) {
            try {
                await currentSound.pause();
                currentSound.currentTime = 0;
            } catch (error) {
                console.error('Error stopping current sound:', error);
            }
        }

        // 새 사운드 재생
        const sound = sounds[soundName];
        if (sound) {
            try {
                sound.loop = true;
                await sound.play();
                currentSound = sound;
            } catch (error) {
                if (error.name === 'NotAllowedError') {
                    console.log('Please interact with the page first');
                    // 사용자에게 알림을 표시할 수 있습니다
                } else {
                    console.error('Error playing sound:', error);
                }
            }
        }
    } catch (error) {
        console.error('Error in playSound:', error);
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

// Service Worker 등록
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
} 
