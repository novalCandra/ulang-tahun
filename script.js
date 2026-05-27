document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const loadingScreen = document.getElementById('loading-screen');
    const nameSection = document.getElementById('name-section');
    const gameSection = document.getElementById('game-section');
    const revealSection = document.getElementById('reveal-section');
    
    const nameInput = document.getElementById('name-input');
    const startBtn = document.getElementById('start-btn');
    const userNames = document.querySelectorAll('.user-name');
    
    const gameArea = document.getElementById('game-area');
    const scoreBar = document.getElementById('score-bar');
    const scoreText = document.getElementById('score-text');
    // --- State ---
    let userName = '';
    let score = 0;
    const targetScore = 10;
    let gameInterval;

    // --- Loading Screen ---
    setTimeout(() => {
        switchSection(loadingScreen, nameSection);
    }, 1500);

    // --- Name Input ---
    startBtn.addEventListener('click', startGameFlow);
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') startGameFlow();
    });

    function startGameFlow() {
        userName = nameInput.value.trim() || 'Beautiful';
        
        // Update name everywhere
        userNames.forEach(el => el.textContent = userName);


        switchSection(nameSection, gameSection);
        setTimeout(startGame, 800);
    }

    // --- Game Logic ---
    function startGame() {
        score = 0;
        updateScore();
        
        // Spawn stars every 600ms
        gameInterval = setInterval(spawnStar, 600);
    }

    function spawnStar() {
        const star = document.createElement('div');
        star.classList.add('star');
        // Random star emoji
        const stars = ['⭐', '🌟', '✨', '🎉', '🎁'];
        star.textContent = stars[Math.floor(Math.random() * stars.length)];
        
        // Random horizontal position (10% to 90%)
        const randomX = Math.floor(Math.random() * 80) + 10;
        star.style.left = `${randomX}%`;
        
        // Random fall duration between 3s and 5s
        const duration = Math.random() * 2 + 3;
        star.style.animationDuration = `${duration}s`;
        
        gameArea.appendChild(star);
        
        // Handle click
        star.addEventListener('mousedown', () => catchStar(star));
        star.addEventListener('touchstart', (e) => {
            e.preventDefault();
            catchStar(star);
        });
        
        // Remove after animation completes
        setTimeout(() => {
            if (star.parentNode) {
                star.parentNode.removeChild(star);
            }
        }, duration * 1000);
    }

    function catchStar(star) {
        if (score >= targetScore) return;
        
        // Show +1 effect
        const rect = star.getBoundingClientRect();
        const effect = document.createElement('div');
        effect.classList.add('catch-effect');
        effect.textContent = '+1';
        effect.style.left = `${rect.left}px`;
        effect.style.top = `${rect.top}px`;
        document.body.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) effect.parentNode.removeChild(effect);
        }, 800);
        
        // Remove star
        if (star.parentNode) {
            star.parentNode.removeChild(star);
        }
        
        // Update score
        score++;
        updateScore();
        
        if (score >= targetScore) {
            endGame();
        }
    }

    function updateScore() {
        scoreText.textContent = `${score} / ${targetScore}`;
        scoreBar.style.width = `${(score / targetScore) * 100}%`;
    }

    function endGame() {
        clearInterval(gameInterval);
        
        // Clear remaining stars
        gameArea.innerHTML = '';
        
        setTimeout(() => {
            switchSection(gameSection, revealSection);
            triggerRevealEffects();
        }, 500);
    }

    // --- Reveal Effects ---
    function triggerRevealEffects() {
        // 1. Confetti
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ffb7b2', '#e2f0cb', '#ffdac1', '#ffd700']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ffb7b2', '#e2f0cb', '#ffdac1', '#ffd700']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
        
        // 2. Floating Hearts
        setInterval(spawnHeart, 300);
    }
    
    function spawnHeart() {
        const heartsContainer = document.getElementById('hearts-container');
        if (!heartsContainer) return;
        
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        const hearts = ['💖', '💕', '💗', '💓', '🌸'];
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        
        // Random horizontal position
        heart.style.left = `${Math.floor(Math.random() * 100)}%`;
        
        // Random fall duration between 4s and 8s
        const duration = Math.random() * 4 + 4;
        heart.style.animationDuration = `${duration}s`;
        
        // Random size
        const size = Math.random() * 1 + 1; // 1rem to 2rem
        heart.style.fontSize = `${size}rem`;
        
        heartsContainer.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, duration * 1000);
    }

    // --- Utils ---
    function switchSection(hideElem, showElem) {
        hideElem.classList.remove('active');
        hideElem.classList.add('hidden');
        
        // Small delay for smooth transition
        setTimeout(() => {
            showElem.classList.remove('hidden');
            // Allow display block to render before opacity change
            setTimeout(() => {
                showElem.classList.add('active');
            }, 50);
        }, 500);
    }
});
