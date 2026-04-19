/**
 * TDD tests: Click-to-Spawn & Multi-Ball Support
 *
 * Covers:
 *  - sketch.js exposes spawnBallOnClick(balls, x, y, canvasWidth, canvasHeight)
 *  - Clicking inside the canvas adds a new Ball to the array
 *  - New ball spawns at exact click coordinates (mouseX, mouseY)
 *  - New ball starts with velocity (0, 0)
 *  - Clicking outside canvas does NOT add a ball
 *  - Multiple balls can coexist in the array (multi-ball support)
 *  - All balls share the same physics (gravity, wind, bounds)
 *
 * Canvas dimensions (from spec): 600 × 400
 */

const { spawnBallOnClick } = require('../src/sketch');
const { Ball, CANVAS_WIDTH, CANVAS_HEIGHT } = require('../src/ball');

// ---------------------------------------------------------------------------
// spawnBallOnClick – in-bounds click
// ---------------------------------------------------------------------------
describe('spawnBallOnClick – in-bounds click', () => {
  test('adds one ball to an empty array when click is inside canvas', () => {
    // Arrange
    const balls = [];
    const mouseX = 300;
    const mouseY = 200;

    // Act
    spawnBallOnClick(balls, mouseX, mouseY, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Assert
    expect(balls).toHaveLength(1);
  });

  test('spawned ball position matches the click coordinates', () => {
    // Arrange
    const balls = [];
    const mouseX = 150;
    const mouseY = 75;

    // Act
    spawnBallOnClick(balls, mouseX, mouseY, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Assert
    expect(balls[0].position.x).toBeCloseTo(mouseX);
    expect(balls[0].position.y).toBeCloseTo(mouseY);
  });

  test('spawned ball starts with velocity (0, 0)', () => {
    // Arrange
    const balls = [];

    // Act
    spawnBallOnClick(balls, 200, 150, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Assert
    expect(balls[0].velocity.x).toBeCloseTo(0);
    expect(balls[0].velocity.y).toBeCloseTo(0);
  });

  test('click at canvas origin (0, 0) spawns a ball (boundary is inclusive)', () => {
    // Arrange
    const balls = [];

    // Act
    spawnBallOnClick(balls, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Assert
    expect(balls).toHaveLength(1);
  });

  test('click at bottom-right corner (width, height) spawns a ball (boundary is inclusive)', () => {
    // Arrange
    const balls = [];

    // Act
    spawnBallOnClick(balls, CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Assert
    expect(balls).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// spawnBallOnClick – out-of-bounds click
// ---------------------------------------------------------------------------
describe('spawnBallOnClick – out-of-bounds click', () => {
  test('does NOT add a ball when mouseX is negative', () => {
    // Arrange
    const balls = [];

    // Act
    spawnBallOnClick(balls, -1, 200, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Assert
    expect(balls).toHaveLength(0);
  });

  test('does NOT add a ball when mouseX exceeds canvas width', () => {
    // Arrange
    const balls = [];

    // Act
    spawnBallOnClick(balls, CANVAS_WIDTH + 1, 200, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Assert
    expect(balls).toHaveLength(0);
  });

  test('does NOT add a ball when mouseY is negative', () => {
    // Arrange
    const balls = [];

    // Act
    spawnBallOnClick(balls, 300, -1, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Assert
    expect(balls).toHaveLength(0);
  });

  test('does NOT add a ball when mouseY exceeds canvas height', () => {
    // Arrange
    const balls = [];

    // Act
    spawnBallOnClick(balls, 300, CANVAS_HEIGHT + 1, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Assert
    expect(balls).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Multi-ball coexistence
// ---------------------------------------------------------------------------
describe('Multi-ball – coexistence', () => {
  test('multiple clicks produce multiple balls in the array', () => {
    // Arrange
    const balls = [];

    // Act – three separate clicks
    spawnBallOnClick(balls, 100, 100, CANVAS_WIDTH, CANVAS_HEIGHT);
    spawnBallOnClick(balls, 200, 150, CANVAS_WIDTH, CANVAS_HEIGHT);
    spawnBallOnClick(balls, 300, 200, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Assert
    expect(balls).toHaveLength(3);
  });

  test('each ball retains its own spawn position', () => {
    // Arrange
    const balls = [];

    // Act
    spawnBallOnClick(balls, 50,  80, CANVAS_WIDTH, CANVAS_HEIGHT);
    spawnBallOnClick(balls, 400, 300, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Assert
    expect(balls[0].position).toEqual({ x: 50,  y: 80  });
    expect(balls[1].position).toEqual({ x: 400, y: 300 });
  });

  test('spawned ball is an instance of Ball', () => {
    // Arrange
    const balls = [];

    // Act
    spawnBallOnClick(balls, 300, 200, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Assert – must be a proper Ball so gravity / bounds / wind apply to it
    expect(balls[0]).toBeInstanceOf(Ball);
  });

  test('all balls in array respond to applyGravity independently', () => {
    // Arrange – two balls spawned at different heights
    const balls = [];
    spawnBallOnClick(balls, 100, 50,  CANVAS_WIDTH, CANVAS_HEIGHT);
    spawnBallOnClick(balls, 400, 300, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Act – apply gravity to every ball (as draw() loop would do)
    balls.forEach(b => b.applyGravity());

    // Assert – both gain downward velocity
    balls.forEach(b => {
      expect(b.velocity.y).toBeCloseTo(0.5); // started at 0, gravity = 0.5
    });
  });

  test('an out-of-bounds click between valid clicks does not change ball count', () => {
    // Arrange
    const balls = [];
    spawnBallOnClick(balls, 100, 100, CANVAS_WIDTH, CANVAS_HEIGHT); // valid

    // Act – out-of-bounds click
    spawnBallOnClick(balls, -50, 200, CANVAS_WIDTH, CANVAS_HEIGHT); // invalid

    // Assert – still only 1 ball
    expect(balls).toHaveLength(1);
  });
});
