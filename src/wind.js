/**
 * Wind force module for the bouncing-ball-wind simulation.
 *
 * Wind is modelled as a sinusoidal horizontal force:
 *   windForce = sin(frameCount * WIND_FREQUENCY) * WIND_AMPLITUDE
 *
 * Constants follow the spec:
 *   WIND_AMPLITUDE  = 0.08   ← tweaked from 0.3 so wind is subtle vs gravity (spec change)
 *   WIND_FREQUENCY  = 0.02
 */

const WIND_AMPLITUDE = 0.08;
const WIND_FREQUENCY = 0.02;

/**
 * Compute the wind force for a given frame counter.
 * @param  {number} frameCount  Current p5.js frameCount (or any integer ≥ 0)
 * @returns {number} Horizontal wind force (positive = rightward, negative = leftward)
 */
function calculateWind(frameCount) {
  return Math.sin(frameCount * WIND_FREQUENCY) * WIND_AMPLITUDE;
}

/**
 * Apply a horizontal wind force to a velocity vector.
 * Only the x component is modified; y is untouched.
 *
 * @param  {{ x: number, y: number }} velocity   Current velocity
 * @param  {number}                   windForce  Horizontal force to add
 * @returns {{ x: number, y: number }} New velocity object
 */
function applyWind(velocity, windForce) {
  return {
    x: velocity.x + windForce,
    y: velocity.y,
  };
}

/**
 * Return an arrow descriptor for visualising the wind.
 * The arrow's dx is proportional to windForce (positive = right, negative = left).
 * A scale factor of 100 maps the maximum force (0.3) to a 30-px arrow.
 *
 * @param  {number} windForce
 * @returns {{ dx: number }} Arrow displacement along x-axis
 */
function getWindArrow(windForce) {
  const ARROW_SCALE = 100;
  return { dx: windForce * ARROW_SCALE };
}

// Exported for Node.js (Jest) — guard prevents ReferenceError in the browser
if (typeof module !== 'undefined') {
  module.exports = { calculateWind, applyWind, getWindArrow, WIND_AMPLITUDE, WIND_FREQUENCY };
}
