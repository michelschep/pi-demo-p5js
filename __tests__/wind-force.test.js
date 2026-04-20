/**
 * TDD tests: Wind Force Physics & Visualisation
 *
 * Covers:
 *  - getWindVector(angleDeg, strength): N=0°, O=90°, Z=180°, W=270°, windstilte
 *  - Wind formula: sin(frameCount * 0.02) * 0.3
 *  - Positive wind increases horizontal velocity
 *  - Negative wind decreases horizontal velocity
 *  - Wind of zero has no effect on velocity
 *  - Wind arrow direction tracks wind sign
 *  - Wind arrow length is zero (or near-zero) when wind is zero
 *
 * Constants (from spec/refinement):
 *   WIND_AMPLITUDE  = 0.08   ← tweaked from 0.3 so wind is subtle vs gravity
 *   WIND_FREQUENCY  = 0.02   (multiplier on frameCount inside sin)
 */

const {
  calculateWind,
  applyWind,
  getWindArrow,
  getWindVector,
  WIND_AMPLITUDE,
  WIND_FREQUENCY,
} = require('../src/wind');

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
describe('Wind constants', () => {
  test('WIND_AMPLITUDE is 0.08 (tweaked – wind must be subtle vs gravity)', () => {
    // spec: amplitude changed from 0.3 → 0.08 so wind is not dominant
    expect(WIND_AMPLITUDE).toBeCloseTo(0.08);
  });

  test('WIND_FREQUENCY is 0.02', () => {
    expect(WIND_FREQUENCY).toBeCloseTo(0.02);
  });
});

// ---------------------------------------------------------------------------
// calculateWind
// ---------------------------------------------------------------------------
describe('calculateWind(frameCount)', () => {
  test('returns sin(frameCount * 0.02) * 0.08', () => {
    // Arrange
    const frame = 50;
    const expected = Math.sin(frame * 0.02) * 0.08;

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

  test('maximum wind force (amplitude) is significantly less than gravity (0.5)', () => {
    // spec: wind amplitude 0.08 must be clearly smaller than gravity 0.5
    // so the ball falls mainly downward, not sideways
    expect(WIND_AMPLITUDE).toBeLessThan(0.5 * 0.5); // max wind < half of gravity
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
    const wind = 0.08; // updated amplitude

    // Act
    const result = applyWind(velocity, wind);

    // Assert
    expect(result.x).toBeCloseTo(0.08);
    expect(result.y).toBeCloseTo(0); // vertical unaffected
  });

  test('negative wind decreases (reverses) horizontal velocity', () => {
    // Arrange
    const velocity = { x: 1, y: 0 };
    const wind = -0.08; // updated amplitude

    // Act
    const result = applyWind(velocity, wind);

    // Assert
    expect(result.x).toBeCloseTo(0.92);
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
    const wind = 0.08; // updated amplitude

    // Act
    const arrow = getWindArrow(wind);

    // Assert – the arrow dx should be > 0 for rightward wind
    expect(arrow.dx).toBeGreaterThan(0);
  });

  test('arrow points left (negative dx) when wind is negative', () => {
    // Arrange
    const wind = -0.08; // updated amplitude

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

  test('arrow length with amplitude 0.08 and scale 100 is at most 8px', () => {
    // spec: max arrow = 0.08 * 100 = 8px (was 30px at amplitude 0.3)
    const arrow = getWindArrow(WIND_AMPLITUDE);
    expect(Math.abs(arrow.dx)).toBeCloseTo(8);
  });

  test('stronger wind produces a longer arrow', () => {
    // Arrange
    const strongWind = 0.08;
    const weakWind = 0.04;

    // Act
    const strongArrow = getWindArrow(strongWind);
    const weakArrow = getWindArrow(weakWind);

    // Assert
    expect(Math.abs(strongArrow.dx)).toBeGreaterThan(Math.abs(weakArrow.dx));
  });
});

// ---------------------------------------------------------------------------
// getWindVector – task 1.1 (wind-controls)
// Formula: { x: −sin(θ) * strength, y: cos(θ) * strength }
// Kompasrose: 0° = Noord (omhoog op canvas), kloksgewijs
// ---------------------------------------------------------------------------
describe('getWindVector(angleDeg, strength)', () => {
  test('N=0°: Noord-wind geeft {x≈0, y=+strength}', () => {
    // Arrange
    const angleDeg = 0;
    const strength = 0.1;

    // Act
    const vector = getWindVector(angleDeg, strength);

    // Assert – −sin(0)=0, cos(0)=+1 → y = +strength
    expect(vector.x).toBeCloseTo(0);
    expect(vector.y).toBeCloseTo(strength);

  });

  test('O=90°: Oost-wind geeft {x=−strength, y≈0}', () => {
    // Arrange
    const angleDeg = 90;
    const strength = 0.1;

    // Act
    const vector = getWindVector(angleDeg, strength);

    // Assert – −sin(90°)=−1 → x = −strength, cos(90°)=0
    expect(vector.x).toBeCloseTo(-strength);
    expect(vector.y).toBeCloseTo(0);

  });

  test('Z=180°: Zuid-wind geeft {x≈0, y=−strength}', () => {
    // Arrange
    const angleDeg = 180;
    const strength = 0.1;

    // Act
    const vector = getWindVector(angleDeg, strength);

    // Assert – −sin(180°)≈0, cos(180°)=−1 → y = −strength
    expect(vector.x).toBeCloseTo(0);
    expect(vector.y).toBeCloseTo(-strength);

  });

  test('W=270°: West-wind geeft {x=+strength, y≈0}', () => {
    // Arrange
    const angleDeg = 270;
    const strength = 0.1;

    // Act
    const vector = getWindVector(angleDeg, strength);

    // Assert – −sin(270°)=+1 → x = +strength, cos(270°)=0
    expect(vector.x).toBeCloseTo(strength);
    expect(vector.y).toBeCloseTo(0);

  });

  test('windstilte: strength=0 geeft nulvector ongeacht hoek', () => {
    // Arrange
    const strength = 0;

    // Act – test met een willekeurige hoek (bijv. 45°)
    const vector = getWindVector(45, strength);

    // Assert – nulvector
    expect(vector.x).toBeCloseTo(0);
    expect(vector.y).toBeCloseTo(0);

  });
});

// ---------------------------------------------------------------------------
// applyWind — task 1.2 (wind-controls)
// New signature: applyWind(velocity, windVector) where windVector = {x, y}
// Both velocity.x AND velocity.y must be updated.
// ---------------------------------------------------------------------------
describe('applyWind(velocity, windVector) — 2D windVector {x, y}', () => {
  test('wind beïnvloedt zowel x als y snelheid', () => {
    // Arrange – spec example from spec.md
    const velocity   = { x: 1,   y: 2   };
    const windVector = { x: 0.1, y: -0.1 };

    // Act
    const result = applyWind(velocity, windVector);

    // Assert
    expect(result.x).toBeCloseTo(1.1); // x + windVector.x
    expect(result.y).toBeCloseTo(1.9); // y + windVector.y

  });

  test('nulvector verandert snelheid niet', () => {
    // Arrange
    const velocity   = { x: 2, y: 3 };
    const windVector = { x: 0, y: 0 };

    // Act
    const result = applyWind(velocity, windVector);

    // Assert
    expect(result.x).toBeCloseTo(2);
    expect(result.y).toBeCloseTo(3);

  });

  test('positieve x-component vergroot velocity.x', () => {
    // Arrange
    const velocity   = { x: 0, y: 0 };
    const windVector = { x: 0.1, y: 0 };

    // Act
    const result = applyWind(velocity, windVector);

    // Assert
    expect(result.x).toBeCloseTo(0.1);
    expect(result.y).toBeCloseTo(0); // y ongewijzigd

  });

  test('negatieve y-component (Noord-wind) verkleint velocity.y', () => {
    // Arrange – Noord-wind: {x:0, y:-sterkte}
    const velocity   = { x: 0,   y: 5   };
    const windVector = { x: 0,   y: -0.2 };

    // Act
    const result = applyWind(velocity, windVector);

    // Assert
    expect(result.x).toBeCloseTo(0);   // x ongewijzigd
    expect(result.y).toBeCloseTo(4.8); // y daalt

  });

  test('diagonale wind past beide componenten tegelijk aan', () => {
    // Arrange – Oost-Noord-Oost diagonaal
    const velocity   = { x: -1, y: -1 };
    const windVector = { x:  0.3, y: -0.3 };

    // Act
    const result = applyWind(velocity, windVector);

    // Assert
    expect(result.x).toBeCloseTo(-0.7);  // -1 + 0.3
    expect(result.y).toBeCloseTo(-1.3);  // -1 + (-0.3)

  });

  test('geeft een nieuw object terug (muteert velocity niet)', () => {
    // Arrange
    const velocity   = { x: 1, y: 1 };
    const windVector = { x: 0.1, y: 0.1 };
    const originalX  = velocity.x;
    const originalY  = velocity.y;

    // Act
    const result = applyWind(velocity, windVector);

    // Assert – origineel velocity-object mag niet veranderd zijn
    expect(velocity.x).toBeCloseTo(originalX);
    expect(velocity.y).toBeCloseTo(originalY);
    // En het resultaat IS anders
    expect(result.x).not.toBeCloseTo(originalX);

  });
});

// ---------------------------------------------------------------------------
// getWindArrow — task 1.3 (wind-controls)
// New signature: getWindArrow(windVector) where windVector = {x, y}
// Returns: {dx, dy} with scale factor 100
// Formula: dx = windVector.x * 100,  dy = windVector.y * 100
// ---------------------------------------------------------------------------
describe('getWindArrow(windVector) — 2D windVector {x, y}', () => {
  test('Noord-wind {x:0, y:-0.1}: dy < 0 en dx ≈ 0', () => {
    // Arrange – Noord-wind blaast omhoog op canvas: negatieve y-component
    const windVector = { x: 0, y: -0.1 };

    // Act
    const arrow = getWindArrow(windVector);

    // Assert
    expect(arrow.dy).toBeLessThan(0);          // pijl omhoog
    expect(Math.abs(arrow.dx)).toBeCloseTo(0); // geen horizontale afwijking

  });

  test('Noord-wind: dy = windVector.y * 100 = -10', () => {
    // Arrange
    const windVector = { x: 0, y: -0.1 };

    // Act
    const arrow = getWindArrow(windVector);

    // Assert – schaalfactor 100: -0.1 * 100 = -10
    expect(arrow.dy).toBeCloseTo(-10);

  });

  test('Diagonale wind {x:0.1, y:-0.1}: dx > 0 en dy < 0', () => {
    // Arrange – Noord-Oost diagonaal
    const windVector = { x: 0.1, y: -0.1 };

    // Act
    const arrow = getWindArrow(windVector);

    // Assert – pijl schuin omhoog-rechts
    expect(arrow.dx).toBeGreaterThan(0);
    expect(arrow.dy).toBeLessThan(0);

  });

  test('Diagonale wind: dx en dy beide gelijk aan vectorcomponent * 100', () => {
    // Arrange
    const windVector = { x: 0.1, y: -0.1 };

    // Act
    const arrow = getWindArrow(windVector);

    // Assert – exacte schaalwaarden
    expect(arrow.dx).toBeCloseTo(10);
    expect(arrow.dy).toBeCloseTo(-10);

  });

  test('Oost-wind {x:0.1, y:0}: dx > 0 en dy ≈ 0', () => {
    // Arrange – zuiver horizontale wind
    const windVector = { x: 0.1, y: 0 };

    // Act
    const arrow = getWindArrow(windVector);

    // Assert
    expect(arrow.dx).toBeCloseTo(10);
    expect(Math.abs(arrow.dy)).toBeCloseTo(0);

  });

  test('Zuid-wind {x:0, y:0.1}: dy > 0 en dx ≈ 0', () => {
    // Arrange – wind blaast omlaag op canvas: positieve y-component
    const windVector = { x: 0, y: 0.1 };

    // Act
    const arrow = getWindArrow(windVector);

    // Assert
    expect(arrow.dy).toBeCloseTo(10);
    expect(Math.abs(arrow.dx)).toBeCloseTo(0);

  });

  test('West-wind {x:-0.1, y:0}: dx < 0 en dy ≈ 0', () => {
    // Arrange – wind naar links
    const windVector = { x: -0.1, y: 0 };

    // Act
    const arrow = getWindArrow(windVector);

    // Assert
    expect(arrow.dx).toBeCloseTo(-10);
    expect(Math.abs(arrow.dy)).toBeCloseTo(0);

  });

  test('Windstilte {x:0, y:0}: dx ≈ 0 en dy ≈ 0 (geen pijl)', () => {
    // Arrange
    const windVector = { x: 0, y: 0 };

    // Act
    const arrow = getWindArrow(windVector);

    // Assert – geen pijl zichtbaar bij windstilte
    expect(Math.abs(arrow.dx)).toBeCloseTo(0);
    expect(Math.abs(arrow.dy)).toBeCloseTo(0);

  });

  test('Resultaat bevat zowel dx als dy eigenschap', () => {
    // Arrange
    const windVector = { x: 0.05, y: -0.05 };

    // Act
    const arrow = getWindArrow(windVector);

    // Assert – object MOET beide eigenschappen hebben
    expect(arrow).toHaveProperty('dx');
    expect(arrow).toHaveProperty('dy');

  });

  test('Schaalfactor 100: max sterkte 0.3 geeft arrow-component van 30', () => {
    // Arrange – maximale windsterkte in beide richtingen
    const windVector = { x: 0.3, y: -0.3 };

    // Act
    const arrow = getWindArrow(windVector);

    // Assert – max pijllengte per as = 0.3 * 100 = 30px
    expect(arrow.dx).toBeCloseTo(30);
    expect(arrow.dy).toBeCloseTo(-30);

  });
});
