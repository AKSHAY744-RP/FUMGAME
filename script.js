// ========= STYLES =========
document.body.style.margin = "0";
document.body.style.fontFamily = "Poppins, sans-serif";
document.body.style.textAlign = "center";
document.body.style.height = "100vh";
document.body.style.overflow = "hidden";

function clearPage() {
  document.body.innerHTML = "";
}

// ========= HOME PAGE =========
function homePage() {
  clearPage();
  document.body.style.background = "linear-gradient(135deg, #ff758c, #ff7eb3, #8fd3f4)";
  document.body.style.backgroundSize = "400% 400%";
  document.body.style.animation = "bgMove 10s ease infinite";

  const style = document.createElement("style");
  style.textContent = `
    @keyframes bgMove {
      0%{background-position:0% 50%}
      50%{background-position:100% 50%}
      100%{background-position:0% 50%}
    }
    button {
      margin: 15px;
      padding: 20px 40px;
      font-size: 20px;
      border: none;
      border-radius: 12px;
      background: #007aff;
      color: white;
      cursor: pointer;
      transition: 0.3s;
    }
    button:hover {
      transform: scale(1.1);
      background: #005bbb;
    }
  `;
  document.head.appendChild(style);

  const title = document.createElement("h1");
  title.textContent = "🎮 Fun Game by Akshay & Ashaaz";
  title.style.color = "white";
  title.style.marginTop = "100px";

  const calcBtn = document.createElement("button");
  calcBtn.textContent = "📱 Open Calculator";
  calcBtn.onclick = calculatorPage;

  const gameBtn = document.createElement("button");
  gameBtn.textContent = "🐤 Play Flappy Bird";
  gameBtn.onclick = flappyGame;

  document.body.append(title, calcBtn, gameBtn);
}

// ========= CALCULATOR =========
function calculatorPage() {
  clearPage();
  document.body.style.background = "linear-gradient(135deg, #1e1e2f, #282846)";

  const container = document.createElement("div");
  container.style.margin = "60px auto";
  container.style.width = "300px";
  container.style.background = "black";
  container.style.borderRadius = "25px";
  container.style.padding = "20px";
  container.style.boxShadow = "0 0 20px #000";

  const display = document.createElement("input");
  display.id = "display";
  display.disabled = true;
  display.style.width = "100%";
  display.style.height = "60px";
  display.style.fontSize = "2em";
  display.style.textAlign = "right";
  display.style.marginBottom = "20px";
  display.style.border = "none";
  display.style.borderRadius = "10px";
  display.style.background = "#333";
  display.style.color = "white";
  display.style.padding = "10px";

  const buttons = [
    "7","8","9","/","4","5","6","*","1","2","3","-","0",".","+","=","AC"
  ];

  const grid = document.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(4,1fr)";
  grid.style.gap = "10px";

  buttons.forEach(b => {
    const btn = document.createElement("button");
    btn.textContent = b;
    btn.style.height = "60px";
    btn.style.borderRadius = "10px";
    btn.style.fontSize = "20px";
    btn.style.border = "none";
    btn.style.background = (b === "=") ? "#ff9500" : "#505050";
    btn.style.color = "white";
    btn.onclick = () => {
      if (b === "=") {
        try { display.value = eval(display.value); } catch { display.value = "Error"; }
      } else if (b === "AC") {
        display.value = "";
      } else {
        display.value += b;
      }
    };
    grid.appendChild(btn);
  });

  const backBtn = document.createElement("button");
  backBtn.textContent = "⬅ Back to Home";
  backBtn.onclick = homePage;
  backBtn.style.marginTop = "20px";
  backBtn.style.padding = "15px 30px";
  backBtn.style.background = "#007aff";
  backBtn.style.border = "none";
  backBtn.style.borderRadius = "12px";
  backBtn.style.color = "white";
  backBtn.style.cursor = "pointer";

  container.append(display, grid, backBtn);
  document.body.append(container);
}

// ========= FLAPPY BIRD GAME =========
function flappyGame() {
  clearPage();
  document.body.style.background = "linear-gradient(135deg, #89f7fe, #66a6ff)";
  
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 480;
  canvas.style.border = "2px solid white";
  canvas.style.borderRadius = "10px";
  canvas.style.marginTop = "40px";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  const scoreText = document.createElement("h2");
  scoreText.textContent = "Score: 0";
  scoreText.style.color = "white";
  document.body.prepend(scoreText);

  const backBtn = document.createElement("button");
  backBtn.textContent = "⬅ Back to Home";
  backBtn.onclick = homePage;
  backBtn.style.margin = "15px";
  backBtn.style.padding = "10px 25px";
  backBtn.style.border = "none";
  backBtn.style.borderRadius = "10px";
  backBtn.style.background = "#007aff";
  backBtn.style.color = "white";
  document.body.appendChild(backBtn);

  const startBtn = document.createElement("button");
  startBtn.textContent = "▶ Start Game";
  startBtn.style.padding = "10px 25px";
  startBtn.style.border = "none";
  startBtn.style.borderRadius = "10px";
  startBtn.style.background = "#28a745";
  startBtn.style.color = "white";
  startBtn.style.margin = "10px";
  document.body.appendChild(startBtn);

  let bird = { x: 50, y: 150, width: 30, height: 30, velocity: 0 };
  let gravity = 0.5, lift = -8, pipes = [], score = 0, gameRunning = false, loopId;

  function drawBird() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
  }

  function drawPipes() {
    ctx.fillStyle = "green";
    pipes.forEach(p => {
      ctx.fillRect(p.x, 0, 50, p.top);
      ctx.fillRect(p.x, p.bottom, 50, canvas.height - p.bottom);
    });
  }

  function update() {
    if (!gameRunning) return;
    bird.velocity += gravity;
    bird.y += bird.velocity;
    if (bird.y + bird.height > canvas.height || bird.y < 0) return gameOver();

    if (Math.random() < 0.02) {
      let gap = 120;
      let top = Math.random() * (canvas.height - gap - 100) + 20;
      pipes.push({ x: canvas.width, top, bottom: top + gap });
    }

    pipes.forEach(p => {
      p.x -= 2;
      if (p.x + 50 < 0) pipes.shift();
      if (
        bird.x < p.x + 50 &&
        bird.x + bird.width > p.x &&
        (bird.y < p.top || bird.y + bird.height > p.bottom)
      ) {
        return gameOver();
      }
      if (p.x + 50 === bird.x) {
        score++;
        scoreText.textContent = "Score: " + score;
      }
    });
  }

  function draw() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
  }

  function loop() {
    update();
    draw();
    if (gameRunning) loopId = requestAnimationFrame(loop);
  }

  function startGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    scoreText.textContent = "Score: 0";
    gameRunning = true;
    startBtn.disabled = true;
    loop();
  }

  function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(loopId);
    alert("Game Over! Score: " + score);
    startBtn.disabled = false;
  }

  window.addEventListener("touchstart", () => { if (gameRunning) bird.velocity = lift; });
  startBtn.onclick = startGame;
}

// ========= INIT =========
homePage();
