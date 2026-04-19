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

class Ball {
  /**
   * @param {{ x: number, y: number }} position  Initial position
   * @param {{ x: number, y: number }} velocity  Initial velocity
   */
  constructor(position, velocity) {
    this.position = { x: position.x, y: position.y };
    this.velocity = { x: velocity.x, y: velocity.y };
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
  module.exports = { Ball, GRAVITY, DAMPING, BALL_RADIUS, CANVAS_WIDTH, CANVAS_HEIGHT };
}
