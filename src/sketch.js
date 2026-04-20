// pi-demo-p5js — main sketch
// Logic lives in src/ modules; this file wires them into the p5.js draw loop.

// In Node.js (Jest) environment, import Ball; in browser it is a global.
const _Ball = typeof Ball !== 'undefined'
  ? Ball
  : (typeof require !== 'undefined' ? require('./ball').Ball : undefined);

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

  // Task 5.1: Replace calculateWind(frameCount) with user-controlled getWindState()
  const windState  = typeof getWindState === 'function'
    ? getWindState()
    : { angleDeg: 0, strength: 0.1 };
  const windVector = getWindVector(windState.angleDeg, windState.strength);

  for (const ball of balls) {
    // --- Physics update ---
    // Task 5.2: applyWind with 2D windVector {x, y}
    ball.velocity = applyWind(ball.velocity, windVector);
    ball.update();
    ball.checkBounds();

    // --- Draw ball ---
    stroke(ball.strokeColor.r, ball.strokeColor.g, ball.strokeColor.b);
    strokeWeight(STROKE_WEIGHT);
    fill(ball.color.r, ball.color.g, ball.color.b);
    ellipse(ball.position.x, ball.position.y, BALL_RADIUS * 2, BALL_RADIUS * 2);

    // --- Task 2.1: Luma-based text colour ---
    // luma = 0.299·R + 0.587·G + 0.114·B  (ITU-R BT.601 standard)
    const luma = 0.299 * ball.color.r + 0.587 * ball.color.g + 0.114 * ball.color.b;
    if (luma >= 128) {
      fill(0);     // dark text on bright ball
    } else {
      fill(255);   // light text on dark ball
    }

    // --- Task 2.2: Fibonacci label centred inside the ball ---
    noStroke();
    textSize(11);
    textAlign(CENTER, CENTER);
    text(ball.fibonacciNumber, ball.position.x, ball.position.y);
  }

  // --- Resolve ball–ball collisions (unique pairs only) ---
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      balls[i].resolveCollision(balls[j]);
    }
  }

  // --- Draw wind arrow with label (Task 5.3: 2D arrow using dx and dy) ---
  const arrow = getWindArrow(windVector);
  drawWindArrow(arrow.dx, arrow.dy);
}

/** Spawn a new ball at the mouse position when the canvas is clicked. */
function mousePressed() {
  spawnBallOnClick(balls, mouseX, mouseY, CANVAS_WIDTH, CANVAS_HEIGHT);
}

/**
 * Render a labelled 2-D wind arrow near the top-left of the canvas.
 *
 * @param {number} dx  Horizontal arrow length in pixels (positive = right)
 * @param {number} dy  Vertical arrow length in pixels (positive = down)
 */
function drawWindArrow(dx, dy) {
  const ORIGIN_X = 50;
  const ORIGIN_Y = 30;
  const TIP_X    = ORIGIN_X + (dx || 0);
  const TIP_Y    = ORIGIN_Y + (dy || 0);
  const HEAD_SIZE = 7;

  const totalLen = Math.sqrt((dx || 0) ** 2 + (dy || 0) ** 2);

  // Arrow shaft
  stroke(255, 220, 80);
  strokeWeight(2);
  line(ORIGIN_X, ORIGIN_Y, TIP_X, TIP_Y);

  // Arrowhead triangle (skip when wind is effectively zero)
  if (totalLen > 1) {
    const ux = (dx || 0) / totalLen; // unit vector
    const uy = (dy || 0) / totalLen;
    // Perpendicular
    const px = -uy;
    const py =  ux;

    fill(255, 220, 80);
    noStroke();
    triangle(
      TIP_X,                                TIP_Y,
      TIP_X - ux * HEAD_SIZE + px * (HEAD_SIZE / 2),
      TIP_Y - uy * HEAD_SIZE + py * (HEAD_SIZE / 2),
      TIP_X - ux * HEAD_SIZE - px * (HEAD_SIZE / 2),
      TIP_Y - uy * HEAD_SIZE - py * (HEAD_SIZE / 2)
    );
  }

  // 'Wind' text label above the arrow origin
  noStroke();
  fill(255, 220, 80);
  textSize(12);
  textAlign(LEFT, BOTTOM);
  text('Wind', ORIGIN_X, ORIGIN_Y - 4);
}

// Exported for Node.js (Jest) — guard prevents ReferenceError in the browser
if (typeof module !== 'undefined') {
  module.exports = { spawnBallOnClick };
}
