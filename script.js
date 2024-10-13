const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");

// Canvas dimensions
const canvasWidth = window.innerWidth - 40; // Responsive width
const canvasHeight = 400; // Fixed height for simplicity
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Snake settings
let snake = [{ x: 200, y: 200 }];
const snakeSize = 20;
let snakeDirection = { x: 0, y: 0 };
let food = { x: getRandomCoordinate(canvasWidth), y: getRandomCoordinate(canvasHeight) };
let score = 0;
let timeElapsed = 0;

// Game speed
const gameSpeed = 100;

// Timer
let gameStartTime = Date.now();

// Mobile controls
document.getElementById("left").addEventListener("click", () => changeDirection({ keyCode: 37 }));
document.getElementById("up").addEventListener("click", () => changeDirection({ keyCode: 38 }));
document.getElementById("down").addEventListener("click", () => changeDirection({ keyCode: 40 }));
document.getElementById("right").addEventListener("click", () => changeDirection({ keyCode: 39 }));

// Neon colors array
const neonColors = [
    '#00ff00', // Green
    '#ff00ff', // Magenta
    '#00ffff', // Cyan
    '#ff0000', // Red
    '#ffff00', // Yellow
    '#ff7f00'  // Orange
];
let currentColorIndex = 0; // Start with the first color

// Main game loop
function gameLoop() {
    if (isGameOver()) {
        alert("Game Over! Your score: " + score + ". Time survived: " + Math.floor(timeElapsed / 60) + " minutes " + (timeElapsed % 60) + " seconds.");
        document.location.reload();
    } else {
        setTimeout(() => {
            clearCanvas();
            moveSnake();
            drawSnake();
            drawFood(); // Draw realistic food
            updateScoreAndTimer();
            gameLoop();
        }, gameSpeed);
    }
}

// Clear the canvas for each frame
function clearCanvas() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

// Draw the snake with a gradient effect
function drawSnake() {
    snake.forEach((segment) => {
        const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
        gradient.addColorStop(0, "#00ff00");
        gradient.addColorStop(1, "#006400");

        ctx.fillStyle = gradient;
        ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);

        // Apply glowing effect to the snake segment
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#00ff00";
    });
}

// Move the snake
function moveSnake() {
    const head = {
        x: (snake[0].x + snakeDirection.x * snakeSize + canvasWidth) % canvasWidth,
        y: (snake[0].y + snakeDirection.y * snakeSize + canvasHeight) % canvasHeight
    };
    snake.unshift(head);

    // Check if snake has eaten the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        // Change neon color when score increases
        changeNeonColor();

        food = { x: getRandomCoordinate(canvasWidth), y: getRandomCoordinate(canvasHeight) };
    } else {
        snake.pop(); // Remove the last part of the snake unless food is eaten
    }
}

// Change direction of the snake based on user input
function changeDirection(event) {
    const keyPressed = event.keyCode;
    const goingUp = snakeDirection.y === -1;
    const goingDown = snakeDirection.y === 1;
    const goingLeft = snakeDirection.x === -1;
    const goingRight = snakeDirection.x === 1;

    if (keyPressed === 37 && !goingRight) { // left arrow
        snakeDirection = { x: -1, y: 0 };
        changeShadowColor('#ff0000'); // Change color on left direction
    } else if (keyPressed === 38 && !goingDown) { // up arrow
        snakeDirection = { x: 0, y: -1 };
        changeShadowColor('#00ffff'); // Change color on up direction
    } else if (keyPressed === 39 && !goingLeft) { // right arrow
        snakeDirection = { x: 1, y: 0 };
        changeShadowColor('#ffff00'); // Change color on right direction
    } else if (keyPressed === 40 && !goingUp) { // down arrow
        snakeDirection = { x: 0, y: 1 };
        changeShadowColor('#ff7f00'); // Change color on down direction
    }
}

// Check if game is over (snake hits itself)
function isGameOver() {
    const head = snake[0];

    // Snake hits itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false; // Only return true if snake collides with itself
}

// Draw realistic food (apple-like appearance)
function drawFood() {
    const radius = snakeSize / 2; // Food is circular

    // Create a radial gradient to give the apple a shiny effect
    const gradient = ctx.createRadialGradient(
        food.x + radius, food.y + radius, radius / 4, // Inner circle
        food.x + radius, food.y + radius, radius       // Outer circle
    );
    gradient.addColorStop(0, "red");       // Center of the apple
    gradient.addColorStop(1, "#8B0000");   // Darker outer shade

    // Draw the apple (food)
    ctx.beginPath();
    ctx.arc(food.x + radius, food.y + radius, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();

    // Draw the apple's shine (small white reflection)
    ctx.beginPath();
    ctx.arc(food.x + radius / 2, food.y + radius / 2, radius / 4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fill();
    ctx.closePath();
}

// Generate random coordinates for food
function getRandomCoordinate(max) {
    return Math.floor(Math.random() * (max / snakeSize)) * snakeSize;
}

// Update the score and timer
function updateScoreAndTimer() {
    scoreElement.textContent = "Score: " + score;

    // Calculate time elapsed since the game started
    timeElapsed = Math.floor((Date.now() - gameStartTime) / 1000);
    
    // Convert seconds into minutes and seconds format
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    timerElement.textContent = `Time: ${minutes}m ${seconds}s`;
}

// Change neon color on score update
function changeNeonColor() {
    // Change the canvas shadow color based on the current color index
    const newColor = neonColors[currentColorIndex];
    canvas.style.boxShadow = `0 0 30px ${newColor}, 0 0 60px ${newColor}, 0 0 90px ${newColor}`;
    
    // Update to the next color in the array, cycling back to the start
    currentColorIndex = (currentColorIndex + 1) % neonColors.length;
}

// Change the shadow color based on direction
function changeShadowColor(color) {
    canvas.style.boxShadow = `0 0 30px ${color}, 0 0 60px ${color}, 0 0 90px ${color}`;
}

// Start the game
gameLoop();
