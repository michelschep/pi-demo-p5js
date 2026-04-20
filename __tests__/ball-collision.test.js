/**
 * TDD tests: Ball–Ball Collision
 *
 * Covers all five scenarios from openspec/changes/ball-collision/specs/ball-collision/spec.md:
 *
 *  1. Collision detected when distance ≤ 2 × BALL_RADIUS  → response is applied
 *  2. No collision when distance > 2 × BALL_RADIUS          → velocities unchanged
 *  3. Head-on collision swaps velocities along the collision axis
 *  4. Oblique collision adjusts only the normal component; tangential stays the same
 *  5. Overlap corrected → centers are exactly 2 × BALL_RADIUS apart after resolveCollision
 *
 * Constants (from src/ball.js spec):
 *   BALL_RADIUS = 12   →   collision diameter = 24
 */

const { Ball, BALL_RADIUS } = require('../src/ball');

// ---------------------------------------------------------------------------
// Helper: distance between two balls
// ---------------------------------------------------------------------------
function dist(a, b) {
  const dx = a.position.x - b.position.x;
  const dy = a.position.y - b.position.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// ---------------------------------------------------------------------------
// Scenario 1 – Collision detected when balls overlap
// ---------------------------------------------------------------------------
describe('Ball.resolveCollision – collision detection', () => {
  test('resolveCollision exists as a method on Ball instances', () => {
    const ball = new Ball({ x: 300, y: 200 }, { x: 0, y: 0 });
    expect(typeof ball.resolveCollision).toBe('function');
  });

  test('velocity changes when two balls overlap (distance < 2 × BALL_RADIUS)', () => {
    // Arrange – balls 20 px apart (overlap: 24 - 20 = 4 px), moving toward each other
    const ballA = new Ball({ x: 200, y: 200 }, { x: 4, y: 0 });
    const ballB = new Ball({ x: 220, y: 200 }, { x: -4, y: 0 });

    const vAxBefore = ballA.velocity.x;
    const vBxBefore = ballB.velocity.x;

    // Act
    ballA.resolveCollision(ballB);

    // Assert – at least one velocity must have changed
    const vAxChanged = Math.abs(ballA.velocity.x - vAxBefore) > 1e-9;
    const vBxChanged = Math.abs(ballB.velocity.x - vBxBefore) > 1e-9;
    expect(vAxChanged || vBxChanged).toBe(true);
  });

  test('resolveCollision is called symmetrically (both balls affected)', () => {
    // Arrange
    const ballA = new Ball({ x: 200, y: 200 }, { x: 5, y: 0 });
    const ballB = new Ball({ x: 220, y: 200 }, { x: -5, y: 0 });

    // Act
    ballA.resolveCollision(ballB);

    // Assert – both velocities must differ from their original values
    expect(ballA.velocity.x).not.toBeCloseTo(5);
    expect(ballB.velocity.x).not.toBeCloseTo(-5);
  });
});

// ---------------------------------------------------------------------------
// Scenario 2 – No collision when balls are far apart
// ---------------------------------------------------------------------------
describe('Ball.resolveCollision – no collision when out of range', () => {
  test('velocities are unchanged when distance > 2 × BALL_RADIUS', () => {
    // Arrange – balls 100 px apart (well outside collision range of 40 px)
    const ballA = new Ball({ x: 100, y: 200 }, { x: 3, y: 1 });
    const ballB = new Ball({ x: 200, y: 200 }, { x: -2, y: -1 });

    // Act
    ballA.resolveCollision(ballB);

    // Assert – velocities unchanged
    expect(ballA.velocity.x).toBeCloseTo(3);
    expect(ballA.velocity.y).toBeCloseTo(1);
    expect(ballB.velocity.x).toBeCloseTo(-2);
    expect(ballB.velocity.y).toBeCloseTo(-1);
  });

  test('velocities are unchanged when balls are moving away from each other even if touching', () => {
    // Arrange – exactly at collision boundary, already separating
    const ballA = new Ball({ x: 200, y: 200 }, { x: -3, y: 0 }); // moving left (away)
    const ballB = new Ball({ x: 224, y: 200 }, { x:  3, y: 0 }); // moving right (away)
    // distance = 24 = 2 × BALL_RADIUS; relative velocity along axis points away

    // Act
    ballA.resolveCollision(ballB);

    // Assert – no velocity swap since they are separating
    expect(ballA.velocity.x).toBeCloseTo(-3);
    expect(ballB.velocity.x).toBeCloseTo(3);
  });
});

// ---------------------------------------------------------------------------
// Scenario 3 – Head-on collision swaps velocities along collision axis
// ---------------------------------------------------------------------------
describe('Ball.resolveCollision – head-on collision', () => {
  test('head-on along x-axis: velocities are fully swapped', () => {
    // Arrange – balls aligned on x-axis, moving directly toward each other
    // distance = 20 px (< 24, so overlapping)
    const ballA = new Ball({ x: 200, y: 200 }, { x:  5, y: 0 });
    const ballB = new Ball({ x: 220, y: 200 }, { x: -5, y: 0 });

    // Act
    ballA.resolveCollision(ballB);

    // Assert – velocities along x-axis are exchanged
    expect(ballA.velocity.x).toBeCloseTo(-5);
    expect(ballB.velocity.x).toBeCloseTo(5);
  });

  test('head-on along y-axis: velocities are fully swapped', () => {
    // Arrange – balls aligned on y-axis, moving toward each other
    const ballA = new Ball({ x: 200, y: 200 }, { x: 0, y:  6 });
    const ballB = new Ball({ x: 200, y: 220 }, { x: 0, y: -6 });

    // Act
    ballA.resolveCollision(ballB);

    // Assert
    expect(ballA.velocity.y).toBeCloseTo(-6);
    expect(ballB.velocity.y).toBeCloseTo(6);
  });

  test('head-on: y-velocity (perpendicular) is not altered', () => {
    // Arrange – head-on along x, each has identical y-velocity
    const ballA = new Ball({ x: 200, y: 200 }, { x:  4, y: 2 });
    const ballB = new Ball({ x: 220, y: 200 }, { x: -4, y: 2 });

    // Act
    ballA.resolveCollision(ballB);

    // Assert – perpendicular (y) component unchanged
    expect(ballA.velocity.y).toBeCloseTo(2);
    expect(ballB.velocity.y).toBeCloseTo(2);
  });
});

// ---------------------------------------------------------------------------
// Scenario 4 – Oblique collision adjusts only the normal component
// ---------------------------------------------------------------------------
describe('Ball.resolveCollision – oblique collision', () => {
  test('tangential velocity component is preserved after oblique collision', () => {
    // Arrange – balls aligned on x-axis (normal = x-axis)
    // ballA moves diagonally right+down; ballB moves diagonally left+down
    // Tangential (y) component should be unchanged for both
    const ballA = new Ball({ x: 200, y: 200 }, { x:  3, y: 4 });
    const ballB = new Ball({ x: 220, y: 200 }, { x: -3, y: 4 });

    // Act
    ballA.resolveCollision(ballB);

    // Assert – y (tangential) component untouched; x (normal) swapped
    expect(ballA.velocity.y).toBeCloseTo(4);
    expect(ballB.velocity.y).toBeCloseTo(4);
    expect(ballA.velocity.x).toBeCloseTo(-3);
    expect(ballB.velocity.x).toBeCloseTo(3);
  });

  test('oblique 45-degree approach: only normal component is exchanged', () => {
    // Arrange – balls offset diagonally; normal vector is at 45 degrees
    // Place balls so their centres are exactly 20 px apart diagonally
    const offset = 20 / Math.SQRT2; // ≈ 21.21
    const ballA = new Ball({ x: 200,          y: 200 },          { x:  3, y:  3 });
    const ballB = new Ball({ x: 200 + offset, y: 200 + offset }, { x: -3, y: -3 });

    // Record tangential components (perpendicular to normal at 45°)
    // Tangential = projection onto (-1/√2, 1/√2)
    const tangA_before = (-ballA.velocity.x + ballA.velocity.y) / Math.SQRT2;
    const tangB_before = (-ballB.velocity.x + ballB.velocity.y) / Math.SQRT2;

    // Act
    ballA.resolveCollision(ballB);

    // Assert – tangential components unchanged
    const tangA_after = (-ballA.velocity.x + ballA.velocity.y) / Math.SQRT2;
    const tangB_after = (-ballB.velocity.x + ballB.velocity.y) / Math.SQRT2;

    expect(tangA_after).toBeCloseTo(tangA_before);
    expect(tangB_after).toBeCloseTo(tangB_before);
  });
});

// ---------------------------------------------------------------------------
// Scenario 5 – Overlap corrected after collision
// ---------------------------------------------------------------------------
describe('Ball.resolveCollision – overlap correction', () => {
  test('centers are exactly 2 × BALL_RADIUS apart after resolveCollision', () => {
    // Arrange – balls clearly overlapping (distance 20 < 24)
    const ballA = new Ball({ x: 200, y: 200 }, { x:  4, y: 0 });
    const ballB = new Ball({ x: 220, y: 200 }, { x: -4, y: 0 });

    // Act
    ballA.resolveCollision(ballB);

    // Assert
    expect(dist(ballA, ballB)).toBeCloseTo(2 * BALL_RADIUS);
  });

  test('each ball is pushed by half the overlap along the normal', () => {
    // Arrange – balls 20 px apart on x-axis; overlap = 24 - 20 = 4 → each moved 2 px
    const ballA = new Ball({ x: 200, y: 200 }, { x:  3, y: 0 });
    const ballB = new Ball({ x: 220, y: 200 }, { x: -3, y: 0 });

    // Act
    ballA.resolveCollision(ballB);

    // Assert – ballA pushed 2 px to the left, ballB pushed 2 px to the right
    expect(ballA.position.x).toBeCloseTo(198); // 200 - 2
    expect(ballB.position.x).toBeCloseTo(222); // 220 + 2
  });

  test('no position correction when balls are not overlapping', () => {
    // Arrange – balls well apart
    const ballA = new Ball({ x: 100, y: 200 }, { x: 1, y: 0 });
    const ballB = new Ball({ x: 200, y: 200 }, { x: -1, y: 0 });

    const posAxBefore = ballA.position.x;
    const posBxBefore = ballB.position.x;

    // Act
    ballA.resolveCollision(ballB);

    // Assert – positions unchanged
    expect(ballA.position.x).toBeCloseTo(posAxBefore);
    expect(ballB.position.x).toBeCloseTo(posBxBefore);
  });
});

// ---------------------------------------------------------------------------
// Per-instance radius – collision threshold r1 + r2 (spec update ball-lifecycle)
// ---------------------------------------------------------------------------
describe('Ball.resolveCollision – per-instance radius threshold', () => {
  test('collision triggers when distance ≤ r1+r2 for non-default radii', () => {
    // r1=10, r2=8 → threshold 18; place balls at distance 15 → should collide
    const ballA = new Ball({ x: 200, y: 200 }, { x: 4, y: 0 });
    const ballB = new Ball({ x: 215, y: 200 }, { x: -4, y: 0 });
    ballA.radius = 10;
    ballB.radius = 8;

    const vAxBefore = ballA.velocity.x;
    ballA.resolveCollision(ballB);

    expect(Math.abs(ballA.velocity.x - vAxBefore)).toBeGreaterThan(1e-9);
  });

  test('no collision when distance > r1+r2 even if < 2*BALL_RADIUS', () => {
    // r1=10, r2=8 → threshold 18; place at distance 20 → no collision desired
    // Current code uses 2*BALL_RADIUS=24 so collision IS triggered → test fails
    const ballA = new Ball({ x: 200, y: 200 }, { x: 3, y: 0 });
    const ballB = new Ball({ x: 220, y: 200 }, { x: -3, y: 0 });
    ballA.radius = 10;
    ballB.radius = 8;

    const vAxBefore = ballA.velocity.x;
    ballA.resolveCollision(ballB);

    expect(ballA.velocity.x).toBeCloseTo(vAxBefore);
  });
});
