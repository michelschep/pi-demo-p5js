/**
 * TDD tests for ball-fibonacci-numbers feature (task 3.1)
 *
 * Verifies:
 * - After resetFibIndex(), the first new Ball has fibonacciNumber === 1
 * - After resetFibIndex(), the second new Ball has fibonacciNumber === 2
 * - After resetFibIndex(), the third new Ball has fibonacciNumber === 3
 *
 * These tests are intentionally FAILING until the implementation is added:
 *   - FIBONACCI constant and _fibIndex module-level counter in src/ball.js (task 1.1)
 *   - Ball constructor assigns this.fibonacciNumber = FIBONACCI[_fibIndex % ...] (task 1.2)
 *   - resetFibIndex() exported from src/ball.js resets _fibIndex to 0 (task 1.3)
 */

const { Ball, resetFibIndex } = require('../src/ball');

describe('ball-fibonacci-numbers: fibonacciNumber assignment', () => {
  beforeEach(() => {
    // Reset the module-level index before every test so each test
    // starts from a clean, predictable state.
    resetFibIndex();
  });

  // ---------------------------------------------------------------------------
  // Task 3.1 — first three balls after resetFibIndex()
  // ---------------------------------------------------------------------------

  test('first ball after resetFibIndex() has fibonacciNumber === 1', () => {
    // Arrange & Act
    const ball = new Ball({ x: 100, y: 100 }, { x: 1, y: 1 });

    // Assert
    expect(ball.fibonacciNumber).toBe(1);
  });

  test('second ball after resetFibIndex() has fibonacciNumber === 2', () => {
    // Arrange — spawn first ball to advance the index
    new Ball({ x: 100, y: 100 }, { x: 1, y: 1 });

    // Act — second ball
    const secondBall = new Ball({ x: 200, y: 200 }, { x: -1, y: 1 });

    // Assert
    expect(secondBall.fibonacciNumber).toBe(2);
  });

  test('third ball after resetFibIndex() has fibonacciNumber === 3', () => {
    // Arrange — spawn first two balls to advance the index
    new Ball({ x: 100, y: 100 }, { x: 1, y: 1 });
    new Ball({ x: 200, y: 200 }, { x: -1, y: 1 });

    // Act — third ball
    const thirdBall = new Ball({ x: 300, y: 300 }, { x: 1, y: -1 });

    // Assert
    expect(thirdBall.fibonacciNumber).toBe(3);
  });

  // ---------------------------------------------------------------------------
  // Task 3.2 — cycle wraps: the 11th ball restarts at fibonacciNumber === 1
  // ---------------------------------------------------------------------------

  test('11th ball after resetFibIndex() has fibonacciNumber === 1 (cycle wraps after 10)', () => {
    // Arrange — spawn 10 balls to exhaust the full FIBONACCI sequence
    // FIBONACCI = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89] (10 elements)
    for (let i = 0; i < 10; i++) {
      new Ball({ x: i * 30, y: i * 30 }, { x: 1, y: 1 });
    }

    // Act — 11th ball: index wraps around to 0, so the value should be 1
    const eleventhBall = new Ball({ x: 400, y: 400 }, { x: -1, y: -1 });

    // Assert
    expect(eleventhBall.fibonacciNumber).toBe(1);
  });

  // ---------------------------------------------------------------------------
  // Task 3.3 — fibonacciNumber is immutable across the ball lifecycle
  // ---------------------------------------------------------------------------

  describe('fibonacciNumber is immutable across lifecycle methods', () => {
    test('fibonacciNumber is unchanged after update()', () => {
      // Arrange — first ball always gets fibonacciNumber === 1 after resetFibIndex()
      const ball = new Ball({ x: 100, y: 100 }, { x: 2, y: -3 });
      const initialFibonacciNumber = ball.fibonacciNumber;

      // Act — simulate multiple frames of physics
      ball.update();
      ball.update();
      ball.update();

      // Assert — the assigned Fibonacci number must not change
      expect(ball.fibonacciNumber).toBe(initialFibonacciNumber);
    });

    test('fibonacciNumber is unchanged after checkBounds()', () => {
      // Arrange — place ball so it will trigger every canvas edge
      // Positions outside canvas boundaries ensure checkBounds() actively mutates
      // position and velocity, giving the strongest possible test of immutability.
      const ball = new Ball({ x: -5, y: 410 }, { x: -10, y: 20 });
      const initialFibonacciNumber = ball.fibonacciNumber;

      // Act
      ball.checkBounds(); // triggers bottom + left edge corrections

      // Assert
      expect(ball.fibonacciNumber).toBe(initialFibonacciNumber);
    });

    test('fibonacciNumber is unchanged after resolveCollision()', () => {
      // Arrange — two overlapping balls on a direct collision course
      // Place them close enough to guarantee resolveCollision() mutates both
      const ballA = new Ball({ x: 100, y: 100 }, { x:  3, y: 0 });
      const ballB = new Ball({ x: 115, y: 100 }, { x: -3, y: 0 }); // 15 px apart < 2*BALL_RADIUS(40)
      const fibA = ballA.fibonacciNumber;
      const fibB = ballB.fibonacciNumber;

      // Act
      ballA.resolveCollision(ballB);

      // Assert — neither ball's Fibonacci label is affected by collision resolution
      expect(ballA.fibonacciNumber).toBe(fibA);
      expect(ballB.fibonacciNumber).toBe(fibB);
    });
  });
});
