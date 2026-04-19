/**
 * TDD tests: Wind Force Physics & Visualisation
 *
 * Covers:
 *  - Wind formula: sin(frameCount * 0.02) * 0.3
 *  - Positive wind increases horizontal velocity
 *  - Negative wind decreases horizontal velocity
 *  - Wind of zero has no effect on velocity
 *  - Wind arrow direction tracks wind sign
 *  - Wind arrow length is zero (or near-zero) when wind is zero
 *
 * Constants (from spec/refinement):
 *   WIND_AMPLITUDE  = 0.3
 *   WIND_FREQUENCY  = 0.02   (multiplier on frameCount inside sin)
 */

const {
  calculateWind,
  applyWind,
  getWindArrow,
  WIND_AMPLITUDE,
  WIND_FREQUENCY,
} = require('../src/wind');

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
describe('Wind constants', () => {
  test('WIND_AMPLITUDE is 0.3', () => {
    expect(WIND_AMPLITUDE).toBeCloseTo(0.3);
  });

  test('WIND_FREQUENCY is 0.02', () => {
    expect(WIND_FREQUENCY).toBeCloseTo(0.02);
  });
});

// ---------------------------------------------------------------------------
// calculateWind
// ---------------------------------------------------------------------------
describe('calculateWind(frameCount)', () => {
  test('returns sin(frameCount * 0.02) * 0.3', () => {
    // Arrange
    const frame = 50;
    const expected = Math.sin(frame * 0.02) * 0.3;

    // Act
    const result = calculateWind(frame);

    // Assert
    expect(result).toBeCloseTo(expected);
  });

  test('returns positive value when sin is positive', () => {
    // sin(π/2) = 1 → frameCount ≈ 78.54 (use 79)
    const frame = 79;

    const result = calculateWind(frame);
    expect(result).toBeGreaterThan(0);
  });

  test('returns negative value when sin is negative (right-to-left wind)', () => {
    // sin(π * 1.5) ≈ -1 → frameCount such that frame * 0.02 ≈ 4.71 → frame ≈ 235
    const frame = 235;

    const result = calculateWind(frame);
    expect(result).toBeLessThan(0);
  });

  test('returns zero when frameCount is 0 (sin(0) = 0)', () => {
    expect(calculateWind(0)).toBeCloseTo(0);
  });
});

// ---------------------------------------------------------------------------
// applyWind – effect on velocity
// ---------------------------------------------------------------------------
describe('applyWind(velocity, windForce)', () => {
  test('positive wind increases horizontal velocity', () => {
    // Arrange
    const velocity = { x: 0, y: 0 };
    const wind = 0.3;

    // Act
    const result = applyWind(velocity, wind);

    // Assert
    expect(result.x).toBeCloseTo(0.3);
    expect(result.y).toBeCloseTo(0); // vertical unaffected
  });

  test('negative wind decreases (reverses) horizontal velocity', () => {
    // Arrange
    const velocity = { x: 1, y: 0 };
    const wind = -0.3;

    // Act
    const result = applyWind(velocity, wind);

    // Assert
    expect(result.x).toBeCloseTo(0.7);
    expect(result.y).toBeCloseTo(0);
  });

  test('zero wind does not change velocity', () => {
    // Arrange
    const velocity = { x: 2.5, y: -1.0 };
    const wind = 0;

    // Act
    const result = applyWind(velocity, wind);

    // Assert
    expect(result.x).toBeCloseTo(2.5);
    expect(result.y).toBeCloseTo(-1.0);
  });

  test('vertical component is never modified by wind', () => {
    // Arrange
    const velocity = { x: 0, y: 3 };
    const wind = 0.3;

    // Act
    const result = applyWind(velocity, wind);

    // Assert
    expect(result.y).toBeCloseTo(3);
  });
});

// ---------------------------------------------------------------------------
// getWindArrow – visualisation
// ---------------------------------------------------------------------------
describe('getWindArrow(windForce)', () => {
  test('arrow points right (positive dx) when wind is positive', () => {
    // Arrange
    const wind = 0.3;

    // Act
    const arrow = getWindArrow(wind);

    // Assert – the arrow dx should be > 0 for rightward wind
    expect(arrow.dx).toBeGreaterThan(0);
  });

  test('arrow points left (negative dx) when wind is negative', () => {
    // Arrange
    const wind = -0.3;

    // Act
    const arrow = getWindArrow(wind);

    // Assert
    expect(arrow.dx).toBeLessThan(0);
  });

  test('arrow has zero length when wind is zero', () => {
    // Arrange
    const wind = 0;

    // Act
    const arrow = getWindArrow(wind);

    // Assert
    expect(Math.abs(arrow.dx)).toBeCloseTo(0);
  });

  test('stronger wind produces a longer arrow', () => {
    // Arrange
    const strongWind = 0.3;
    const weakWind = 0.1;

    // Act
    const strongArrow = getWindArrow(strongWind);
    const weakArrow = getWindArrow(weakWind);

    // Assert
    expect(Math.abs(strongArrow.dx)).toBeGreaterThan(Math.abs(weakArrow.dx));
  });
});
