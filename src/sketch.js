// pi-demo-p5js — main sketch
// Logic lives in src/ modules; this file wires them into the p5.js draw loop.

let ball;

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  ball = new Ball(
    { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
    { x: 2, y: 0 }
  );
}

function draw() {
  background(15, 17, 23);

  // --- Physics update ---
  const windForce = calculateWind(frameCount);
  ball.velocity = applyWind(ball.velocity, windForce);
  ball.update();
  ball.checkBounds();

  // --- Draw ball ---
  noStroke();
  fill(100, 180, 255);
  ellipse(ball.position.x, ball.position.y, BALL_RADIUS * 2, BALL_RADIUS * 2);

  // --- Draw wind arrow with label ---
  const arrow = getWindArrow(windForce);
  drawWindArrow(arrow.dx);
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
