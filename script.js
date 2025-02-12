function updateTitle() {
  const now = new Date();
  document.title = now.toLocaleTimeString();
}

function updateClock() {
  const now = new Date();
  const clock = document.getElementById('clock');
  clock.textContent = now.toLocaleTimeString();
  
  if (now.getMinutes() === 57) {
    document.getElementById('notification').style.display = 'block';
    
    if (Notification.permission === "granted") {
      new Notification("Camera Reminder", {
        body: "Time to turn on your camera!",
        // icon: "/api/placeholder/64/64"
      });
    }
  } else {
    document.getElementById('notification').style.display = 'none';
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

// Update every second
setInterval(() => {
  updateClock();
  updateTitle();
}, 1000);

// Initial update
updateClock();
updateTitle();