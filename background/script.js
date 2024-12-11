const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
let projectiles = [];
let enemies = [];
let explosions = [];
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// Create a starry background
function createStars() {
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 0.5 + 0.5 // Random speed for each star
        });
    }
}

// Draw stars
function drawStars() {
    ctx.fillStyle = 'white';
    stars.forEach(star => {
        star.y += star.speed; // Move stars downwards
        if (star.y > canvas.height) {
            star.y = 0; // Reset star to the top
            star.x = Math.random() * canvas.width; // Randomize x position
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Create enemies
function createEnemy() {
    const size = Math.random() * 20 + 10;
    const shape = Math.floor(Math.random() * 3); // 0: circle, 1: square, 2: triangle
    enemies.push({
        x: Math.random() * canvas.width,
        y: 0,
 size: size,
        speed: Math.random() * 2 + 1,
        shape: shape,
        rotation: Math.random() * Math.PI * 2, // Random rotation angle
        color: `hsl(${Math.random() * 360}, 100%, 50%)` // Random color
    });
}

// Draw enemies with depth effect
function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.save();
        ctx.fillStyle = enemy.color;
        ctx.translate(enemy.x, enemy.y);
        ctx.rotate(enemy.rotation);
        ctx.beginPath();
        if (enemy.shape === 0) { // Circle
            const gradient = ctx.createRadialGradient(0, 0, enemy.size / 4, 0, 0, enemy.size);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
            gradient.addColorStop(1, enemy.color);
            ctx.fillStyle = gradient;
            ctx.arc(0, 0, enemy.size, 0, Math.PI * 2);
        } else if (enemy.shape === 1) { // Square
            const gradient = ctx.createLinearGradient(-enemy.size / 2, -enemy.size / 2, enemy.size / 2, enemy.size / 2);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
            gradient.addColorStop(1, enemy.color);
            ctx.fillStyle = gradient;
            ctx.rect(-enemy.size / 2, -enemy.size / 2, enemy.size, enemy.size);
        } else if (enemy.shape === 2) { // Triangle
            const gradient = ctx.createLinearGradient(-enemy.size, enemy.size, enemy.size, enemy.size);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
            gradient.addColorStop(1, enemy.color);
            ctx.moveTo(0, -enemy.size);
            ctx.lineTo(-enemy.size, enemy.size);
            ctx.lineTo(enemy.size, enemy.size);
            ctx.closePath();
        }
        ctx.fill();
        ctx.restore();
        enemy.rotation += 0.05; // Rotate the enemy for a lively effect
    });
}

// Update enemies
function updateEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });
}

// Create projectiles
function createProjectile() {
    projectiles.push({
        x: mouseX,
        y: canvas.height - 30,
        speed: 5
    });
}

// Draw projectiles
function drawProjectiles() {
    ctx.fillStyle = 'blue';
    projectiles.forEach(projectile => {
        ctx.fillRect(projectile.x, projectile.y, 5, 20);
    });
}

// Update projectiles
function updateProjectiles() {
    projectiles.forEach((projectile, pIndex) => {
        projectile.y -= projectile.speed;
        if (projectile.y < 0) {
            projectiles.splice(pIndex, 1);
        }
    });
}

// Create explosion
function createExplosion(x, y) {
    explosions.push({
        x: x,
        y: y,
        radius: 5,
        alpha: 1,
        life: 20 // Duration of the explosion
    });
}

// Draw explosions
function drawExplosions() {
    explosions.forEach((explosion, index) => {
        ctx.fillStyle = `rgba(255, 165, 0, ${explosion.alpha})`; // Orange color
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Update explosion properties
        explosion.radius += 2; // Increase radius
        explosion.alpha -= 0.05; // Decrease alpha
        explosion.life--;

        // Remove explosion if life is over
        if (explosion.life <= 0) {
            explosions.splice(index, 1);
        }
    });
}

// Check for collisions
function checkCollisions() {
    projectiles.forEach((projectile, pIndex) => {
        enemies.forEach((enemy, eIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if (dist < enemy.size) {
                createExplosion(enemy.x, enemy.y); // Create explosion at enemy's position
                enemies.splice(eIndex, 1); // Remove enemy
                projectiles.splice(pIndex, 1); // Remove projectile
                score++; // Increment score
                localStorage.setItem('score', score); // Save score to local Storage
                updateLeaderboard(); // Update leaderboard after scoring
            }
        });
    });
}

// Update leaderboard
function updateLeaderboard() {
    if (score > 0) {
        const username = localStorage.getItem('username');
        if (username) {
            leaderboard.push({ username, score });
            leaderboard.sort((a, b) => b.score - a.score); // Sort by score descending
            leaderboard = leaderboard.slice(0, 3); // Keep top 3 scores
            localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
            displayLeaderboard();
        }
    }
}

// Display leaderboard
function displayLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '';
    leaderboard.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.username}: ${entry.score}`;
        leaderboardList.appendChild(li);
    });
    document.getElementById('leaderboard').style.display = 'block'; // Show leaderboard
}

// Show pop-up for score usage
function showPopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'block';
}

// Event listeners for pop-up buttons
document.getElementById('yesButton').addEventListener('click', () => {
    document.getElementById('usernameInput').style.display = 'block'; // Show username input
});

document.getElementById('noButton').addEventListener('click', () => {
    const popup = document.getElementById('popup');
    popup.style.display = 'none'; // Close pop-up
});

document.getElementById('submitUsername').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    if (username.length === 3) {
        localStorage.setItem('username', username); // Save username
        const popup = document.getElementById('popup');
        popup.style.display = 'none'; // Close pop-up
        displayLeaderboard(); // Display leaderboard
    } else {
        alert('Username must be 3 letters long.');
    }
});

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawEnemies();
    drawProjectiles();
    drawExplosions();
    updateEnemies();
    updateProjectiles();
    checkCollisions();
    document.getElementById('score').innerText = `Score: ${score}`;
    requestAnimationFrame(gameLoop);
}

// Initialize game
createStars();
setInterval(createEnemy, 1000); // Create a new enemy every second
setInterval(createProjectile, 200); // Auto-shoot projectiles every 200ms
canvas.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

// Show the pop-up when the page loads
window.onload = showPopup;
gameLoop();
