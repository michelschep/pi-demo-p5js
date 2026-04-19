/**
 * Ball physics module for the bouncing-ball-wind simulation.
 *
 * Constants follow the spec:
 *   gravity  = { x: 0, y: 0.5 }
 *   damping  = 0.8
 *   radius   = 20 px
 *   canvas   = 600 × 400
 */

const GRAVITY = { x: 0, y: 0.5 };
const DAMPING = 0.8;
const BALL_RADIUS = 20;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

/**
 * Convert HSB (Hue-Saturation-Brightness) to an RGB object.
 *
 * Task 1.1 — hsbToRgb helper
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

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
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

    // Task 1.2 — assign a unique random color at construction time
    this.color = hsbToRgb(Math.random() * 360, 0.8, 0.9);
  }

  /** Add gravity to vertical velocity (one frame). */
  applyGravity() {
    this.velocity.x += GRAVITY.x;
    this.velocity.y += GRAVITY.y;
  }

  /** Apply gravity then move the ball by its current velocity. */
  update() {
    this.applyGravity();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  /**
   * Resolve a collision between this ball and another.
   *
   * Algorithm (elastic collision, equal mass, normal-projection method):
   *   1. Compute normal vector n from this ball toward the other.
   *   2. If distance ≥ 2 × BALL_RADIUS — no overlap, nothing to do.
   *   3. Correct positions: push each ball outward by half the overlap.
   *   4. Compute relative velocity along the normal (dvn).
   *   5. If dvn ≤ 0 the balls are already separating — skip velocity swap.
   *   6. Exchange the normal velocity component between both balls.
   *
   * @param {Ball} other  The other ball to test against.
   */
  resolveCollision(other) {
    const dx = other.position.x - this.position.x;
    const dy = other.position.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // No overlap — nothing to do
    if (distance >= 2 * BALL_RADIUS) return;

    // Unit normal vector pointing from this ball toward the other
    const nx = dx / distance;
    const ny = dy / distance;

    // --- Overlap correction ---
    const overlap = 2 * BALL_RADIUS - distance;
    const halfOverlap = overlap / 2;
    this.position.x  -= halfOverlap * nx;
    this.position.y  -= halfOverlap * ny;
    other.position.x += halfOverlap * nx;
    other.position.y += halfOverlap * ny;

    // --- Velocity correction (only when approaching) ---
    // dvn = projection of relative velocity onto the normal
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
   * On collision: flip the relevant velocity component and apply damping,
   * then correct the position so the ball stays inside the canvas.
   */
  checkBounds() {
    // Bottom edge
    if (this.position.y + BALL_RADIUS >= CANVAS_HEIGHT) {
      this.velocity.y = -Math.abs(this.velocity.y) * DAMPING;
      this.position.y = CANVAS_HEIGHT - BALL_RADIUS;
    }

    // Top edge
    if (this.position.y - BALL_RADIUS <= 0) {
      this.velocity.y = Math.abs(this.velocity.y) * DAMPING;
      this.position.y = BALL_RADIUS;
    }

    // Left edge
    if (this.position.x - BALL_RADIUS <= 0) {
      this.velocity.x = Math.abs(this.velocity.x) * DAMPING;
      this.position.x = BALL_RADIUS;
    }

    // Right edge
    if (this.position.x + BALL_RADIUS >= CANVAS_WIDTH) {
      this.velocity.x = -Math.abs(this.velocity.x) * DAMPING;
      this.position.x = CANVAS_WIDTH - BALL_RADIUS;
    }
  }
}

// Exported for Node.js (Jest) — guard prevents ReferenceError in the browser
if (typeof module !== 'undefined') {
  module.exports = { Ball, hsbToRgb, GRAVITY, DAMPING, BALL_RADIUS, CANVAS_WIDTH, CANVAS_HEIGHT };
}
