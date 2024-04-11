const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const snakeSize = 10;
let snake = [{ x: 10, y: 10 }];
let direction = "right";
let foods = [];
let obstacles = [
    { x: 100, y: 100, width: 20, height: 20 },
    { x: 200, y: 200, width: 30, height: 30 },
    { x: 300, y: 50, width: 25, height: 25 },
    { x: 400, y: 150, width: 15, height: 15 },
    { x: 250, y: 350, width: 20, height: 20 }
];
let gameOver = false;

function createFood() {
    return {
        x: Math.floor(Math.random() * canvas.width / snakeSize) * snakeSize,
        y: Math.floor(Math.random() * canvas.height / snakeSize) * snakeSize
    };
}

function createFoods() {
    for (let i = 0; i < 5; i++) {
        foods.push(createFood());
    }
}

function drawBackground() {
    // Draw grass background
    ctx.fillStyle = "#8bc34a"; // Green color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = "#7cb342"; // Darker green color
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += snakeSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += snakeSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function draw() {
    drawBackground();

    // Draw snake
    ctx.fillStyle = "green";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
    });

    // Draw food
    ctx.fillStyle = "blue";
    foods.forEach(food => {
        ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
    });

    // Draw obstacles
    ctx.fillStyle = "black";
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Draw game over text if game over
    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2);
    }
}

function moveSnake() {
    if (gameOver) return;

    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
        case "up":
            head.y -= snakeSize;
            break;
        case "down":
            head.y += snakeSize;
            break;
        case "left":
            head.x -= snakeSize;
            break;
        case "right":
            head.x += snakeSize;
            break;
    }

    // Check for collisions with obstacles or itself
    if (head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height ||
        snake.some(segment => segment.x === head.x && segment.y === head.y) ||
        obstacles.some(obstacle => head.x < obstacle.x + obstacle.width &&
            head.x + snakeSize > obstacle.x &&
            head.y < obstacle.y + obstacle.height &&
            head.y + snakeSize > obstacle.y)) {
        gameOver = true;
        return;
    }

    snake.unshift(head);

    // Check if snake eats food
    foods.forEach((food, index) => {
        if (head.x === food.x && head.y === food.y) {
            foods.splice(index, 1);
            foods.push(createFood());

            // Grow snake
            // Add new segment at tail
            const tail = { x: snake[snake.length - 1].x, y: snake[snake.length - 1].y };
            snake.push(tail);
        }
    });

    // Remove last segment if snake didn't eat food
    if (!gameOver) {
        snake.pop();
    }
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = "right";
    foods = [];
    createFoods();
    gameOver = false;
}

function gameLoop() {
    draw();
    moveSnake();

    setTimeout(gameLoop, 100);
}

createFoods();
gameLoop();

// Listen for arrow key presses to change snake direction
document.addEventListener("keydown", event => {
    switch (event.key) {
        case "ArrowUp":
            if (direction !== "down") direction = "up";
            break;
        case "ArrowDown":
            if (direction !== "up") direction = "down";
            break;
        case "ArrowLeft":
            if (direction !== "right") direction = "left";
            break;
        case "ArrowRight":
            if (direction !== "left") direction = "right";
            break;
    }
});