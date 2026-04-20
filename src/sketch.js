// pi-demo-p5js — main sketch
// Logic lives in src/ modules; this file wires them into the p5.js draw loop.

// In Node.js (Jest) environment, import Ball; in browser it is a global.
const _Ball = typeof Ball !== 'undefined'
  ? Ball
  : (typeof require !== 'undefined' ? require('./ball').Ball : undefined);

const _ballModule = typeof require !== 'undefined' ? require('./ball') : {};
const _splitBall = typeof splitBall !== 'undefined' ? splitBall : _ballModule.splitBall;
const _eatBall   = typeof eatBall   !== 'undefined' ? eatBall   : _ballModule.eatBall;
const _MIN_RADIUS = typeof MIN_RADIUS !== 'undefined' ? MIN_RADIUS : _ballModule.MIN_RADIUS;

/**
 * Spawn a new Ball at (x, y) and push it onto the balls array.
 * Clicks outside the canvas bounds are silently ignored.
 *
 * @param {Ball[]} balls         Mutable array of active balls
 * @param {number} x             Click x-coordinate (mouseX)
 * @param {number} y             Click y-coordinate (mouseY)
 * @param {number} canvasWidth   Canvas width in pixels
 * @param {number} canvasHeight  Canvas height in pixels
 */
function spawnBallOnClick(balls, x, y, canvasWidth, canvasHeight) {
  if (x < 0 || x > canvasWidth || y < 0 || y > canvasHeight) return;
  const BallClass = typeof Ball !== 'undefined' ? Ball : _Ball;
  balls.push(new BallClass({ x, y }, { x: 0, y: 0 }));
}

// ---------------------------------------------------------------------------
// Task 3.2 — splitBall (browser fallback — real impl lives in ball.js)
// ---------------------------------------------------------------------------
function splitBallLocal(ball) {
  return _splitBall(ball);
}

// ---------------------------------------------------------------------------
// Task 3.3 — eatBall (browser fallback — real impl lives in ball.js)
// ---------------------------------------------------------------------------
function eatBallLocal(larger, smaller) {
  return _eatBall(larger, smaller);
}

// ---------------------------------------------------------------------------
// Task 3.1 — lifecycle-aware collision loop
// ---------------------------------------------------------------------------
/**
 * Process ball–ball interactions for one frame.
 * Mutates the balls array in place.
 *
 * Rules:
 *  - Same colorGroup AND ratio < 1.5 → split both (remove 2, add 4)
 *  - ratio >= 1.5                     → larger eats smaller (remove smaller)
 *  - Otherwise                        → normal elastic resolveCollision
 *
 * @param {Ball[]} balls  Mutable array of active balls
 */
function processCollisions(balls) {
  const toRemove = new Set();
  const toAdd    = [];

  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const a = balls[i];
      const b = balls[j];

      if (toRemove.has(a) || toRemove.has(b)) continue;

      const dx = b.position.x - a.position.x;
      const dy = b.position.y - a.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance >= a.radius + b.radius) continue; // no contact

      const larger  = a.radius >= b.radius ? a : b;
      const smaller = a.radius >= b.radius ? b : a;
      const ratio   = larger.radius / smaller.radius;

      if (a.colorGroup === b.colorGroup && ratio < 1.5) {
        // Split both balls
        toAdd.push(...splitBallLocal(a));
        toAdd.push(...splitBallLocal(b));
        toRemove.add(a);
        toRemove.add(b);
      } else if (ratio >= 1.5) {
        // Larger eats smaller
        eatBallLocal(larger, smaller);
        toRemove.add(smaller);
      } else {
        // Normal elastic collision
        a.resolveCollision(b);
      }
    }
  }

  // Apply removals and additions
  for (const ball of toRemove) {
    const idx = balls.indexOf(ball);
    if (idx !== -1) balls.splice(idx, 1);
  }
  balls.push(...toAdd);
}

// ---------------------------------------------------------------------------
// p5.js lifecycle – only runs in the browser
// ---------------------------------------------------------------------------
let balls = [];

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  // Seed with one ball in the centre so the canvas is not empty on load
  balls.push(new Ball(
    { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
    { x: 2, y: 0 }
  ));
}

function draw() {
  background(15, 17, 23);
  drawFieldBorder();

  for (const ball of balls) {
    // --- Physics update ---
    ball.update();
    ball.checkBounds();

    // --- Draw ball (Task 3.5: use ball.radius) ---
    stroke(ball.strokeColor.r, ball.strokeColor.g, ball.strokeColor.b);
    strokeWeight(STROKE_WEIGHT);
    fill(ball.color.r, ball.color.g, ball.color.b);
    ellipse(ball.position.x, ball.position.y, ball.radius * 2, ball.radius * 2);

    // --- Luma-based text colour ---
    const luma = 0.299 * ball.color.r + 0.587 * ball.color.g + 0.114 * ball.color.b;
    if (luma >= 128) {
      fill(0);
    } else {
      fill(255);
    }

    // --- Fibonacci label centred inside the ball ---
    noStroke();
    textSize(8);
    textAlign(CENTER, CENTER);
    text(ball.fibonacciNumber, ball.position.x, ball.position.y);
  }

  // --- Task 3.1: Lifecycle-aware collision loop ---
  processCollisions(balls);

  // --- Task 3.4: Frame cleanup — remove balls below MIN_RADIUS ---
  for (let i = balls.length - 1; i >= 0; i--) {
    if (balls[i].radius < MIN_RADIUS) {
      balls.splice(i, 1);
    }
  }
}

/** Spawn a new ball at the mouse position when the canvas is clicked. */
function mousePressed() {
  spawnBallOnClick(balls, mouseX, mouseY, CANVAS_WIDTH, CANVAS_HEIGHT);
}

/**
 * Draw a cornflower-blue border around the full canvas.
 */
function drawFieldBorder() {
  push();
  noFill();
  stroke(88, 166, 255);
  strokeWeight(2);
  rect(1, 1, width - 2, height - 2);
  pop();
}

// Exported for Node.js (Jest) — guard prevents ReferenceError in the browser
if (typeof module !== 'undefined') {
  module.exports = {
    spawnBallOnClick,
    splitBall: splitBallLocal,
    eatBall: eatBallLocal,
    processCollisions,
    MIN_RADIUS: _MIN_RADIUS,
  };
}
