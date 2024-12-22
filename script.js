const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

let bird = {
  x: 50,
  y: 150,
  width: 30,
  height: 30,
  velocity: 0,
};

let pipes = [];
const pipeWidth = 50;
const pipeGap = 150;
let pipeSpeed = 2;
let frame = 0;
let score = 0;
let gameOver = false;
let gameStarted = false;

let gravity = 0.25;
const jumpStrength = -5;

let birdImg = new Image();
birdImg.src = './assets/bird.png';

let backgroundImg = new Image();
backgroundImg.src = './assets/background.jpg';

function updateBird() {
  if (gameStarted) {
    bird.velocity += gravity;
    bird.y += bird.velocity;
  }
}

function jump() {
  if (gameStarted) {
    bird.velocity = jumpStrength;
  }
}

function updatePipes() {
  if (frame % 100 === 0) {
    let topHeight = Math.random() * (canvas.height / 2 - 50) + 50;
    let bottomHeight = topHeight + pipeGap;

    pipes.push({
      x: canvas.width,
      top: topHeight,
      bottom: bottomHeight,
    });
  }

  pipes.forEach((pipe, index) => {
    pipe.x -= pipeSpeed;

    if (pipe.x + pipeWidth < 0) {
      pipes.splice(index, 1);
      score++;
    }
  });
}

function drawBackground() {
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}

function drawPipes() {
  pipes.forEach((pipe) => {
    ctx.fillStyle = 'green';
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);

    ctx.strokeStyle = '#2c6b2f';
    ctx.lineWidth = 4;
    ctx.strokeRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.strokeRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
  });
}

function checkCollision() {
  if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
    gameOver = true;
  }

  pipes.forEach((pipe) => {
    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + pipeWidth
    ) {
      if (bird.y < pipe.top || bird.y + bird.height > pipe.bottom) {
        gameOver = true;
      }
    }
  });
}

function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function gameLoop() {
  if (gameOver) {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText('Game Over!', 120, 300);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Clique para reiniciar!', 100, 350);

    document.getElementById('startButton').style.display = 'inline-block';

    return;
  }

  if (score > 0 && score % 10 === 0) {
    pipeSpeed += 0.05;
  }

  updateBird();
  updatePipes();
  checkCollision();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  drawBird();
  drawPipes();

  ctx.font = '20px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(`Score: ${score}`, 10, 20);

  frame++;
  requestAnimationFrame(gameLoop);
}

function startGame() {
  gameStarted = true;
  score = 0;
  pipes = [];
  bird.y = 150;
  bird.velocity = 0;
  pipeSpeed = 2;
  gameOver = false;

  document.getElementById('startButton').style.display = 'none';

  gameLoop();
}

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', startGame);


canvas.addEventListener('touchstart', (event) => {
  event.preventDefault();  
  if (gameOver) {
    startGame();  
  } else {
    jump();  
  }
});

