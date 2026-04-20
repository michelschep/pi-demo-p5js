/**
 * TDD tests: Bouncing Ball Physics
 *
 * Covers:
 *  - Gravity applied to velocity each frame
 *  - Bouncing off bottom edge (y + radius >= canvasHeight)
 *  - Bouncing off top edge (y - radius <= 0)
 *  - Horizontal wrap at left/right edges (no bounce, teleport to opposite side)
 *  - Damping factor 0.8 applied on top/bottom bounce
 *  - Ball radius is 12px
 *  - Canvas dimensions 900×600
 *
 * Constants (from spec/refinement):
 *   gravity  = { x: 0, y: 0.5 }
 *   damping  = 0.8
 *   radius   = 12
 *   canvas   = 900 × 600
 */

const { Ball, GRAVITY, DAMPING, BALL_RADIUS, CANVAS_WIDTH, CANVAS_HEIGHT } = require('../src/ball');

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
describe('Ball constants', () => {
  test('GRAVITY is (0, 0.5)', () => {
    expect(GRAVITY).toEqual({ x: 0, y: 0.5 });
  });

  test('DAMPING is 0.8', () => {
    expect(DAMPING).toBeCloseTo(0.8);
  });

  test('BALL_RADIUS is 12', () => {
    expect(BALL_RADIUS).toBe(12);
  });

  test('canvas is 900 wide and 600 tall', () => {
    expect(CANVAS_WIDTH).toBe(900);
    expect(CANVAS_HEIGHT).toBe(600);
  });
});

// ---------------------------------------------------------------------------
// Gravity
// ---------------------------------------------------------------------------
describe('Ball – gravity', () => {
  test('applyGravity increases vertical velocity by 0.5 each frame', () => {
    // Arrange
    const ball = new Ball({ x: 300, y: 200 }, { x: 0, y: 0 });

    // Act
    ball.applyGravity();

    // Assert
    expect(ball.velocity.y).toBeCloseTo(0.5);
    expect(ball.velocity.x).toBeCloseTo(0);
  });

  test('applyGravity accumulates over multiple frames', () => {
    // Arrange
    const ball = new Ball({ x: 300, y: 100 }, { x: 0, y: 0 });

    // Act – simulate 3 frames of gravity only
    ball.applyGravity();
    ball.applyGravity();
    ball.applyGravity();

    // Assert
    expect(ball.velocity.y).toBeCloseTo(1.5);
  });

  test('position is updated by velocity each frame', () => {
    // Arrange
    const ball = new Ball({ x: 300, y: 100 }, { x: 2, y: 3 });

    // Act
    ball.update();

    // Assert
    // gravity adds 0.5 to vy → vy=3.5; then friction (×0.988): vx=1.976, vy=3.458
    expect(ball.position.x).toBeCloseTo(300 + 2 * 0.988);   // 301.976
    expect(ball.position.y).toBeCloseTo(100 + 3.5 * 0.988); // 103.458
  });
});

// ---------------------------------------------------------------------------
// Bottom-edge bounce
// ---------------------------------------------------------------------------
describe('Ball – bottom-edge bounce', () => {
  test('ball bounces when y + radius equals canvas height', () => {
    // Arrange – place ball exactly at the bottom edge, moving downward
    const ball = new Ball(
      { x: 300, y: CANVAS_HEIGHT - BALL_RADIUS },
      { x: 0, y: 5 }
    );

    // Act
    ball.checkBounds();

    // Assert
    expect(ball.velocity.y).toBeCloseTo(-5 * 0.8);
  });

  test('ball position is corrected so it does not exceed bottom edge', () => {
    // Arrange – ball partially outside canvas
    const ball = new Ball(
      { x: 300, y: CANVAS_HEIGHT - BALL_RADIUS + 5 },
      { x: 0, y: 8 }
    );

    // Act
    ball.checkBounds();

    // Assert
    expect(ball.position.y).toBeLessThanOrEqual(CANVAS_HEIGHT - BALL_RADIUS);
  });

  test('ball does NOT bounce when above bottom edge', () => {
    // Arrange
    const ball = new Ball({ x: 300, y: 100 }, { x: 0, y: 3 });

    // Act
    ball.checkBounds();

    // Assert
    expect(ball.velocity.y).toBeCloseTo(3); // unchanged
  });
});

// ---------------------------------------------------------------------------
// Top-edge bounce
// ---------------------------------------------------------------------------
describe('Ball – top-edge bounce', () => {
  test('ball bounces when y - radius equals 0', () => {
    // Arrange – ball at top edge, moving upward
    const ball = new Ball({ x: 300, y: BALL_RADIUS }, { x: 0, y: -5 });

    // Act
    ball.checkBounds();

    // Assert
    expect(ball.velocity.y).toBeCloseTo(5 * 0.8);
  });

  test('ball position is corrected so it does not exceed top edge', () => {
    // Arrange
    const ball = new Ball({ x: 300, y: BALL_RADIUS - 3 }, { x: 0, y: -4 });

    // Act
    ball.checkBounds();

    // Assert
    expect(ball.position.y).toBeGreaterThanOrEqual(BALL_RADIUS);
  });
});

// ---------------------------------------------------------------------------
// Left-edge wrap (horizontal wrap replaces bounce)
// ---------------------------------------------------------------------------
describe('Ball – left-edge wrap', () => {
  test('ball teleports to right side when crossing left boundary', () => {
    // Arrange – ball past the left boundary (x < -BALL_RADIUS)
    const ball = new Ball({ x: -BALL_RADIUS - 1, y: 200 }, { x: -6, y: 0 });

    // Act
    ball.checkBounds();

    // Assert – position wraps to opposite side; velocity is unchanged (no damping on wrap)
    expect(ball.position.x).toBeCloseTo(CANVAS_WIDTH + BALL_RADIUS - 1);
    expect(ball.velocity.x).toBeCloseTo(-6);
  });

  test('ball position wraps when crossing left boundary', () => {
    // Arrange – ball clearly past the left boundary
    const ball = new Ball({ x: -BALL_RADIUS - 2, y: 200 }, { x: -3, y: 0 });

    // Act
    ball.checkBounds();

    // Assert – position teleported to the right side of canvas
    expect(ball.position.x).toBeCloseTo(CANVAS_WIDTH + BALL_RADIUS - 1);
  });
});

// ---------------------------------------------------------------------------
// Right-edge wrap (horizontal wrap replaces bounce)
// ---------------------------------------------------------------------------
describe('Ball – right-edge wrap', () => {
  test('ball teleports to left side when crossing right boundary', () => {
    // Arrange – ball past the right boundary (x > CANVAS_WIDTH + BALL_RADIUS)
    const ball = new Ball({ x: CANVAS_WIDTH + BALL_RADIUS + 1, y: 200 }, { x: 7, y: 0 });

    // Act
    ball.checkBounds();

    // Assert – position wraps to opposite side; velocity is unchanged (no damping on wrap)
    expect(ball.position.x).toBeCloseTo(-BALL_RADIUS + 1);
    expect(ball.velocity.x).toBeCloseTo(7);
  });

  test('ball position wraps when crossing right boundary', () => {
    // Arrange
    const ball = new Ball(
      { x: CANVAS_WIDTH + BALL_RADIUS + 4, y: 200 },
      { x: 5, y: 0 }
    );

    // Act
    ball.checkBounds();

    // Assert – position teleported to the left side of canvas
    expect(ball.position.x).toBeCloseTo(-BALL_RADIUS + 1);
  });
});
