const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
let projectiles = [];
let enemies = [];
let explosions = [];
let enemyLasers = [];
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;
let deaths = 0; // Death counter

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
    enemies.push({
        x: Math.random() * canvas.width,
        y: 0,
        size: size,
        speed: Math.random() * 2 + 1,
        color: `hsl(${Math.random() * 360}, 100%, 50%)` // Random color
    });
}

// Draw enemies
function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
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
        // Randomly shoot laser
        if (Math.random() < 0.02) { // 2% chance to shoot each frame
            createEnemyLaser(enemy);
        }
    });
}

// Create projectiles
function createProjectile() {
    projectiles.push({
        x: mouseX,
        y: mouseY, // Start from the mouse position
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
        projectile.y -= projectile.speed; // Move upwards
        if (projectile.y < 0) {
            projectiles.splice(pIndex, 1); // Remove if off screen
        }
    });
}

// Create enemy laser
function createEnemyLaser(enemy) {
    enemyLasers.push({
        x: enemy.x,
        y: enemy.y,
        speed: 3
    });
}

// Draw enemy lasers
function drawEnemyLasers() {
    ctx.fillStyle = 'red';
    enemyLasers.forEach(laser => {
        ctx.fillRect(laser.x, laser.y, 5, 20);
    });
}

// Update enemy lasers
function updateEnemyLasers() {
    enemyLasers.forEach((laser, index) => {
        laser.y += laser.speed; // Move downwards
        if (laser.y > canvas.height) {
            enemyLasers.splice(index, 1); // Remove if off screen
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
        ctx.fillStyle = `rgba(255, 165, 0, ${explosion.alpha})`;
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        ctx.fill();
        explosion.alpha -= 0.05; // Fade out effect
        explosion.radius += 0.5; // Expand effect
        if (explosion.alpha <= 0) {
            explosions.splice(index, 1); // Remove ```javascript
        }
    });
}

// Update game state
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawEnemies();
    updateEnemies();
    drawProjectiles();
    updateProjectiles();
    drawEnemyLasers();
    updateEnemyLasers();
    drawExplosions();
    checkCollisions();
    document.getElementById('score').innerHTML = `Score: ${score}`;
    document.getElementById('deaths').innerHTML = `Deaths: ${deaths}`;
}

// Check for collisions
function checkCollisions() {
    // Check for projectile collisions with enemies
    projectiles.forEach((projectile, pIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y) < enemy.size) {
                // Remove projectile and enemy
                projectiles.splice(pIndex, 1);
                enemies.splice(eIndex, 1);
                // Increase score
                score++;
                localStorage.setItem('score', score);
                // Create explosion
                createExplosion(projectile.x, projectile.y);
            }
        });
    });

    // Check for enemy laser collisions with player
    enemyLasers.forEach((laser, lIndex) => {
        if (Math.hypot(laser.x - mouseX, laser.y - mouseY) < 20) {
            // Remove laser
            enemyLasers.splice(lIndex, 1);
            // Increase deaths
            deaths++;
            // Create explosion
            createExplosion(laser.x, laser.y);
        }
    });
}

// Handle mouse click
canvas.addEventListener('click', () => {
    createProjectile();
});

// Handle mouse move
canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Create initial stars and enemies
createStars();
setInterval(createEnemy, 1000); // Create a new enemy every second

// Start game loop
setInterval(update, 1000 / 60);
