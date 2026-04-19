/**
 * Tests for per-ball-color feature (task 3.1)
 *
 * Verifies:
 * - Every new Ball has a `color` property with r, g, b values in 0–255
 * - The color does not change after update(), checkBounds(), or resolveCollision()
 */

const { Ball } = require('../src/ball');

describe('per-ball-color: Ball color property', () => {
  test('new Ball has a color property', () => {
    const ball = new Ball({ x: 100, y: 100 }, { x: 0, y: 0 });
    expect(ball.color).toBeDefined();
  });

  test('ball.color has r, g, b properties', () => {
    const ball = new Ball({ x: 100, y: 100 }, { x: 0, y: 0 });
    expect(ball.color).toHaveProperty('r');
    expect(ball.color).toHaveProperty('g');
    expect(ball.color).toHaveProperty('b');
  });

  test('ball.color.r is a number between 0 and 255', () => {
    const ball = new Ball({ x: 100, y: 100 }, { x: 0, y: 0 });
    expect(typeof ball.color.r).toBe('number');
    expect(ball.color.r).toBeGreaterThanOrEqual(0);
    expect(ball.color.r).toBeLessThanOrEqual(255);
  });

  test('ball.color.g is a number between 0 and 255', () => {
    const ball = new Ball({ x: 100, y: 100 }, { x: 0, y: 0 });
    expect(typeof ball.color.g).toBe('number');
    expect(ball.color.g).toBeGreaterThanOrEqual(0);
    expect(ball.color.g).toBeLessThanOrEqual(255);
  });

  test('ball.color.b is a number between 0 and 255', () => {
    const ball = new Ball({ x: 100, y: 100 }, { x: 0, y: 0 });
    expect(typeof ball.color.b).toBe('number');
    expect(ball.color.b).toBeGreaterThanOrEqual(0);
    expect(ball.color.b).toBeLessThanOrEqual(255);
  });

  test('different Ball instances can have different colors (random hue)', () => {
    // With random hue, colors won't always be identical — run 10 trials
    const colors = Array.from({ length: 10 }, () =>
      new Ball({ x: 50, y: 50 }, { x: 0, y: 0 }).color
    );
    const unique = new Set(colors.map(c => `${c.r},${c.g},${c.b}`));
    // At least 2 different colors in 10 trials (probability of all identical is astronomically small)
    expect(unique.size).toBeGreaterThan(1);
  });

  test('color does not change after update()', () => {
    const ball = new Ball({ x: 200, y: 200 }, { x: 1, y: -2 });
    const { r, g, b } = ball.color;
    ball.update();
    expect(ball.color.r).toBe(r);
    expect(ball.color.g).toBe(g);
    expect(ball.color.b).toBe(b);
  });

  test('color does not change after checkBounds()', () => {
    // Place ball near the bottom edge so checkBounds fires
    const ball = new Ball({ x: 300, y: 395 }, { x: 0, y: 5 });
    const { r, g, b } = ball.color;
    ball.checkBounds();
    expect(ball.color.r).toBe(r);
    expect(ball.color.g).toBe(g);
    expect(ball.color.b).toBe(b);
  });

  test('color does not change after resolveCollision()', () => {
    const a = new Ball({ x: 100, y: 200 }, { x: 2, y: 0 });
    const b = new Ball({ x: 110, y: 200 }, { x: -2, y: 0 }); // overlapping
    const { r, g, b: bVal } = a.color;
    a.resolveCollision(b);
    expect(a.color.r).toBe(r);
    expect(a.color.g).toBe(g);
    expect(a.color.b).toBe(bVal);
  });
});
