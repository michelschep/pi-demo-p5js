/**
 * wind-vector.js — pure wind-vector math (no UI, no global state).
 *
 * Kept as a standalone utility so that physics-and-field tests (1.11–1.15)
 * that test getWindVector continue to work after src/wind.js was removed.
 *
 * Formula (compass convention used in this project):
 *   x = -sin(angleDeg) * strength
 *   y =  cos(angleDeg) * strength
 *
 * Examples:
 *   N (0°)   → { x:  0,  y: +s }  (wind pushes down on screen)
 *   Z (180°) → { x:  0,  y: -s }  (wind pushes up on screen)
 *   O (90°)  → { x: -s,  y:  0 }  (wind pushes left)
 *   W (270°) → { x: +s,  y:  0 }  (wind pushes right)
 */

/**
 * Convert compass-bearing + strength into a 2-D vector.
 *
 * @param {number} angleDeg  Compass bearing in degrees (0 = N, 90 = E/O, 180 = S/Z, 270 = W)
 * @param {number} strength  Scalar wind strength (e.g. 0.1)
 * @returns {{ x: number, y: number }}
 */
function getWindVector(angleDeg, strength) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: -Math.sin(rad) * strength,
    y:  Math.cos(rad) * strength,
  };
}

if (typeof module !== 'undefined') {
  module.exports = { getWindVector };
}
