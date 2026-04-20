/**
 * Wind force module for the bouncing-ball-wind simulation.
 *
 * Provides:
 *  - getWindVector(angleDeg, strength)  → {x, y} 2-D wind vector (compass: 0°=N, CW)
 *  - applyWind(velocity, windForce)     → polymorphic: accepts scalar OR {x,y} wind
 *  - getWindArrow(windForce)            → polymorphic: accepts scalar OR {x,y} wind
 *
 * Legacy exports kept for backward compatibility:
 *  - calculateWind(frameCount)          → scalar sinusoidal wind force
 *  - WIND_AMPLITUDE, WIND_FREQUENCY
 */

const WIND_AMPLITUDE = 0.08;
const WIND_FREQUENCY = 0.02;

/**
 * Compute the sinusoidal wind force for a given frame counter (legacy).
 * @param  {number} frameCount
 * @returns {number} Horizontal wind force
 */
function calculateWind(frameCount) {
  return Math.sin(frameCount * WIND_FREQUENCY) * WIND_AMPLITUDE;
}

/**
 * Compute a 2-D wind vector from compass bearing and strength.
 *
 * Compass convention: 0° = North (up on canvas, y negative), clockwise.
 * Formula: { x: −sin(θ) * strength, y: cos(θ) * strength }
 *
 * @param  {number} angleDeg  Compass angle in degrees (0 = N, 90 = E, 180 = S, 270 = W)
 * @param  {number} strength  Wind strength (≥ 0)
 * @returns {{ x: number, y: number }} 2-D wind vector in canvas coordinates
 */
function getWindVector(angleDeg, strength) {
  const rad = angleDeg * (Math.PI / 180);
  return {
    x: -Math.sin(rad) * strength,
    y: Math.cos(rad) * strength,
  };
}

/**
 * Apply wind to a velocity vector. Polymorphic:
 *  - Legacy: windForce is a number  → only x is updated
 *  - New:    windForce is {x, y}    → both x and y are updated
 *
 * Always returns a NEW object (does not mutate velocity).
 *
 * @param  {{ x: number, y: number }} velocity
 * @param  {number | { x: number, y: number }} windForce
 * @returns {{ x: number, y: number }} Updated velocity
 */
function applyWind(velocity, windForce) {
  if (typeof windForce === 'number') {
    // Legacy scalar: only horizontal component
    return { x: velocity.x + windForce, y: velocity.y };
  }
  // 2-D wind vector: both components
  return {
    x: velocity.x + windForce.x,
    y: velocity.y + windForce.y,
  };
}

/**
 * Return an arrow descriptor for visualising the wind. Polymorphic:
 *  - Legacy: windForce is a number  → returns { dx, dy: 0 }
 *  - New:    windForce is {x, y}    → returns { dx, dy }
 *
 * Scale factor 100 maps maximum force (0.3) to a 30-px arrow.
 *
 * @param  {number | { x: number, y: number }} windForce
 * @returns {{ dx: number, dy: number }}
 */
function getWindArrow(windForce) {
  const ARROW_SCALE = 100;
  if (typeof windForce === 'number') {
    return { dx: windForce * ARROW_SCALE, dy: 0 };
  }
  return {
    dx: windForce.x * ARROW_SCALE,
    dy: windForce.y * ARROW_SCALE,
  };
}

// Exported for Node.js (Jest) - guard prevents ReferenceError in the browser
if (typeof module !== 'undefined') {
  module.exports = {
    calculateWind,
    getWindVector,
    applyWind,
    getWindArrow,
    WIND_AMPLITUDE,
    WIND_FREQUENCY,
  };
}
