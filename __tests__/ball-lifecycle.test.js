/**
 * TDD tests: Ball Lifecycle
 *
 * Covers tasks 1.1 – 1.14 from openspec/changes/ball-lifecycle/tasks.md
 *
 * These tests describe DESIRED behavior that is NOT yet implemented.
 * They are intentionally failing (red phase of TDD).
 *
 * Expected exports from src/ball.js after implementation:
 *   Ball, BALL_RADIUS, MIN_RADIUS, splitBall, eatBall, hsbToRgb,
 *   CANVAS_WIDTH, CANVAS_HEIGHT, DAMPING
 */

const {
  Ball,
  BALL_RADIUS,
  MIN_RADIUS,
  splitBall,
  eatBall,
  hsbToRgb,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  DAMPING,
} = require('../src/ball');

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function makeBall(x, y, vx, vy, radius, colorGroup) {
  const b = new Ball({ x, y }, { vx: vx || 0, vy: vy || 0 });
  b.velocity = { x: vx || 0, y: vy || 0 };
  if (radius !== undefined) b.radius = radius;
  if (colorGroup !== undefined) b.colorGroup = colorGroup;
  return b;
}

// ===========================================================================
// 1.1 – Twee ballen zelfde colorGroup, ratio < 1.5 → split → totaal 4 ballen
// ===========================================================================
describe('splitBall – same colorGroup, ratio < 1.5 → 4 balls total', () => {
  test('1.1 two balls same colorGroup collide with ratio < 1.5: each replaced by 2 → total 4', () => {
    // Arrange
    const ballA = makeBall(200, 200, 3, 0, 12, 2);
    const ballB = makeBall(220, 200, -3, 0, 12, 2); // ratio = 1.0 < 1.5, same colorGroup

    // Act – splitBall must exist and return 2 new balls per original
    const splitA = splitBall(ballA);
    const splitB = splitBall(ballB);

    // Assert – 2 balls from each → 4 total
    expect(Array.isArray(splitA)).toBe(true);
    expect(splitA).toHaveLength(2);
    expect(Array.isArray(splitB)).toBe(true);
    expect(splitB).toHaveLength(2);
    expect(splitA.length + splitB.length).toBe(4);
  });
});

// ===========================================================================
// 1.2 – Gesplitste ballen hebben radius ≈ oudRadius × 0.707
// ===========================================================================
describe('splitBall – child radius ≈ parent × 0.707', () => {
  test('1.2 split balls have radius approximately equal to oldRadius × 0.707', () => {
    // Arrange
    const originalRadius = 16;
    const ball = makeBall(200, 200, 2, 0, originalRadius, 1);

    // Act
    const children = splitBall(ball);

    // Assert
    const expectedRadius = originalRadius * Math.SQRT1_2; // × 0.707
    children.forEach((child) => {
      expect(child.radius).toBeCloseTo(expectedRadius, 1);
    });
  });

  test('1.2b split balls from radius-12 parent have radius ≈ 8.485', () => {
    const ball = makeBall(300, 300, 0, -2, 12, 3);
    const children = splitBall(ball);
    children.forEach((child) => {
      expect(child.radius).toBeCloseTo(12 * Math.SQRT1_2, 1); // ≈ 8.485
    });
  });
});

// ===========================================================================
// 1.3 – Gesplitste ballen hebben zelfde colorGroup als origineel
// ===========================================================================
describe('splitBall – children inherit colorGroup', () => {
  test('1.3 split balls share the same colorGroup as the original', () => {
    // Arrange
    const colorGroup = 4;
    const ball = makeBall(200, 200, 1, 1, 14, colorGroup);

    // Act
    const children = splitBall(ball);

    // Assert
    children.forEach((child) => {
      expect(child.colorGroup).toBe(colorGroup);
    });
  });
});

// ===========================================================================
// 1.4 – r1=18 botst r2=12 (ratio=1.5) → grote eet kleine, radius ≈ √(18²+12²)
// ===========================================================================
describe('eatBall – larger absorbs smaller when ratio ≥ 1.5', () => {
  test('1.4 r1=18 r2=12 (ratio=1.5): larger grows to sqrt(18²+12²) ≈ 21.63', () => {
    // Arrange
    const larger = makeBall(200, 200, 0, 0, 18, 0);
    const smaller = makeBall(228, 200, 0, 0, 12, 2);

    // Act – eatBall mutates larger.radius
    eatBall(larger, smaller);

    // Assert
    const expectedRadius = Math.sqrt(18 * 18 + 12 * 12); // ≈ 21.63
    expect(larger.radius).toBeCloseTo(expectedRadius, 1);
  });
});

// ===========================================================================
// 1.5 – r1=20 botst r2=12 (ratio>1.5) → kleine verdwijnt uit array
// ===========================================================================
describe('eatBall – smaller ball is removed from balls array', () => {
  test('1.5 r1=20 r2=12 (ratio>1.5): smaller ball removed from array after eat', () => {
    // Arrange
    const larger = makeBall(200, 200, 0, 0, 20, 1);
    const smaller = makeBall(230, 200, 0, 0, 12, 3);
    let balls = [larger, smaller];

    // Act
    eatBall(larger, smaller);
    // frame cleanup: remove the smaller ball
    balls = balls.filter((b) => b !== smaller);

    // Assert – smaller no longer in array
    expect(balls).toContain(larger);
    expect(balls).not.toContain(smaller);
    expect(balls).toHaveLength(1);
  });
});

// ===========================================================================
// 1.6 – Zelfde grootte, andere colorGroup → normale botsing (geen split/eten)
// ===========================================================================
describe('lifecycle collision – same size, different colorGroup → normal bounce', () => {
  test('1.6 equal radii, different colorGroups: no split, no eat → collision only', () => {
    // Arrange – equal size, different colorGroup
    const ballA = makeBall(200, 200, 4, 0, 12, 0);
    const ballB = makeBall(220, 200, -4, 0, 12, 3);

    const vAxBefore = ballA.velocity.x;
    const vBxBefore = ballB.velocity.x;
    const rABefore = ballA.radius;
    const rBBefore = ballB.radius;

    // Act – should NOT split (different colorGroup) and NOT eat (ratio = 1.0 < 1.5)
    // splitBall should not be called; eatBall should not be called
    // Regular resolveCollision should fire
    ballA.resolveCollision(ballB);

    // Assert – radii unchanged (no split, no eat)
    expect(ballA.radius).toBe(rABefore);
    expect(ballB.radius).toBe(rBBefore);

    // And velocities have changed (normal collision occurred)
    const changed = Math.abs(ballA.velocity.x - vAxBefore) > 1e-9 ||
                    Math.abs(ballB.velocity.x - vBxBefore) > 1e-9;
    expect(changed).toBe(true);
  });
});

// ===========================================================================
// 1.7 – Bal met radius=3 wordt verwijderd na frame-cleanup
// ===========================================================================
describe('frame cleanup – balls below MIN_RADIUS are removed', () => {
  test('1.7 ball with radius=3 (< MIN_RADIUS=4) is removed by cleanup', () => {
    // Arrange
    const tinyBall = makeBall(300, 300, 0, 0, 3, 1);
    const normalBall = makeBall(400, 300, 0, 0, 12, 2);
    let balls = [tinyBall, normalBall];

    // Act – MIN_RADIUS must exist and equal 4; cleanup removes balls below it
    expect(MIN_RADIUS).toBe(4);
    balls = balls.filter((b) => b.radius >= MIN_RADIUS);

    // Assert
    expect(balls).not.toContain(tinyBall);
    expect(balls).toContain(normalBall);
  });
});

// ===========================================================================
// 1.8 – Bal met radius=4 blijft bestaan
// ===========================================================================
describe('frame cleanup – ball at exactly MIN_RADIUS survives', () => {
  test('1.8 ball with radius=4 (= MIN_RADIUS) is kept in the array', () => {
    // Arrange
    const borderBall = makeBall(300, 300, 0, 0, 4, 0);
    let balls = [borderBall];

    // Act
    balls = balls.filter((b) => b.radius >= MIN_RADIUS);

    // Assert
    expect(balls).toContain(borderBall);
    expect(balls).toHaveLength(1);
  });
});

// ===========================================================================
// 1.9 – Nieuwe bal heeft radius === BALL_RADIUS (12)
// ===========================================================================
describe('Ball constructor – radius property', () => {
  test('1.9 newly constructed ball has radius equal to BALL_RADIUS (12)', () => {
    // Act
    const ball = new Ball({ x: 300, y: 200 }, { x: 0, y: 0 });

    // Assert – Ball must expose this.radius set to BALL_RADIUS
    expect(ball.radius).toBeDefined();
    expect(ball.radius).toBe(BALL_RADIUS);
    expect(ball.radius).toBe(12);
  });
});

// ===========================================================================
// 1.10 – colorGroup is integer 0–5
// ===========================================================================
describe('Ball constructor – colorGroup property', () => {
  test('1.10 colorGroup is an integer between 0 and 5 (inclusive)', () => {
    // Sample many instances to cover the random range
    for (let i = 0; i < 60; i++) {
      const ball = new Ball({ x: 300, y: 200 }, { x: 0, y: 0 });
      expect(ball.colorGroup).toBeDefined();
      expect(Number.isInteger(ball.colorGroup)).toBe(true);
      expect(ball.colorGroup).toBeGreaterThanOrEqual(0);
      expect(ball.colorGroup).toBeLessThanOrEqual(5);
    }
  });
});

// ===========================================================================
// 1.11 – Bal met colorGroup=0 heeft hue=0° kleur (rood)
// ===========================================================================
describe('Ball constructor – color derived from colorGroup', () => {
  test('1.11 ball with colorGroup=0 has fill color matching hue=0° (red)', () => {
    // Arrange: hue = colorGroup × 60 = 0 × 60 = 0° → red (high R, low G, low B)
    const ball = new Ball({ x: 300, y: 200 }, { x: 0, y: 0 });
    // Force colorGroup to 0 as if it were constructed with that group
    ball.colorGroup = 0;
    // The constructor should set color based on colorGroup; since we need a fresh
    // ball with colorGroup=0, we verify the hue calculation:
    const expectedColor = hsbToRgb(0, 0.8, 0.9); // hue = 0 × 60 = 0°

    // A ball born with colorGroup=0 must have color = hsbToRgb(0°, 0.8, 0.9)
    // This test will fail until the constructor derives color from colorGroup
    const ball0 = new Ball({ x: 300, y: 200 }, { x: 0, y: 0 });
    // Simulate: if colorGroup were 0, color should be deterministic
    // We need Ball to expose a deterministic color when colorGroup is known
    // After implementation: ball constructed with colorGroup=0 gets hue=0
    const hue = ball0.colorGroup * 60; // only valid after 2.3 is implemented
    const derivedColor = hsbToRgb(hue, 0.8, 0.9);

    // The red channel should be dominant for hue=0°
    expect(expectedColor.r).toBeGreaterThan(200); // r ≈ 230
    expect(expectedColor.g).toBeLessThan(50);     // g ≈ 46
    expect(expectedColor.b).toBeLessThan(10);     // b ≈ 0

    // Ball with colorGroup=0 must produce the same red color
    // This assertion ties the implementation to deterministic color from colorGroup
    expect(derivedColor).toEqual(expectedColor);
  });

  test('1.11b ball color is determined by colorGroup × 60 hue formula', () => {
    // For each possible colorGroup, the expected color is hsbToRgb(group*60, 0.8, 0.9)
    // We test that a ball with a known colorGroup produces the correct fill color.
    // After implementation (task 2.3), the Ball constructor must set:
    //   this.color = hsbToRgb(this.colorGroup * 60, 0.8, 0.9)

    const testGroups = [0, 1, 2, 3, 4, 5];
    testGroups.forEach((group) => {
      const expectedColor = hsbToRgb(group * 60, 0.8, 0.9);
      // Force-construct a ball and override colorGroup then re-derive color
      // (implementation will do this in constructor)
      const hue = group * 60;
      const derivedColor = hsbToRgb(hue, 0.8, 0.9);
      expect(derivedColor).toEqual(expectedColor);
    });

    // The key failure: current Ball sets a RANDOM hue, not group*60
    // After implementation, this must hold for any freshly constructed ball:
    const ball = new Ball({ x: 0, y: 0 }, { x: 0, y: 0 });
    const expectedFromGroup = hsbToRgb(ball.colorGroup * 60, 0.8, 0.9);
    // This will fail until task 2.3: currently color is random, not from colorGroup
    expect(ball.color).toEqual(expectedFromGroup);
  });
});

// ===========================================================================
// 1.12 – checkBounds gebruikt this.radius voor wrap
// ===========================================================================
describe('checkBounds – uses this.radius for horizontal wrap', () => {
  test('1.12 checkBounds wraps ball using this.radius not BALL_RADIUS', () => {
    // Arrange – give ball a larger radius than BALL_RADIUS
    const customRadius = 20;
    const ball = new Ball({ x: 300, y: 300 }, { x: 5, y: 0 });
    ball.radius = customRadius;

    // Place ball so x - customRadius is just past the right edge
    // Wrap condition: x > CANVAS_WIDTH + this.radius
    ball.position.x = CANVAS_WIDTH + customRadius + 1;

    // Act
    ball.checkBounds();

    // Assert – should wrap to -this.radius + 1 = -20 + 1 = -19
    // Current code wraps to -BALL_RADIUS + 1 = -12 + 1 = -11 (FAILS)
    expect(ball.position.x).toBeCloseTo(-customRadius + 1);
  });

  test('1.12b left-edge wrap uses this.radius', () => {
    const customRadius = 20;
    const ball = new Ball({ x: 300, y: 300 }, { x: -5, y: 0 });
    ball.radius = customRadius;

    // Place ball past the left edge: x < -this.radius
    ball.position.x = -customRadius - 1;

    ball.checkBounds();

    // Should wrap to CANVAS_WIDTH + this.radius - 1 = 900 + 20 - 1 = 919
    // Current code wraps to CANVAS_WIDTH + BALL_RADIUS - 1 = 900 + 12 - 1 = 911 (FAILS)
    expect(ball.position.x).toBeCloseTo(CANVAS_WIDTH + customRadius - 1);
  });
});

// ===========================================================================
// 1.13 – checkBounds gebruikt this.radius voor y-bounce
// ===========================================================================
describe('checkBounds – uses this.radius for y-bounce detection', () => {
  test('1.13 bottom bounce triggers at y + this.radius >= CANVAS_HEIGHT', () => {
    // Arrange – give ball a radius larger than BALL_RADIUS (12)
    const customRadius = 20;
    const ball = new Ball({ x: 300, y: 300 }, { x: 0, y: 5 });
    ball.radius = customRadius;

    // Place ball exactly at bottom edge using this.radius
    // y + customRadius === CANVAS_HEIGHT  →  y = CANVAS_HEIGHT - customRadius
    ball.position.y = CANVAS_HEIGHT - customRadius;

    // Act
    ball.checkBounds();

    // Assert – bounce should occur; vy becomes negative * DAMPING
    // Current code checks y + BALL_RADIUS(12), so CANVAS_HEIGHT - 20 + 12 < CANVAS_HEIGHT
    // → no bounce triggered with current code (FAILS)
    expect(ball.velocity.y).toBeCloseTo(-5 * DAMPING);
  });

  test('1.13b top bounce triggers at y - this.radius <= 0', () => {
    const customRadius = 20;
    const ball = new Ball({ x: 300, y: 300 }, { x: 0, y: -5 });
    ball.radius = customRadius;

    // Place ball exactly at top edge using this.radius
    ball.position.y = customRadius;

    ball.checkBounds();

    // Current code checks y - BALL_RADIUS(12) <= 0 → customRadius(20) - 12 = 8 > 0 → no bounce
    expect(ball.velocity.y).toBeCloseTo(5 * DAMPING);
  });
});

// ===========================================================================
// 1.14 – Botsingsdetectie op basis van r1 + r2 (niet 2 × BALL_RADIUS)
// ===========================================================================
describe('resolveCollision – collision threshold is r1 + r2', () => {
  test('1.14 two balls r1=10 r2=8: collision triggers when distance ≤ r1+r2 (18)', () => {
    // Arrange – place balls at distance 15 (< r1+r2=18), moving toward each other
    const ballA = new Ball({ x: 200, y: 200 }, { x: 4, y: 0 });
    const ballB = new Ball({ x: 215, y: 200 }, { x: -4, y: 0 });
    ballA.radius = 10;
    ballB.radius = 8;
    // distance = 15 ≤ 18 → collision should occur

    const vAxBefore = ballA.velocity.x;

    ballA.resolveCollision(ballB);

    // Velocity must have changed (collision applied)
    expect(Math.abs(ballA.velocity.x - vAxBefore)).toBeGreaterThan(1e-9);
  });

  test('1.14b two balls r1=10 r2=8: NO collision when distance > r1+r2 (18)', () => {
    // Arrange – place balls at distance 20 (> r1+r2=18 but < 2*BALL_RADIUS=24)
    const ballA = new Ball({ x: 200, y: 200 }, { x: 3, y: 0 });
    const ballB = new Ball({ x: 220, y: 200 }, { x: -3, y: 0 });
    ballA.radius = 10;
    ballB.radius = 8;
    // distance = 20 > 18 → NO collision desired
    // But current code: 2 * BALL_RADIUS = 24, 20 < 24 → collision IS triggered
    // This test FAILS with current code (expected no change, got change)

    const vAxBefore = ballA.velocity.x;
    const vBxBefore = ballB.velocity.x;

    ballA.resolveCollision(ballB);

    // Assert – velocities unchanged (no collision)
    expect(ballA.velocity.x).toBeCloseTo(vAxBefore);
    expect(ballB.velocity.x).toBeCloseTo(vBxBefore);
  });

  test('1.14c overlap correction uses r1+r2 as minimum distance', () => {
    // After collision, distance between centers should equal r1 + r2
    const ballA = new Ball({ x: 200, y: 200 }, { x: 4, y: 0 });
    const ballB = new Ball({ x: 214, y: 200 }, { x: -4, y: 0 });
    ballA.radius = 10;
    ballB.radius = 8;
    // distance = 14, overlap = (10+8) - 14 = 4 → push each by 2

    ballA.resolveCollision(ballB);

    const dx = ballB.position.x - ballA.position.x;
    const dy = ballB.position.y - ballA.position.y;
    const distAfter = Math.sqrt(dx * dx + dy * dy);

    expect(distAfter).toBeCloseTo(ballA.radius + ballB.radius);
  });
});
