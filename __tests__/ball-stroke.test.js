/**
 * TDD tests for ball-stroke feature (tasks 3.1 and 3.2)
 *
 * Verifies:
 * - Every new Ball has a `strokeColor` property with r, g, b values in 0–255
 * - The strokeColor does not change after update(), checkBounds(), or resolveCollision()
 *
 * These tests are intentionally FAILING until the implementation is added
 * to src/ball.js (Ball constructor must set this.strokeColor via hsbToRgb).
 *
 * Task 3.2 additionally verifies that the hue of strokeColor is the
 * complementary hue of color — i.e. it differs by ±180° (mod 360).
 */

const { Ball } = require('../src/ball');

describe('ball-stroke: Ball strokeColor property', () => {
  // ---------------------------------------------------------------------------
  // Property existence
  // ---------------------------------------------------------------------------

  test('new Ball has a strokeColor property', () => {
    const ball = new Ball({ x: 100, y: 100 }, { x: 0, y: 0 });
    expect(ball.strokeColor).toBeDefined();
  });

  test('ball.strokeColor has r, g, b properties', () => {
    const ball = new Ball({ x: 100, y: 100 }, { x: 0, y: 0 });
    expect(ball.strokeColor).toHaveProperty('r');
    expect(ball.strokeColor).toHaveProperty('g');
    expect(ball.strokeColor).toHaveProperty('b');
  });

  // ---------------------------------------------------------------------------
  // r, g, b value ranges (0–255)
  // ---------------------------------------------------------------------------

  test('ball.strokeColor.r is a number between 0 and 255', () => {
    const ball = new Ball({ x: 100, y: 100 }, { x: 0, y: 0 });
    expect(typeof ball.strokeColor.r).toBe('number');
    expect(ball.strokeColor.r).toBeGreaterThanOrEqual(0);
    expect(ball.strokeColor.r).toBeLessThanOrEqual(255);
  });

  test('ball.strokeColor.g is a number between 0 and 255', () => {
    const ball = new Ball({ x: 100, y: 100 }, { x: 0, y: 0 });
    expect(typeof ball.strokeColor.g).toBe('number');
    expect(ball.strokeColor.g).toBeGreaterThanOrEqual(0);
    expect(ball.strokeColor.g).toBeLessThanOrEqual(255);
  });

  test('ball.strokeColor.b is a number between 0 and 255', () => {
    const ball = new Ball({ x: 100, y: 100 }, { x: 0, y: 0 });
    expect(typeof ball.strokeColor.b).toBe('number');
    expect(ball.strokeColor.b).toBeGreaterThanOrEqual(0);
    expect(ball.strokeColor.b).toBeLessThanOrEqual(255);
  });

  // ---------------------------------------------------------------------------
  // Immutability across lifecycle methods
  // ---------------------------------------------------------------------------

  test('strokeColor does not change after update()', () => {
    const ball = new Ball({ x: 200, y: 200 }, { x: 1, y: -2 });
    const { r, g, b } = ball.strokeColor;
    ball.update();
    expect(ball.strokeColor.r).toBe(r);
    expect(ball.strokeColor.g).toBe(g);
    expect(ball.strokeColor.b).toBe(b);
  });

  test('strokeColor does not change after checkBounds()', () => {
    // Place ball near the bottom edge so checkBounds fires
    const ball = new Ball({ x: 300, y: 395 }, { x: 0, y: 5 });
    const { r, g, b } = ball.strokeColor;
    ball.checkBounds();
    expect(ball.strokeColor.r).toBe(r);
    expect(ball.strokeColor.g).toBe(g);
    expect(ball.strokeColor.b).toBe(b);
  });

  test('strokeColor does not change after resolveCollision()', () => {
    const a = new Ball({ x: 100, y: 200 }, { x: 2, y: 0 });
    const b = new Ball({ x: 110, y: 200 }, { x: -2, y: 0 }); // overlapping balls
    const { r, g, b: bVal } = a.strokeColor;
    a.resolveCollision(b);
    expect(a.strokeColor.r).toBe(r);
    expect(a.strokeColor.g).toBe(g);
    expect(a.strokeColor.b).toBe(bVal);
  });

  test('strokeColor remains unchanged across multiple update() calls', () => {
    const ball = new Ball({ x: 300, y: 200 }, { x: 1, y: 1 });
    const { r, g, b } = ball.strokeColor;
    for (let i = 0; i < 10; i++) {
      ball.update();
    }
    expect(ball.strokeColor.r).toBe(r);
    expect(ball.strokeColor.g).toBe(g);
    expect(ball.strokeColor.b).toBe(b);
  });
});

// ---------------------------------------------------------------------------
// Task 3.2 — Complementary hue: strokeColor hue is ±180° from color hue
// ---------------------------------------------------------------------------

/**
 * Convert an { r, g, b } object (components 0–255) to a hue in degrees [0, 360).
 *
 * The inversion of hsbToRgb is mathematically exact for the (s=0.8, v=0.9)
 * palette used by Ball — any floating-point drift stays well within the 5°
 * tolerance used below.
 */
function rgbToHue({ r, g, b }) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const cMax = Math.max(rn, gn, bn);
  const cMin = Math.min(rn, gn, bn);
  const delta = cMax - cMin;

  if (delta === 0) return 0; // achromatic — hue undefined, treat as 0

  let hue;
  if (cMax === rn) {
    hue = 60 * (((gn - bn) / delta) % 6);
  } else if (cMax === gn) {
    hue = 60 * ((bn - rn) / delta + 2);
  } else {
    hue = 60 * ((rn - gn) / delta + 4);
  }

  return ((hue % 360) + 360) % 360;
}

/**
 * Return the absolute angular distance between two hues (always 0–180°).
 */
function hueDifference(h1, h2) {
  const diff = Math.abs(h1 - h2) % 360;
  return diff > 180 ? 360 - diff : diff;
}

describe('ball-stroke: strokeColor is complementary hue of color (task 3.2)', () => {
  // Tolerance in degrees to absorb integer rounding in Math.round() inside
  // hsbToRgb.  One step on the 0-255 scale can shift the recovered hue by at
  // most ~2.4° for the palette used (s=0.8, v=0.9); 5° gives comfortable
  // headroom.
  const HUE_TOLERANCE_DEG = 5;

  test('strokeColor hue is approximately 180° away from color hue (single ball)', () => {
    const ball = new Ball({ x: 100, y: 100 }, { x: 0, y: 0 });

    const colorHue  = rgbToHue(ball.color);
    const strokeHue = rgbToHue(ball.strokeColor);
    const diff      = hueDifference(colorHue, strokeHue);

    expect(diff).toBeGreaterThanOrEqual(180 - HUE_TOLERANCE_DEG);
    expect(diff).toBeLessThanOrEqual(180 + HUE_TOLERANCE_DEG);
  });

  test('strokeColor hue is complementary for 20 independently created balls', () => {
    for (let i = 0; i < 20; i++) {
      const ball = new Ball({ x: i * 10, y: 200 }, { x: 1, y: -1 });

      const colorHue  = rgbToHue(ball.color);
      const strokeHue = rgbToHue(ball.strokeColor);
      const diff      = hueDifference(colorHue, strokeHue);

      expect(diff).toBeGreaterThanOrEqual(180 - HUE_TOLERANCE_DEG);
      expect(diff).toBeLessThanOrEqual(180 + HUE_TOLERANCE_DEG);
    }
  });

  test('complementary hue holds for pure red hue (hue = 0°, stroke ≈ 180°)', () => {
    // Force a known hue by mocking Math.random to return 0 (hue = 0°)
    const originalRandom = Math.random;
    Math.random = () => 0; // hue = 0 * 360 = 0°
    const ball = new Ball({ x: 0, y: 0 }, { x: 0, y: 0 });
    Math.random = originalRandom;

    const colorHue  = rgbToHue(ball.color);
    const strokeHue = rgbToHue(ball.strokeColor);
    const diff      = hueDifference(colorHue, strokeHue);

    expect(diff).toBeGreaterThanOrEqual(180 - HUE_TOLERANCE_DEG);
    expect(diff).toBeLessThanOrEqual(180 + HUE_TOLERANCE_DEG);
  });

  test('complementary hue holds for cyan hue (hue = 180°, stroke ≈ 0°)', () => {
    // Math.random = 0.5 → hue = 0.5 * 360 = 180°
    const originalRandom = Math.random;
    Math.random = () => 0.5;
    const ball = new Ball({ x: 0, y: 0 }, { x: 0, y: 0 });
    Math.random = originalRandom;

    const colorHue  = rgbToHue(ball.color);
    const strokeHue = rgbToHue(ball.strokeColor);
    const diff      = hueDifference(colorHue, strokeHue);

    expect(diff).toBeGreaterThanOrEqual(180 - HUE_TOLERANCE_DEG);
    expect(diff).toBeLessThanOrEqual(180 + HUE_TOLERANCE_DEG);
  });

  test('complementary hue holds for hue = 270° (stroke ≈ 90°)', () => {
    // Math.random = 0.75 → hue = 0.75 * 360 = 270°
    const originalRandom = Math.random;
    Math.random = () => 0.75;
    const ball = new Ball({ x: 0, y: 0 }, { x: 0, y: 0 });
    Math.random = originalRandom;

    const colorHue  = rgbToHue(ball.color);
    const strokeHue = rgbToHue(ball.strokeColor);
    const diff      = hueDifference(colorHue, strokeHue);

    expect(diff).toBeGreaterThanOrEqual(180 - HUE_TOLERANCE_DEG);
    expect(diff).toBeLessThanOrEqual(180 + HUE_TOLERANCE_DEG);
  });

  test('hue of strokeColor wraps correctly when color hue + 180 exceeds 360°', () => {
    // hue near 270° means complement near 90° — tests the (hue+180)%360 wrap
    const originalRandom = Math.random;
    Math.random = () => 271 / 360; // hue ≈ 271°, complement ≈ 91°
    const ball = new Ball({ x: 0, y: 0 }, { x: 0, y: 0 });
    Math.random = originalRandom;

    const colorHue  = rgbToHue(ball.color);
    const strokeHue = rgbToHue(ball.strokeColor);
    const diff      = hueDifference(colorHue, strokeHue);

    expect(diff).toBeGreaterThanOrEqual(180 - HUE_TOLERANCE_DEG);
    expect(diff).toBeLessThanOrEqual(180 + HUE_TOLERANCE_DEG);
  });
});
