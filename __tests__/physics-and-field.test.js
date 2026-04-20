/**
 * TDD tests: Physics & Field — openspec/changes/physics-and-field
 *
 * Tasks 1.1 – 1.17
 *
 * Covers:
 *  1.1  BALL_RADIUS is 12
 *  1.2  CANVAS_WIDTH is 900, CANVAS_HEIGHT is 600
 *  1.3  Horizontal wrap right: pos > CANVAS_WIDTH + radius → -radius + 1
 *  1.4  Horizontal wrap left:  pos < -radius             → CANVAS_WIDTH + radius - 1
 *  1.5  No x-velocity reversal at right edge
 *  1.6  Friction: velocity.x after 1 frame = startVx × 0.988
 *  1.7  Friction: velocity.y after 1 frame = (startVy + gravity) × 0.988
 *  1.8  Micro-stop: velocity.x = 0.05 → 0 after update
 *  1.9  Ball comes to rest: after 600 frames without wind velocity.x ≈ 0
 *  1.10 Y-bounce still works: bottom edge bounces back
 *  1.11 getWindVector(180, 0.1) → {x: 0,    y: -0.1} (Z = omhoog)
 *  1.12 getWindVector(0,   0.1) → {x: 0,    y: +0.1} (N = omlaag)
 *  1.13 getWindVector(90,  0.1) → {x: -0.1, y:  0  } (O = naar links)
 *  1.14 getWindVector(270, 0.1) → {x: +0.1, y:  0  } (W = naar rechts)
 *  1.15 getWindVector(0,   0  ) → {x: 0,    y:  0  } (windstilte)
 *  1.16 drawFieldBorder() function exists in sketch.js
 *  1.17 drawFieldBorder() is called inside draw() in sketch.js
 */

const fs   = require('fs');
const path = require('path');

const { Ball, BALL_RADIUS, CANVAS_WIDTH, CANVAS_HEIGHT } = require('../src/ball');
const { getWindVector }                                   = require('../src/wind');

// ---------------------------------------------------------------------------
// 1.1  BALL_RADIUS is 12
// ---------------------------------------------------------------------------
describe('1.1 – BALL_RADIUS constant', () => {
  test('BALL_RADIUS is 12', () => {
    // Arrange / Act — imported directly from the module
    // Assert
    expect(BALL_RADIUS).toBe(12);
  });
});

// ---------------------------------------------------------------------------
// 1.2  Canvas dimensions: 900 × 600
// ---------------------------------------------------------------------------
describe('1.2 – Canvas dimension constants', () => {
  test('CANVAS_WIDTH is 900', () => {
    expect(CANVAS_WIDTH).toBe(900);
  });

  test('CANVAS_HEIGHT is 600', () => {
    expect(CANVAS_HEIGHT).toBe(600);
  });
});

// ---------------------------------------------------------------------------
// 1.3  Horizontal wrap — right edge
// ---------------------------------------------------------------------------
describe('1.3 – Wrap right: positie > CANVAS_WIDTH + radius', () => {
  test('position.x becomes -BALL_RADIUS + 1 when ball exits right side', () => {
    // Arrange — place centre just past the right wrap threshold
    const startX = CANVAS_WIDTH + BALL_RADIUS + 1;
    const ball   = new Ball({ x: startX, y: 300 }, { x: 5, y: 0 });

    // Act
    ball.checkBounds();

    // Assert — ball wraps to the left side
    expect(ball.position.x).toBe(-BALL_RADIUS + 1);
  });
});

// ---------------------------------------------------------------------------
// 1.4  Horizontal wrap — left edge
// ---------------------------------------------------------------------------
describe('1.4 – Wrap left: positie < -radius', () => {
  test('position.x becomes CANVAS_WIDTH + BALL_RADIUS - 1 when ball exits left side', () => {
    // Arrange — place centre just past the left wrap threshold
    const startX = -(BALL_RADIUS + 1);
    const ball   = new Ball({ x: startX, y: 300 }, { x: -5, y: 0 });

    // Act
    ball.checkBounds();

    // Assert — ball wraps to the right side
    expect(ball.position.x).toBe(CANVAS_WIDTH + BALL_RADIUS - 1);
  });
});

// ---------------------------------------------------------------------------
// 1.5  No x-velocity reversal at right edge
// ---------------------------------------------------------------------------
describe('1.5 – Geen x-kaatsing bij rechterrand', () => {
  test('velocity.x is NOT negated when ball reaches the right edge', () => {
    // Arrange — ball touching the right edge, moving rightward
    const ball = new Ball(
      { x: CANVAS_WIDTH - BALL_RADIUS, y: 300 },
      { x: 7, y: 0 }
    );
    const vxBefore = ball.velocity.x;

    // Act
    ball.checkBounds();

    // Assert — x-velocity must remain positive (no bounce / reversal)
    expect(ball.velocity.x).toBeGreaterThan(0);
    expect(ball.velocity.x).toBeCloseTo(vxBefore);
  });
});

// ---------------------------------------------------------------------------
// 1.6  Friction — velocity.x × 0.988 per frame
// ---------------------------------------------------------------------------
describe('1.6 – Wrijving velocity.x', () => {
  test('velocity.x after 1 update = startVx × 0.988', () => {
    // Arrange — gravity does not affect x, so friction is the only change
    const startVx = 4;
    const ball    = new Ball({ x: 450, y: 300 }, { x: startVx, y: 0 });

    // Act
    ball.update();

    // Assert
    expect(ball.velocity.x).toBeCloseTo(startVx * 0.988, 5);
  });
});

// ---------------------------------------------------------------------------
// 1.7  Friction — velocity.y × 0.988 per frame (after gravity applied)
// ---------------------------------------------------------------------------
describe('1.7 – Wrijving velocity.y', () => {
  test('velocity.y after 1 update = (startVy + 0.5) × 0.988', () => {
    // Arrange — gravity adds 0.5 to vy, then friction multiplies by 0.988
    const startVy = 3;
    const ball    = new Ball({ x: 450, y: 300 }, { x: 0, y: startVy });

    // Act
    ball.update();

    // Assert — (startVy + gravity) * FRICTION = (3 + 0.5) * 0.988 = 3.458
    expect(ball.velocity.y).toBeCloseTo((startVy + 0.5) * 0.988, 5);
  });
});

// ---------------------------------------------------------------------------
// 1.8  Micro-stop: velocity.x = 0.05 → 0 after one update
// ---------------------------------------------------------------------------
describe('1.8 – Micro-stop velocity.x', () => {
  test('velocity.x of 0.05 is clamped to 0 after one update', () => {
    // Arrange — velocity below the 0.1 threshold
    const ball = new Ball({ x: 450, y: 300 }, { x: 0.05, y: 0 });

    // Act
    ball.update();

    // Assert — component below threshold must be zeroed
    expect(ball.velocity.x).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 1.9  Ball comes to rest: velocity.x ≈ 0 after 600 frames without wind
// ---------------------------------------------------------------------------
describe('1.9 – Bal tot rust na 600 frames', () => {
  test('velocity.x is approximately 0 after 600 update() calls without wind', () => {
    // Arrange — reasonable starting horizontal velocity, no checkBounds to avoid
    // wall interactions that might complicate the friction test
    const ball = new Ball({ x: 450, y: 300 }, { x: 2, y: 0 });

    // Act — 600 frames of pure physics update (no wind, no bounds check)
    for (let i = 0; i < 600; i++) {
      ball.update();
    }

    // Assert — friction + micro-stop must have killed horizontal motion
    expect(Math.abs(ball.velocity.x)).toBeCloseTo(0, 1);
  });
});

// ---------------------------------------------------------------------------
// 1.10  Y-bounce regression: bottom edge still bounces back
// ---------------------------------------------------------------------------
describe('1.10 – Y-kaatsing blijft werken (onderkant)', () => {
  test('velocity.y is negated (with damping) when ball hits bottom edge', () => {
    // Arrange — ball exactly at the bottom edge, moving downward
    const ball = new Ball(
      { x: 450, y: CANVAS_HEIGHT - BALL_RADIUS },
      { x: 0, y: 6 }
    );

    // Act
    ball.checkBounds();

    // Assert — y-velocity must become negative (bounce upward)
    expect(ball.velocity.y).toBeLessThan(0);
  });

  test('position.y is corrected to stay within canvas after bottom bounce', () => {
    // Arrange — ball slightly past bottom edge
    const ball = new Ball(
      { x: 450, y: CANVAS_HEIGHT - BALL_RADIUS + 3 },
      { x: 0, y: 8 }
    );

    // Act
    ball.checkBounds();

    // Assert
    expect(ball.position.y).toBeLessThanOrEqual(CANVAS_HEIGHT - BALL_RADIUS);
  });
});

// ---------------------------------------------------------------------------
// 1.11  getWindVector(180, 0.1) → {x: 0, y: -0.1}  (Z = omhoog)
// ---------------------------------------------------------------------------
describe('1.11 – getWindVector(180, 0.1) — Zuid-wind gaat omhoog', () => {
  test('returns {x ≈ 0, y ≈ -0.1}', () => {
    // Arrange
    const angleDeg = 180;
    const strength = 0.1;

    // Act
    const vector = getWindVector(angleDeg, strength);

    // Assert — new formula: x = -sin(180°)*s = 0, y = cos(180°)*s = -s
    expect(vector.x).toBeCloseTo(0, 5);
    expect(vector.y).toBeCloseTo(-0.1, 5);
  });
});

// ---------------------------------------------------------------------------
// 1.12  getWindVector(0, 0.1) → {x: 0, y: +0.1}  (N = omlaag)
// ---------------------------------------------------------------------------
describe('1.12 – getWindVector(0, 0.1) — Noord-wind gaat omlaag', () => {
  test('returns {x ≈ 0, y ≈ +0.1}', () => {
    // Arrange
    const angleDeg = 0;
    const strength = 0.1;

    // Act
    const vector = getWindVector(angleDeg, strength);

    // Assert — new formula: x = -sin(0°)*s = 0, y = cos(0°)*s = +s
    expect(vector.x).toBeCloseTo(0, 5);
    expect(vector.y).toBeCloseTo(+0.1, 5);
  });
});

// ---------------------------------------------------------------------------
// 1.13  getWindVector(90, 0.1) → {x: -0.1, y: 0}  (O = naar links)
// ---------------------------------------------------------------------------
describe('1.13 – getWindVector(90, 0.1) — Oost-wind gaat naar links', () => {
  test('returns {x ≈ -0.1, y ≈ 0}', () => {
    // Arrange
    const angleDeg = 90;
    const strength = 0.1;

    // Act
    const vector = getWindVector(angleDeg, strength);

    // Assert — new formula: x = -sin(90°)*s = -s, y = cos(90°)*s ≈ 0
    expect(vector.x).toBeCloseTo(-0.1, 5);
    expect(vector.y).toBeCloseTo(0, 5);
  });
});

// ---------------------------------------------------------------------------
// 1.14  getWindVector(270, 0.1) → {x: +0.1, y: 0}  (W = naar rechts)
// ---------------------------------------------------------------------------
describe('1.14 – getWindVector(270, 0.1) — West-wind gaat naar rechts', () => {
  test('returns {x ≈ +0.1, y ≈ 0}', () => {
    // Arrange
    const angleDeg = 270;
    const strength = 0.1;

    // Act
    const vector = getWindVector(angleDeg, strength);

    // Assert — new formula: x = -sin(270°)*s = +s, y = cos(270°)*s ≈ 0
    expect(vector.x).toBeCloseTo(+0.1, 5);
    expect(vector.y).toBeCloseTo(0, 5);
  });
});

// ---------------------------------------------------------------------------
// 1.15  getWindVector(0, 0) → {x: 0, y: 0}  (windstilte)
// ---------------------------------------------------------------------------
describe('1.15 – getWindVector(0, 0) — windstilte geeft nulvector', () => {
  test('returns {x: 0, y: 0} when strength is 0', () => {
    // Arrange
    const angleDeg = 0;
    const strength = 0;

    // Act
    const vector = getWindVector(angleDeg, strength);

    // Assert — zero strength must always produce zero vector regardless of angle
    expect(vector.x).toBeCloseTo(0, 10);
    expect(vector.y).toBeCloseTo(0, 10);
  });
});

// ---------------------------------------------------------------------------
// 1.16  drawFieldBorder() function exists in sketch.js
// ---------------------------------------------------------------------------
describe('1.16 – drawFieldBorder() function exists in sketch.js', () => {
  test('sketch.js source contains a drawFieldBorder function declaration', () => {
    // Arrange — read the raw source of sketch.js
    const sketchPath = path.join(__dirname, '..', 'src', 'sketch.js');
    const source     = fs.readFileSync(sketchPath, 'utf-8');

    // Act / Assert — the function must be declared (any style)
    expect(source).toMatch(/function\s+drawFieldBorder\s*\(/);
  });
});

// ---------------------------------------------------------------------------
// 1.17  drawFieldBorder() is called every frame inside draw()
// ---------------------------------------------------------------------------
describe('1.17 – drawFieldBorder() called inside draw()', () => {
  test('draw() body in sketch.js contains a call to drawFieldBorder()', () => {
    // Arrange — read sketch.js source
    const sketchPath = path.join(__dirname, '..', 'src', 'sketch.js');
    const source     = fs.readFileSync(sketchPath, 'utf-8');

    // Isolate the draw function body (from "function draw()" to the matching closing brace)
    const drawMatch = source.match(/function\s+draw\s*\(\s*\)\s*\{([\s\S]*?)\n\}/);
    expect(drawMatch).not.toBeNull();

    const drawBody = drawMatch ? drawMatch[1] : '';

    // Assert — drawFieldBorder() must be called inside draw()
    expect(drawBody).toMatch(/drawFieldBorder\s*\(\s*\)/);
  });
});
