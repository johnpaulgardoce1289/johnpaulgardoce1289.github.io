// Floating hearts background
function createFloatingHearts() {
    const container = document.getElementById('heartsContainer');
    const heartSymbols = ['❤️', '💕', '💖', '💗', '💓', '💝'];
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
        heart.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 10000);
    }, 300);
}

// Local Storage Functions for Tracking
function initializeTracking() {
    if (!localStorage.getItem('valentineData')) {
        localStorage.setItem('valentineData', JSON.stringify({
            visits: 0,
            yesCount: 0,
            noAttempts: 0,
            responses: []
        }));
    }
    
    // Increment visit count
    const data = JSON.parse(localStorage.getItem('valentineData'));
    data.visits++;
    localStorage.setItem('valentineData', JSON.stringify(data));
}

function trackResponse(response) {
    const data = JSON.parse(localStorage.getItem('valentineData'));
    
    const timestamp = new Date().toLocaleString();
    const entry = {
        response: response,
        timestamp: timestamp,
        userAgent: navigator.userAgent.substring(0, 50) // First 50 chars of browser info
    };
    
    if (response === 'yes') {
        data.yesCount++;
    } else {
        data.noAttempts++;
    }
    
    data.responses.unshift(entry); // Add to beginning of array
    
    // Keep only last 50 responses
    if (data.responses.length > 50) {
        data.responses = data.responses.slice(0, 50);
    }
    
    localStorage.setItem('valentineData', JSON.stringify(data));
}

function updateAdminPanel() {
    const data = JSON.parse(localStorage.getItem('valentineData'));
    
    document.getElementById('visitCount').textContent = data.visits;
    document.getElementById('yesCount').textContent = data.yesCount;
    document.getElementById('noAttempts').textContent = data.noAttempts;
    
    const logContainer = document.getElementById('logEntries');
    
    if (data.responses.length === 0) {
        logContainer.innerHTML = '<p style="color: rgba(255,255,255,0.5);">No responses yet...</p>';
    } else {
        logContainer.innerHTML = data.responses.map(entry => {
            const entryClass = entry.response === 'yes' ? 'yes-entry' : 'no-entry';
            const emoji = entry.response === 'yes' ? '💖' : '😅';
            const responseText = entry.response === 'yes' ? 'Said YES!' : 'Tried to say No';
            
            return `
                <div class="log-entry ${entryClass}">
                    <strong>${emoji} ${responseText}</strong>
                    <div class="log-timestamp">${entry.timestamp}</div>
                </div>
            `;
        }).join('');
    }
}

// Check for admin mode
function checkAdminMode() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
        document.getElementById('adminPanel').classList.add('show');
        updateAdminPanel();
    }
}

// No button moves away
let noButtonClicks = 0;
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('closeBtn');
const response = document.getElementById('response');

noBtn.addEventListener('mouseenter', () => {
    const container = document.querySelector('.question-box');
    const containerRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    
    // Random position within container
    const maxX = containerRect.width - btnRect.width - 40;
    const maxY = containerRect.height - btnRect.height - 40;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    noBtn.style.position = 'absolute';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    noBtn.style.transition = 'all 0.3s ease';
    
    noButtonClicks++;
    
    // Track "No" attempt
    trackResponse('no');
    
    // Increase Yes button size
    const newSize = 1 + (noButtonClicks * 0.1);
    yesBtn.style.transform = `scale(${newSize})`;
    
    // Show encouraging message
    const messages = [
        "Are you sure? 🥺",
        "Think again! 💭",
        "Really? Give it another thought! 💕",
        "The Yes button is looking better, right? 😊",
        "Come on, you know you want to say yes! 💖"
    ];
    
    if (noButtonClicks <= messages.length) {
        response.textContent = messages[noButtonClicks - 1];
        response.classList.add('show');
    }
});

// Yes button creates celebration
yesBtn.addEventListener('click', () => {
    // Track "Yes" response
    trackResponse('yes');
    
    // Create confetti
    createConfetti();
    
    // Show modal after short delay
    setTimeout(() => {
        modal.classList.add('show');
    }, 500);
    
    // Hide response message
    response.classList.remove('show');
});

// Close modal
closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
});

// Click outside modal to close
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

// Admin Panel Controls
document.getElementById('closeAdminBtn').addEventListener('click', () => {
    document.getElementById('adminPanel').classList.remove('show');
});

document.getElementById('clearBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone!')) {
        localStorage.removeItem('valentineData');
        initializeTracking();
        updateAdminPanel();
        alert('All data has been cleared!');
    }
});

// Confetti animation
function createConfetti() {
    const colors = ['#ff1744', '#ff4081', '#ffd6e0', '#ff5177', '#ffb3c1'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.opacity = Math.random();
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 20);
    }
}

// Initialize everything
initializeTracking();
createFloatingHearts();
checkAdminMode();

// Make question box relative for absolute positioning of No button
document.querySelector('.question-box').style.position = 'relative';
document.querySelector('.question-box').style.minHeight = '250px';
