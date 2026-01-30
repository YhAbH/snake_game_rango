const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

/* ================= IMÁGENES ================= */
const snakeImg = new Image();
snakeImg.src = "vibora.png";

const foodImg = new Image();
foodImg.src = "Rangooo.png";

/* ================= CONFIG ================= */
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 1;
let dy = 0;
let score = 0;
let gameOver = false;
let speed = 10; // velocidad inicial

/* ================= FONDO ARENA ================= */
function drawBackground() {
  // Base arena
  ctx.fillStyle = "#d9b46b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Textura tipo granulado
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

  // Cuadros sutiles
  ctx.strokeStyle = "rgba(0,0,0,0.08)";
  for (let i = 0; i < tileCount; i++) {
    for (let j = 0; j < tileCount; j++) {
      ctx.strokeRect(i * gridSize, j * gridSize, gridSize, gridSize);
    }
  }
}
function drawSnakePart(x, y, index) {
  const px = x * gridSize;
  const py = y * gridSize;
  const cx = px + 10;
  const cy = py + 10;

  /* ===== CABEZA ===== */
  if (index === 0 && snakeImg.complete) {
    ctx.drawImage(snakeImg, px - 10, py - 10, 40, 40);
    return;
  }

  /* ===== CUERPO JAKE ===== */
  ctx.fillStyle = "#d4a437"; // amarillo ocre tipo Jake
  ctx.beginPath();
  ctx.arc(cx, cy, 9, 0, Math.PI * 2);
  ctx.fill();

  // sombra volumen
  ctx.fillStyle = "#b8861f";
  ctx.beginPath();
  ctx.arc(cx + 2, cy + 2, 5, 0, Math.PI * 2);
  ctx.fill();

  // borde oscuro separa del fondo
  ctx.strokeStyle = "#5c3d0c";
  ctx.lineWidth = 2;
  ctx.stroke();

  /* ===== COLA MISMO COLOR PERO MÁS OSCURO ===== */
  if (index === snake.length - 1) {
    ctx.fillStyle = "#a87412"; // mismo tono Jake pero más profundo
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#3e2606";
    ctx.stroke();
  }
}

/* ================= GAME OVER ================= */
function drawGameOverMenu() {
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);

  ctx.font = "20px Arial";
  ctx.fillText("Puntaje: " + score, canvas.width / 2, canvas.height / 2 + 10);

  ctx.fillStyle = "lime";
  ctx.fillRect(canvas.width / 2 - 60, canvas.height / 2 + 30, 120, 40);

  ctx.fillStyle = "black";
  ctx.fillText("REINICIAR", canvas.width / 2, canvas.height / 2 + 57);
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

    // 🔥 AUMENTAR VELOCIDAD CADA 5 PUNTOS
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
  ctx.drawImage(foodImg, food.x * gridSize, food.y * gridSize, 30, 30);
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

/* ================= CONTROLES ================= */
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

canvas.addEventListener("click", () => {
  if (gameOver) resetGame();
});
