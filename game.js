const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

/* ================= IMÁGENES ================= */
const snakeImg = new Image();
snakeImg.src = "images/vibora.png";

const foodImg = new Image();
foodImg.src = "images/Rangooo.png";

/* ================= CONFIG ================= */
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 1;
let dy = 0;
let score = 0;
let gameOver = false;
let speed = 10;
let restartButtonArea = null; // zona donde se dibuja el botón

/* ================= FONDO ARENA ================= */
function drawBackground() {
  ctx.fillStyle = "#d9b46b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 300; i++) {
    ctx.fillStyle =
      Math.random() > 0.5 ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)";
    ctx.beginPath();
    ctx.arc(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      Math.random() * 1.5,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(0,0,0,0.08)";
  for (let i = 0; i < tileCount; i++) {
    for (let j = 0; j < tileCount; j++) {
      ctx.strokeRect(i * gridSize, j * gridSize, gridSize, gridSize);
    }
  }
}

/* ================= SNAKE ================= */
function drawSnakePart(x, y, index) {
  const px = x * gridSize;
  const py = y * gridSize;
  const cx = px + 10;
  const cy = py + 10;

  if (index === 0 && snakeImg.complete) {
    ctx.drawImage(snakeImg, px - 10, py - 10, 40, 40);
    return;
  }

  ctx.fillStyle = "#d4a437";
  ctx.beginPath();
  ctx.arc(cx, cy, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#b8861f";
  ctx.beginPath();
  ctx.arc(cx + 2, cy + 2, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#5c3d0c";
  ctx.lineWidth = 2;
  ctx.stroke();

  if (index === snake.length - 1) {
    ctx.fillStyle = "#a87412";
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ================= GAME OVER ================= */
function drawGameOverMenu() {
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 40);

  ctx.font = "20px Arial";
  ctx.fillText("Puntaje: " + score, canvas.width / 2, canvas.height / 2 - 10);

  // 🔘 BOTÓN DIBUJADO EN EL CANVAS
  const btnWidth = 180;
  const btnHeight = 40;
  const btnX = canvas.width / 2 - btnWidth / 2;
  const btnY = canvas.height / 2 + 20;

  ctx.fillStyle = "#4CAF50";
  ctx.fillRect(btnX, btnY, btnWidth, btnHeight);

  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText("VOLVER A JUGAR", canvas.width / 2, btnY + 25);

  restartButtonArea = { x: btnX, y: btnY, w: btnWidth, h: btnHeight };
}

/* ================= RESET ================= */
function resetGame() {
  snake = [{ x: 10, y: 10 }];
  dx = 1;
  dy = 0;
  score = 0;
  speed = 10;
  scoreEl.textContent = score;
  gameOver = false;
}

/* ================= UPDATE ================= */
function update() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    if (score % 5 === 0) speed++;

    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } else {
    snake.pop();
  }

  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= tileCount ||
    head.y >= tileCount ||
    snake.slice(1).some((p) => p.x === head.x && p.y === head.y)
  ) {
    gameOver = true;
  }
}

/* ================= DRAW ================= */
function draw() {
  drawBackground();
  ctx.drawImage(foodImg, food.x * gridSize, food.y * gridSize, 35, 35);
  snake.forEach((part, i) => drawSnakePart(part.x, part.y, i));
  if (gameOver) drawGameOverMenu();
}

/* ================= LOOP ================= */
let lastTime = 0;

function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;

  if (delta > 1000 / speed) {
    if (!gameOver) update();
    lastTime = timestamp;
  }

  draw();
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

/* ================= TECLADO ================= */
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && dy === 0) {
    dx = 0;
    dy = -1;
  }
  if (e.key === "ArrowDown" && dy === 0) {
    dx = 0;
    dy = 1;
  }
  if (e.key === "ArrowLeft" && dx === 0) {
    dx = -1;
    dy = 0;
  }
  if (e.key === "ArrowRight" && dx === 0) {
    dx = 1;
    dy = 0;
  }
});
canvas.addEventListener("click", (e) => {
  if (!gameOver || !restartButtonArea) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (
    mouseX >= restartButtonArea.x &&
    mouseX <= restartButtonArea.x + restartButtonArea.w &&
    mouseY >= restartButtonArea.y &&
    mouseY <= restartButtonArea.y + restartButtonArea.h
  ) {
    resetGame();
  }
});

/* ================= 📱 CONTROLES TÁCTILES ================= */
let startX = 0;
let startY = 0;

function setDirection(newDx, newDy) {
  if (dx !== -newDx && dy !== -newDy) {
    dx = newDx;
    dy = newDy;
  }
}

document
  .getElementById("up")
  .addEventListener("click", () => setDirection(0, -1));
document
  .getElementById("down")
  .addEventListener("click", () => setDirection(0, 1));
document
  .getElementById("left")
  .addEventListener("click", () => setDirection(-1, 0));
document
  .getElementById("right")
  .addEventListener("click", () => setDirection(1, 0));

canvas.addEventListener("touchend", (e) => {
  const dxTouch = e.changedTouches[0].clientX - startX;
  const dyTouch = e.changedTouches[0].clientY - startY;

  if (Math.abs(dxTouch) > Math.abs(dyTouch)) {
    if (dxTouch > 0 && dx === 0) {
      dx = 1;
      dy = 0;
    } else if (dxTouch < 0 && dx === 0) {
      dx = -1;
      dy = 0;
    }
  } else {
    if (dyTouch > 0 && dy === 0) {
      dx = 0;
      dy = 1;
    } else if (dyTouch < 0 && dy === 0) {
      dx = 0;
      dy = -1;
    }
  }
});
canvas.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();

  // Coordenadas relativas al canvas real
  const touchX = (touch.clientX - rect.left) * (canvas.width / rect.width);
  const touchY = (touch.clientY - rect.top) * (canvas.height / rect.height);

  // 🔹 Si el juego terminó y tocó el botón, reiniciamos
  if (gameOver && restartButtonArea) {
    if (
      touchX >= restartButtonArea.x &&
      touchX <= restartButtonArea.x + restartButtonArea.w &&
      touchY >= restartButtonArea.y &&
      touchY <= restartButtonArea.y + restartButtonArea.h
    ) {
      resetGame();
      return; // Salimos para no registrar swipe
    }
  }

  // 🔹 Si no, registramos inicio del swipe
  startX = touch.clientX;
  startY = touch.clientY;
});
