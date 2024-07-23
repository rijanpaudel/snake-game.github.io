const GRID_SIZE = 18;
const INITIAL_SNAKE_POSITION = { x: 13, y: 15 };
const INITIAL_FOOD_POSITION = { x: 6, y: 7 };
const INITIAL_SPEED = 5;

let initialDirection = { x: 0, y: 0 };
let speed = INITIAL_SPEED;
let score = 0;
let lastPaintTime = 0;
let snakeArray = [INITIAL_SNAKE_POSITION];
let food = INITIAL_FOOD_POSITION;

const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/game_over.mp3');
const moveSound = new Audio('music/move.mp3');
const backgroundMusic = new Audio('music/music.mp3');

function main(currentTime) {
  window.requestAnimationFrame(main);
  if ((currentTime - lastPaintTime) / 1000 < 1 / speed) return;
  lastPaintTime = currentTime;
  gameEngine();
}

function isCollide(snake) {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
  if (snake[0].x >= GRID_SIZE || snake[0].x < 0 || snake[0].y >= GRID_SIZE || snake[0].y < 0) return true;
  return false;
}

function resetGame() {
  gameOverSound.play();
  backgroundMusic.pause();
  initialDirection = { x: 0, y: 0 };
  alert("Game Over. Press any key to play again.");
  snakeArray = [INITIAL_SNAKE_POSITION];
  score = 0;
  updateScore();
  backgroundMusic.play();
}

function updateScore() {
  document.getElementById('scoreBox').innerHTML = "Score: " + score;
}

function randomFoodPosition() {
  let a = 2;
  let b = GRID_SIZE - 2;
  return {
    x: Math.round(a + (b - a) * Math.random()),
    y: Math.round(a + (b - a) * Math.random())
  };
}

function gameEngine() {
  backgroundMusic.play();
  if (isCollide(snakeArray)) {
    resetGame();
  }

  if (snakeArray[0].y === food.y && snakeArray[0].x === food.x) {
    foodSound.play();
    score++;
    updateScore();
    snakeArray.unshift({ x: snakeArray[0].x + initialDirection.x, y: snakeArray[0].y + initialDirection.y });
    food = randomFoodPosition();
  }

  for (let i = snakeArray.length - 2; i >= 0; i--) {
    snakeArray[i + 1] = { ...snakeArray[i] };
  }

  snakeArray[0].x += initialDirection.x;
  snakeArray[0].y += initialDirection.y;

  const board = document.getElementById('board');
  board.innerHTML = "";
  snakeArray.forEach((segment, index) => {
    const snakeElement = document.createElement('div');
    snakeElement.style.gridRowStart = segment.y;
    snakeElement.style.gridColumnStart = segment.x;
    snakeElement.classList.add(index === 0 ? 'head' : 'snake');
    board.appendChild(snakeElement);
  });

  const foodElement = document.createElement('div');
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add('food');
  board.appendChild(foodElement);
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
  initialDirection = { x: 0, y: 1 };
  moveSound.play();
  switch (e.key) {
    case "ArrowUp":
      initialDirection = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      initialDirection = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      initialDirection = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      initialDirection = { x: 1, y: 0 };
      break;
  }
});
