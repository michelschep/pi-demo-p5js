/**
 * wind-controls.js — Direction-widget & strength-slider logic
 *
 * Initialises:
 *  - A circular canvas compass widget (#wind-direction) that lets the user
 *    click or drag to set wind direction (0° = N, clockwise).
 *  - A range slider (#wind-strength) for wind magnitude [0, 0.3].
 *  - A live readout span (#wind-display) that shows current degrees & strength.
 *
 * Public API:
 *  - getWindState() → { angleDeg: number, strength: number }
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // Module state
  // -------------------------------------------------------------------------
  let _angleDeg = 0;    // 0° = North, clockwise
  let _strength = 0.1;  // default matches slider value attribute

  // -------------------------------------------------------------------------
  // Canvas / context references (populated in init)
  // -------------------------------------------------------------------------
  let _canvas = null;
  let _ctx    = null;
  let _slider = null;
  let _display = null;

  // -------------------------------------------------------------------------
  // Compass drawing
  // -------------------------------------------------------------------------
  function drawCompass() {
    if (!_ctx) return;

    const W   = _canvas.width;
    const H   = _canvas.height;
    const cx  = W / 2;
    const cy  = H / 2;
    const r   = Math.min(cx, cy) - 6; // ring radius with margin

    _ctx.clearRect(0, 0, W, H);

    // Circle ring
    _ctx.beginPath();
    _ctx.arc(cx, cy, r, 0, Math.PI * 2);
    _ctx.strokeStyle = '#3a3f5c';
    _ctx.lineWidth   = 2;
    _ctx.stroke();

    // Cross-hairs
    _ctx.strokeStyle = '#2e3248';
    _ctx.lineWidth   = 1;
    _ctx.beginPath();
    _ctx.moveTo(cx, cy - r); _ctx.lineTo(cx, cy + r);
    _ctx.moveTo(cx - r, cy); _ctx.lineTo(cx + r, cy);
    _ctx.stroke();

    // Direction dot on the ring
    const rad = _angleDeg * (Math.PI / 180);
    const dx  = cx + Math.sin(rad) * r;
    const dy  = cy - Math.cos(rad) * r;

    _ctx.beginPath();
    _ctx.arc(dx, dy, 7, 0, Math.PI * 2);
    _ctx.fillStyle   = '#ffdc50';
    _ctx.fill();
    _ctx.strokeStyle = '#b8960a';
    _ctx.lineWidth   = 1.5;
    _ctx.stroke();

    // Line from centre to dot
    _ctx.beginPath();
    _ctx.moveTo(cx, cy);
    _ctx.lineTo(dx, dy);
    _ctx.strokeStyle = '#ffdc5088';
    _ctx.lineWidth   = 1.5;
    _ctx.stroke();
  }

  // -------------------------------------------------------------------------
  // Display update
  // -------------------------------------------------------------------------
  function updateDisplay() {
    if (!_display) return;
    const deg = Math.round(_angleDeg);
    const str = _strength.toFixed(2);
    _display.textContent = `${deg}° | ${str}`;
  }

  // -------------------------------------------------------------------------
  // Angle calculation from mouse event on the canvas
  // -------------------------------------------------------------------------
  function angleFromEvent(e) {
    const rect = _canvas.getBoundingClientRect();
    const mx   = e.clientX - rect.left;
    const my   = e.clientY - rect.top;
    const cx   = _canvas.width  / 2;
    const cy   = _canvas.height / 2;
    // atan2 with (x, -y) gives compass bearing: 0 = up, CW positive
    let deg = Math.atan2(mx - cx, cy - my) * (180 / Math.PI);
    if (deg < 0) deg += 360;
    return deg;
  }

  // -------------------------------------------------------------------------
  // Mouse event handlers (click + drag)
  // -------------------------------------------------------------------------
  let _dragging = false;

  function onPointerDown(e) {
    _dragging = true;
    _angleDeg = angleFromEvent(e);
    drawCompass();
    updateDisplay();
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!_dragging) return;
    _angleDeg = angleFromEvent(e);
    drawCompass();
    updateDisplay();
    e.preventDefault();
  }

  function onPointerUp() {
    _dragging = false;
  }

  // -------------------------------------------------------------------------
  // Slider handler
  // -------------------------------------------------------------------------
  function onSliderChange(e) {
    _strength = parseFloat(e.target.value);
    updateDisplay();
  }

  // -------------------------------------------------------------------------
  // Initialisation
  // -------------------------------------------------------------------------
  function init() {
    _canvas  = document.getElementById('wind-direction');
    _slider  = document.getElementById('wind-strength');
    _display = document.getElementById('wind-display');

    if (!_canvas || !_slider || !_display) return; // graceful when DOM is absent

    _ctx      = _canvas.getContext('2d');
    _strength = parseFloat(_slider.value);

    // Canvas pointer events
    _canvas.addEventListener('mousedown',  onPointerDown);
    _canvas.addEventListener('mousemove',  onPointerMove);
    _canvas.addEventListener('mouseup',    onPointerUp);
    _canvas.addEventListener('mouseleave', onPointerUp);

    // Slider event
    _slider.addEventListener('input', onSliderChange);

    // Initial render
    drawCompass();
    updateDisplay();
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  /**
   * Returns the current wind state as selected by the UI controls.
   * @returns {{ angleDeg: number, strength: number }}
   */
  function getWindState() {
    return { angleDeg: _angleDeg, strength: _strength };
  }

  // Run init after DOM is ready
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  // Export for Node.js (Jest) and browser global
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getWindState };
  } else if (typeof window !== 'undefined') {
    window.getWindState = getWindState;
  }
})();
