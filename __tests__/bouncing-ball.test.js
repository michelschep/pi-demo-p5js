/**
 * TDD tests: Bouncing Ball Physics
 *
 * Covers:
 *  - Gravity applied to velocity each frame
 *  - Bouncing off bottom edge (y + radius >= canvasHeight)
 *  - Bouncing off top edge (y - radius <= 0)
 *  - Bouncing off left/right edges (x ± radius <= 0 / >= canvasWidth)
 *  - Damping factor 0.8 applied on bounce
 *  - Ball radius is 20px
 *  - Canvas dimensions 600×400
 *
 * Constants (from spec/refinement):
 *   gravity  = { x: 0, y: 0.5 }
 *   damping  = 0.8
 *   radius   = 20
 *   canvas   = 600 × 400
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

  test('BALL_RADIUS is 20', () => {
    expect(BALL_RADIUS).toBe(20);
  });

  test('canvas is 600 wide and 400 tall', () => {
    expect(CANVAS_WIDTH).toBe(600);
    expect(CANVAS_HEIGHT).toBe(400);
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
    expect(ball.position.x).toBeCloseTo(302);
    expect(ball.position.y).toBeCloseTo(103 + 0.5); // gravity adds 0.5 to vy, new vy=3.5 → y=103.5
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
// Left-edge bounce
// ---------------------------------------------------------------------------
describe('Ball – left-edge bounce', () => {
  test('ball bounces off left edge with damping', () => {
    // Arrange
    const ball = new Ball({ x: BALL_RADIUS, y: 200 }, { x: -6, y: 0 });

    // Act
    ball.checkBounds();

    // Assert
    expect(ball.velocity.x).toBeCloseTo(6 * 0.8);
  });

  test('ball position is corrected at left edge', () => {
    // Arrange
    const ball = new Ball({ x: BALL_RADIUS - 2, y: 200 }, { x: -3, y: 0 });

    // Act
    ball.checkBounds();

    // Assert
    expect(ball.position.x).toBeGreaterThanOrEqual(BALL_RADIUS);
  });
});

// ---------------------------------------------------------------------------
// Right-edge bounce
// ---------------------------------------------------------------------------
describe('Ball – right-edge bounce', () => {
  test('ball bounces off right edge with damping', () => {
    // Arrange
    const ball = new Ball({ x: CANVAS_WIDTH - BALL_RADIUS, y: 200 }, { x: 7, y: 0 });

    // Act
    ball.checkBounds();

    // Assert
    expect(ball.velocity.x).toBeCloseTo(-7 * 0.8);
  });

  test('ball position is corrected at right edge', () => {
    // Arrange
    const ball = new Ball(
      { x: CANVAS_WIDTH - BALL_RADIUS + 4, y: 200 },
      { x: 5, y: 0 }
    );

    // Act
    ball.checkBounds();

    // Assert
    expect(ball.position.x).toBeLessThanOrEqual(CANVAS_WIDTH - BALL_RADIUS);
  });
});
