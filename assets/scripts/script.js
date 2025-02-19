let blinkState = false;

function updateTitle() {
  const now = new Date();
  const minutes = now.getMinutes();

  // Alarm logic
  if (minutes === 58 && window.alarmActive) {
    document.title = blinkState ? "🚨 CAMERA TIME! 🚨" : now.toLocaleTimeString();
    blinkState = !blinkState; // Toggle the state
  }
  // Break time logic
  else if (minutes === 50 && !window.breakAlarmActive) {
    document.title = blinkState ? "🦥 Break Time!" : now.toLocaleTimeString();
    blinkState = !blinkState;
    
    // startBreakAlarm();
  }
  // Default title (for any other minute)
  else {
    document.title = now.toLocaleTimeString();
  }
}

// Create and manage the alarm sound
function setupAlarmSound() {
  if (!window.alarmAudio) {
    window.alarmAudio = new Audio();
    window.alarmAudio.src = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';
    window.alarmAudio.loop = true; // Make the sound repeat
  }
}
// // add breaktime alarm
// function setupBreakAlarmSound() {
//   if (!window.breakAlarmAudio) {
//     window.breakAlarmAudio = new Audio('../assets/audio/breaktime-alert.wav');
//     // console.log('breakalarm audio set up');
//     window.breakAlarmAudio.loop = true; 
//   }
// }

// // ✅ Start the break alarm (only once per minute)
// // function startBreakAlarm() {
//   if (!window.breakAlarmActive) {
//     setupBreakAlarmSound(); 
//     window.breakAlarmActive = true;
    
//     window.breakAlarmAudio.play().catch(error => console.log("Break alarm error:", error));
    
//     // Stop the break alarm after 2 seconds
//     setTimeout(() => {
//       stopBreakAlarm();
//     }, 2000); // Stops the break alarm after 2 seconds
//   }
// }
// function stopBreakAlarm() {
//   if (window.breakAlarmAudio) {
//     window.breakAlarmAudio.pause();
//     window.breakAlarmAudio.currentTime = 0; // Reset audio to the beginning
//   }
//   window.breakAlarmActive = false; // Mark the break alarm as inactive
// }

function startAlarm() {
  setupAlarmSound();
  window.alarmActive = true;
  window.alarmAudio.play()
    .catch(error => console.log('Audio playback error:', error));
  
  // Show the stop button
  const stopButton = document.getElementById('stopAlarmButton');
  stopButton.style.display = 'block';
  
  // Show notification
  document.getElementById('notification').style.display = 'block';
  
  // Add flashing effect to the entire page
  document.body.classList.add('alarm-active');
  
  // Browser notification
  if (Notification.permission === "granted") {
    new Notification("Camera Reminder", {
      body: "Time to turn on your camera!",
    });
  }
}

function stopAlarm() {
  if (window.alarmAudio) {
    window.alarmAudio.pause();
    window.alarmAudio.currentTime = 0; // Reset audio to beginning
  }
  
  window.alarmActive = false;
  window.manualStop = true; // Set manual stop flag when user stops alarm
  
  // Hide the stop button
  const stopButton = document.getElementById('stopAlarmButton');
  stopButton.style.display = 'none';
  
  // Hide notification
  document.getElementById('notification').style.display = 'none';
  
  // Remove flashing effect
  document.body.classList.remove('alarm-active');
}

function updateClock() {
  const now = new Date();
  const clock = document.getElementById('clock');
  const minutes = now.getMinutes();
  clock.textContent = now.toLocaleTimeString();
  
  // Check if it's 58 minutes
  if (minutes === 50 && !window.breakAlarmActive) {
    startBreakAlarm();
  } else if (minutes === 58) {
    // Start alarm if not already active and not manually stopped
    if (!window.alarmActive && !window.manualStop) {
      startAlarm();
    }
   else {
    // Auto-stop if the minute changes, but only if the user hasn't manually stopped
    if (window.alarmActive && !window.manualStop) {
      stopAlarm();
    }
    // Reset the manual stop flag when we're no longer at minute 58
    if (minutes !== 58) {
      window.manualStop = false;
    }
  }
  }
}

function createStopButton() {
  // Create stop button if it doesn't exist
  if (!document.getElementById('stopAlarmButton')) {
    const stopButton = document.createElement('button');
    stopButton.id = 'stopAlarmButton';
    stopButton.textContent = 'Stop Alarm';
    stopButton.classList.add('stop-alarm-button');
    stopButton.style.display = 'none'; // Initially hidden
    
    stopButton.addEventListener('click', () => {
      stopAlarm();
    });
    
    document.body.appendChild(stopButton);
  }
}



const body = document.body;
const themeToggle = document.getElementById('themeToggle');

// Load theme from storage
const savedTheme = localStorage.getItem('theme') || 'light-mode';
body.classList.add(savedTheme);
themeToggle.textContent = savedTheme === 'dark-mode' ? '🌙' : '☀️';

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDarkMode = body.classList.contains('dark-mode');
    if (isDarkMode) {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      themeToggle.textContent = '☀️';
      localStorage.setItem('theme', 'light-mode');
    } else {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
      themeToggle.textContent = '🌙';
      localStorage.setItem('theme', 'dark-mode');
    }
  });
}

// Request notification permission
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

// Initialize
window.alarmActive = false;
window.manualStop = false;
window.breakAlarmActive = false; 
createStopButton();
setupAlarmSound();
setupBreakAlarmSound();

// Update every second
setInterval(() => {
  updateClock();
  updateTitle();
}, 1000);

// Initial update
updateClock();
updateTitle();