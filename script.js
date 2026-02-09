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

// Initialize floating hearts
createFloatingHearts();

// Make question box relative for absolute positioning of No button
document.querySelector('.question-box').style.position = 'relative';
document.querySelector('.question-box').style.minHeight = '250px';
