const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const pacman = {
    x: 30,
    y: 30,
    size: 20,
    speed: 5
};

const ghost = {
    x: 570,
    y: 570,
    size: 20,
    speed: 3
};

let gamePaused = false;

const walls = [
    {x: 0, y: 0, width: 600, height: 20},
    {x: 0, y: 0, width: 20, height: 600},
    {x: 580, y: 0, width: 20, height: 600},
    {x: 0, y: 580, width: 600, height: 20},
    {x: 100, y: 0, width: 20, height: 200},
    {x: 100, y: 400, width: 20, height: 200},
    {x: 300, y: 100, width: 20, height: 400},
    {x: 400, y: 0, width: 20, height: 200},
    {x: 400, y: 400, width: 20, height: 200},
    {x: 100, y: 200, width: 400, height: 20},
    {x: 0, y: 300, width: 200, height: 20},
    {x: 400, y: 300, width: 200, height: 20},
];

document.addEventListener('keydown', movePacman);

function movePacman(e) {
    if (gamePaused) return;

    switch (e.key) {
        case 'ArrowUp':
            if (!checkCollision(pacman.x, pacman.y - pacman.speed)) {
                pacman.y -= pacman.speed;
            }
            break;
        case 'ArrowDown':
            if (!checkCollision(pacman.x, pacman.y + pacman.speed)) {
                pacman.y += pacman.speed;
            }
            break;
        case 'ArrowLeft':
            if (!checkCollision(pacman.x - pacman.speed, pacman.y)) {
                pacman.x -= pacman.speed;
            }
            break;
        case 'ArrowRight':
            if (!checkCollision(pacman.x + pacman.speed, pacman.y)) {
                pacman.x += pacman.speed;
            }
            break;
    }
    drawGame();
}

function checkCollision(x, y) {
    for (let wall of walls) {
        if (
            x < wall.x + wall.width &&
            x + pacman.size > wall.x &&
            y < wall.y + wall.height &&
            y + pacman.size > wall.y
        ) {
            return true;
        }
    }
    return false;
}

function moveGhost() {
    if (gamePaused) return;

    if (ghost.x < pacman.x) {
        ghost.x += ghost.speed;
    } else {
        ghost.x -= ghost.speed;
    }

    if (ghost.y < pacman.y) {
        ghost.y += ghost.speed;
    } else {
        ghost.y -= ghost.speed;
    }

    if (checkCollision(ghost.x, ghost.y)) {
        ghost.x -= ghost.speed;
        ghost.y -= ghost.speed;
    }

    drawGame();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPacman();
    drawGhost();
    drawWalls();
}

function drawPacman() {
    ctx.beginPath();
    ctx.arc(pacman.x, pacman.y, pacman.size, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacman.x, pacman.y);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();
}

function drawGhost() {
    // Draw ghost body
    ctx.beginPath();
    ctx.arc(ghost.x, ghost.y, ghost.size, Math.PI, 0);
    ctx.lineTo(ghost.x - ghost.size, ghost.y + ghost.size);
    ctx.lineTo(ghost.x + ghost.size, ghost.y + ghost.size);
    ctx.closePath();
    ctx.fillStyle = 'red';
    ctx.fill();

    // Draw ghost eyes
    ctx.beginPath();
    ctx.arc(ghost.x - 7, ghost.y - 3, 3, 0, 2 * Math.PI);
    ctx.arc(ghost.x + 7, ghost.y - 3, 3, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();

    // Draw ghost pupils
    ctx.beginPath();
    ctx.arc(ghost.x - 7, ghost.y - 3, 1, 0, 2 * Math.PI);
    ctx.arc(ghost.x + 7, ghost.y - 3, 1, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();
}

function drawWalls() {
    ctx.fillStyle = 'blue';
    for (let wall of walls) {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    }
}

let ghostInterval = setInterval(moveGhost, 100);

let currentProblem = generateProblem();

function generateProblem() {
    const problemType = Math.floor(Math.random() * 3);
    let num1, num2, problemText, correctAnswer;

    switch (problemType) {
        case 0: // Multiplication
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            problemText = `¿Cuál es ${num1} x ${num2}?`;
            correctAnswer = num1 * num2;
            break;
        case 1: // Division
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            correctAnswer = num1 * num2;
            problemText = `¿Cuál es ${correctAnswer} ÷ ${num1}?`;
            correctAnswer = num2;
            break;
        case 2: // Square root
            num1 = Math.floor(Math.random() * 10) + 1;
            correctAnswer = num1 * num1;
            problemText = `¿Cuál es √${correctAnswer}?`;
            correctAnswer = num1;
            break;
    }

    document.getElementById('problem').innerText = problemText;
    return correctAnswer;
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer').value;
    if (parseInt(userAnswer) === currentProblem) {
        alert('¡Correcto!');
        currentProblem = generateProblem();
        document.getElementById('answer').value = '';
        ghost.speed += 0.5;
        gamePaused = false;
    } else {
        alert('Incorrecto, intenta de nuevo.');
        gamePaused = true;
    }
}

drawGame();
