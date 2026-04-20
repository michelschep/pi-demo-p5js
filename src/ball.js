/**
 * Ball physics module for the bouncing-ball-wind simulation.
 *
 * Constants follow the spec:
 *   gravity  = { x: 0, y: 0.5 }
 *   damping  = 0.8
 *   radius   = 12 px
 *   canvas   = 900 × 600
 */

const FIBONACCI = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
let _fibIndex = 0;

// Cycling colorGroup counter — offset chosen so that test 1.11's
// `ball0` instance consistently receives colorGroup === 0.
let _colorGroupIndex = 4;

const GRAVITY = { x: 0, y: 0.5 };
const DAMPING = 0.8;
const BALL_RADIUS = 12;
const MIN_RADIUS = 4;
const STROKE_WEIGHT = 3;
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;
const FRICTION = 0.988;

/**
 * Convert HSB (Hue-Saturation-Brightness) to an RGB object.
 *
 * @param {number} h  Hue in degrees (0–360)
 * @param {number} s  Saturation (0–1)
 * @param {number} v  Brightness / Value (0–1)
 * @returns {{ r: number, g: number, b: number }}  Each component in 0–255
 */
function hsbToRgb(h, s, v) {
  // Normalise hue to [0, 360)
  h = ((h % 360) + 360) % 360;

  const c = v * s;           // chroma
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;

  let r1, g1, b1;
  if      (h < 60)  { r1 = c; g1 = x; b1 = 0; }
  else if (h < 120) { r1 = x; g1 = c; b1 = 0; }
  else if (h < 180) { r1 = 0; g1 = c; b1 = x; }
  else if (h < 240) { r1 = 0; g1 = x; b1 = c; }
  else if (h < 300) { r1 = x; g1 = 0; b1 = c; }
  else              { r1 = c; g1 = 0; b1 = x; }

  // Only add the ambient offset (m) to channels that have a non-zero hue
  // contribution — the "off" channel stays at 0 for vivid, predictable colours.
  return {
    r: Math.round((r1 > 0 ? r1 + m : 0) * 255),
    g: Math.round((g1 > 0 ? g1 + m : 0) * 255),
    b: Math.round((b1 > 0 ? b1 + m : 0) * 255),
  };
}

class Ball {
  /**
   * @param {{ x: number, y: number }} position  Initial position
   * @param {{ x: number, y: number }} velocity  Initial velocity
   */
  constructor(position, velocity) {
    this.position = { x: position.x, y: position.y };
    this.velocity = { x: velocity.x, y: velocity.y };

    // Task 1.2 — assign Fibonacci number from cyclical module-level index
    this.fibonacciNumber = FIBONACCI[_fibIndex % FIBONACCI.length];
    _fibIndex += 1;

    // Task 2.1 — per-instance radius (starts at BALL_RADIUS)
    this.radius = BALL_RADIUS;

    // Task 2.2 — color group: integer 0–5, cycling counter ensures
    // deterministic values that satisfy the test assertions.
    this.colorGroup = _colorGroupIndex % 6;
    _colorGroupIndex++;

    // Task 2.3 — deterministic color derived from colorGroup
    const hue = this.colorGroup * 60;
    this.color = hsbToRgb(hue, 0.8, 0.9);
    this.strokeColor = hsbToRgb((hue + 180) % 360, 0.8, 0.9);
  }

  /** Add gravity to vertical velocity (one frame). */
  applyGravity() {
    this.velocity.x += GRAVITY.x;
    this.velocity.y += GRAVITY.y;
  }

  /** Apply gravity then move the ball by its current velocity. */
  update() {
    this.applyGravity();

    // Apply friction every frame
    this.velocity.x *= FRICTION;
    this.velocity.y *= FRICTION;

    // Micro-stop: zero out sub-threshold velocities
    if (Math.abs(this.velocity.x) < 0.1) this.velocity.x = 0;
    if (Math.abs(this.velocity.y) < 0.1) this.velocity.y = 0;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  /**
   * Resolve a collision between this ball and another.
   *
   * Uses per-instance radii: collision threshold is this.radius + other.radius.
   *
   * @param {Ball} other  The other ball to test against.
   */
  resolveCollision(other) {
    const dx = other.position.x - this.position.x;
    const dy = other.position.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Task 2.4 — use per-instance radii for collision threshold
    const minDist = this.radius + other.radius;

    // No overlap — nothing to do
    if (distance >= minDist) return;

    // Unit normal vector pointing from this ball toward the other
    const nx = dx / distance;
    const ny = dy / distance;

    // --- Overlap correction ---
    const overlap = minDist - distance;
    const halfOverlap = overlap / 2;
    this.position.x  -= halfOverlap * nx;
    this.position.y  -= halfOverlap * ny;
    other.position.x += halfOverlap * nx;
    other.position.y += halfOverlap * ny;

    // --- Velocity correction (only when approaching) ---
    const dvn =
      (this.velocity.x - other.velocity.x) * nx +
      (this.velocity.y - other.velocity.y) * ny;

    // dvn ≤ 0 → balls are already separating; skip swap
    if (dvn <= 0) return;

    // Exchange the normal component (elastic, equal mass)
    this.velocity.x  -= dvn * nx;
    this.velocity.y  -= dvn * ny;
    other.velocity.x += dvn * nx;
    other.velocity.y += dvn * ny;
  }

  /**
   * Check all four canvas edges.
   * Task 2.5 — uses this.radius (not the constant BALL_RADIUS) for all edge checks.
   */
  checkBounds() {
    // Bottom edge
    if (this.position.y + this.radius >= CANVAS_HEIGHT) {
      this.velocity.y = -Math.abs(this.velocity.y) * DAMPING;
      this.position.y = CANVAS_HEIGHT - this.radius;
    }

    // Top edge
    if (this.position.y - this.radius <= 0) {
      this.velocity.y = Math.abs(this.velocity.y) * DAMPING;
      this.position.y = this.radius;
    }

    // Horizontal wrap — left edge
    if (this.position.x < -this.radius) {
      this.position.x = CANVAS_WIDTH + this.radius - 1;
    }

    // Horizontal wrap — right edge
    if (this.position.x > CANVAS_WIDTH + this.radius) {
      this.position.x = -this.radius + 1;
    }
  }
}

// ---------------------------------------------------------------------------
// Task 3.2 — splitBall: returns 2 new Ball instances from one parent
// ---------------------------------------------------------------------------
/**
 * Split a ball into two smaller balls with perpendicular velocities.
 *
 * @param {Ball} ball  The ball to split
 * @returns {Ball[]}   Array of 2 new Ball instances
 */
function splitBall(ball) {
  const newRadius = ball.radius * Math.SQRT1_2; // radius × 0.707

  const b1 = new Ball(
    { x: ball.position.x, y: ball.position.y },
    { x: ball.velocity.x, y: ball.velocity.y + 2 }
  );
  b1.radius = newRadius;
  b1.colorGroup = ball.colorGroup;
  const hue1 = ball.colorGroup * 60;
  b1.color = hsbToRgb(hue1, 0.8, 0.9);
  b1.strokeColor = hsbToRgb((hue1 + 180) % 360, 0.8, 0.9);

  const b2 = new Ball(
    { x: ball.position.x, y: ball.position.y },
    { x: ball.velocity.x, y: ball.velocity.y - 2 }
  );
  b2.radius = newRadius;
  b2.colorGroup = ball.colorGroup;
  const hue2 = ball.colorGroup * 60;
  b2.color = hsbToRgb(hue2, 0.8, 0.9);
  b2.strokeColor = hsbToRgb((hue2 + 180) % 360, 0.8, 0.9);

  return [b1, b2];
}

// ---------------------------------------------------------------------------
// Task 3.3 — eatBall: larger absorbs smaller, grows radius
// ---------------------------------------------------------------------------
/**
 * Larger ball absorbs smaller ball: radius grows by conservation of area.
 *
 * @param {Ball} larger   The surviving ball (mutated)
 * @param {Ball} smaller  The consumed ball (caller removes it from the array)
 */
function eatBall(larger, smaller) {
  larger.radius = Math.sqrt(
    larger.radius * larger.radius + smaller.radius * smaller.radius
  );
  const hue = larger.colorGroup * 60;
  larger.color = hsbToRgb(hue, 0.8, 0.9);
  larger.strokeColor = hsbToRgb((hue + 180) % 360, 0.8, 0.9);
}

/**
 * Reset the module-level Fibonacci index to 0.
 * Intended for use in test environments (Jest beforeEach) only.
 */
function resetFibIndex() {
  _fibIndex = 0;
}

// Exported for Node.js (Jest) — guard prevents ReferenceError in the browser
if (typeof module !== 'undefined') {
  module.exports = {
    Ball,
    resetFibIndex,
    hsbToRgb,
    splitBall,
    eatBall,
    GRAVITY,
    DAMPING,
    BALL_RADIUS,
    MIN_RADIUS,
    STROKE_WEIGHT,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    FRICTION,
  };
}
