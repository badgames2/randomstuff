const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
let projectiles = [];
let enemies = [];
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

// Create a starry background
function createStars() {
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1
        });
    }
}

// Draw stars
function drawStars() {
    ctx.fillStyle = 'white';
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Create enemies
function createEnemy() {
    const size = Math.random() * 20 + 10;
    enemies.push({
        x: Math.random() * canvas.width,
        y: 0,
        size: size,
        speed: Math.random() * 2 + 1
    });
}

// Draw enemies
function drawEnemies() {
    ctx.fillStyle = 'red';
    enemies.forEach(enemy => {
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
        ctx.fill();
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

// Check for collisions
function checkCollisions() {
    projectiles.forEach((projectile, pIndex) => {
        enemies.forEach((enemy, eIndex) => {
            const dx = projectile.x - enemy.x;
            const dy = projectile.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < enemy.size) {
                enemies.splice(eIndex, 1);
                projectiles.splice(pIndex, 1);
            }
        });
    });
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawEnemies();
    drawProjectiles();
    updateEnemies();
    updateProjectiles();
    checkCollisions();
    requestAnimationFrame(gameLoop);
}

// Mouse movement
canvas.addEventListener('mousemove', (event) => {
    mouseX = event .clientX;
    mouseY = event.clientY;
});

// Mouse click to shoot
canvas.addEventListener('click', createProjectile);

// Create stars and start the game loop
createStars();
setInterval(createEnemy, 1000); // Create a new enemy every second
gameLoop();
