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

  const windForce = calculateWind(frameCount);

  for (const ball of balls) {
    // --- Physics update ---
    ball.velocity = applyWind(ball.velocity, windForce);
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

  // --- Draw wind arrow with label ---
  const arrow = getWindArrow(windForce);
  drawWindArrow(arrow.dx);
}

/** Spawn a new ball at the mouse position when the canvas is clicked. */
function mousePressed() {
  spawnBallOnClick(balls, mouseX, mouseY, CANVAS_WIDTH, CANVAS_HEIGHT);
}

/**
 * Render a labelled horizontal wind arrow near the top-left of the canvas.
 * @param {number} dx  Signed arrow length in pixels (positive = right, negative = left)
 */
function drawWindArrow(dx) {
  const ORIGIN_X = 50;
  const ORIGIN_Y = 30;
  const TIP_X    = ORIGIN_X + dx;
  const HEAD_SIZE = 7;

  // Arrow shaft
  stroke(255, 220, 80);
  strokeWeight(2);
  line(ORIGIN_X, ORIGIN_Y, TIP_X, ORIGIN_Y);

  // Arrowhead triangle (skip when wind is effectively zero)
  if (Math.abs(dx) > 1) {
    const dir = dx > 0 ? 1 : -1;
    fill(255, 220, 80);
    noStroke();
    triangle(
      TIP_X,                          ORIGIN_Y,
      TIP_X - dir * HEAD_SIZE,        ORIGIN_Y - HEAD_SIZE / 2,
      TIP_X - dir * HEAD_SIZE,        ORIGIN_Y + HEAD_SIZE / 2
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
