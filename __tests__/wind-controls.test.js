/**
 * TDD tests: DOM-structuur voor wind-controls (task 1.4)
 *
 * Spec: openspec/changes/wind-controls/specs/wind-controls/spec.md
 *
 * Covers:
 *  - Slider aanwezig met juiste min / max / default-waarde (id="wind-strength")
 *  - Widget canvas aanwezig (id="wind-direction", 120×120 px)
 *  - Kompasrichtingen N, Z, W en O als labels aanwezig in de HTML
 *  - Numerieke weergave-element aanwezig (id="wind-display")
 */

const fs   = require('fs');
const path = require('path');

// Read index.html once for all tests
const htmlPath = path.join(__dirname, '..', 'index.html');
let html;
beforeAll(() => {
  html = fs.readFileSync(htmlPath, 'utf-8');
});

// ---------------------------------------------------------------------------
// Scenario: Slider aanwezig met juiste grenzen
// ---------------------------------------------------------------------------
describe('wind-controls – windsterkte-slider (#wind-strength)', () => {
  test('index.html bevat een <input type="range"> met id="wind-strength"', () => {
    // Arrange/Act: html is read in beforeAll
    // Assert
    expect(html).toMatch(/<input[^>]*type\s*=\s*["']range["'][^>]*id\s*=\s*["']wind-strength["'][^>]*>/i);
  });

  test('slider heeft min="0"', () => {
    // Spec: minimumwaarde SHALL 0 zijn
    // Matches: min="0" or min='0'
    // We grab the wind-strength input block first (between the tag) then check attr
    const inputMatch = html.match(/<input[^>]*id\s*=\s*["']wind-strength["'][^>]*>/i)
                    || html.match(/<input[^>]*type\s*=\s*["']range["'][^>]*id\s*=\s*["']wind-strength["'][^>]*>/i);
    expect(inputMatch).not.toBeNull();
    const tag = inputMatch[0];
    expect(tag).toMatch(/min\s*=\s*["']0["']/i);

  });

  test('slider heeft max="0.3"', () => {
    // Spec: maximumwaarde SHALL 0.3 zijn
    const inputMatch = html.match(/<input[^>]*id\s*=\s*["']wind-strength["'][^>]*>/i);
    expect(inputMatch).not.toBeNull();
    const tag = inputMatch[0];
    expect(tag).toMatch(/max\s*=\s*["']0\.3["']/i);

  });

  test('slider heeft step="0.01"', () => {
    // Spec: stapgrootte SHALL 0.01 zijn
    const inputMatch = html.match(/<input[^>]*id\s*=\s*["']wind-strength["'][^>]*>/i);
    expect(inputMatch).not.toBeNull();
    const tag = inputMatch[0];
    expect(tag).toMatch(/step\s*=\s*["']0\.01["']/i);

  });

  test('slider heeft standaardwaarde value="0.1"', () => {
    // Spec: standaardwaarde SHALL 0.1 zijn
    const inputMatch = html.match(/<input[^>]*id\s*=\s*["']wind-strength["'][^>]*>/i);
    expect(inputMatch).not.toBeNull();
    const tag = inputMatch[0];
    expect(tag).toMatch(/value\s*=\s*["']0\.1["']/i);

  });

  test('slider zit binnen een #wind-ui container', () => {
    // Spec: controls horen in een logisch blok (div#wind-ui)
    // We check that wind-ui div exists AND wind-strength appears after it
    const windUiIndex       = html.search(/id\s*=\s*["']wind-ui["']/i);
    const windStrengthIndex = html.search(/id\s*=\s*["']wind-strength["']/i);

    expect(windUiIndex).toBeGreaterThanOrEqual(0);
    expect(windStrengthIndex).toBeGreaterThanOrEqual(0);
    expect(windStrengthIndex).toBeGreaterThan(windUiIndex);

  });
});

// ---------------------------------------------------------------------------
// Scenario: Widget-canvas aanwezig
// ---------------------------------------------------------------------------
describe('wind-controls – richtingswidget canvas (#wind-direction)', () => {
  test('index.html bevat een <canvas> met id="wind-direction"', () => {
    // Spec: canvas-element SHALL aanwezig zijn
    expect(html).toMatch(/<canvas[^>]*id\s*=\s*["']wind-direction["'][^>]*>/i);

  });

  test('widget-canvas heeft width="120"', () => {
    // Spec: 120 × 120 px
    const canvasMatch = html.match(/<canvas[^>]*id\s*=\s*["']wind-direction["'][^>]*>/i);
    expect(canvasMatch).not.toBeNull();
    expect(canvasMatch[0]).toMatch(/width\s*=\s*["']120["']/i);

  });

  test('widget-canvas heeft height="120"', () => {
    // Spec: 120 × 120 px
    const canvasMatch = html.match(/<canvas[^>]*id\s*=\s*["']wind-direction["'][^>]*>/i);
    expect(canvasMatch).not.toBeNull();
    expect(canvasMatch[0]).toMatch(/height\s*=\s*["']120["']/i);

  });

  test('widget-canvas zit binnen de #wind-ui container', () => {
    // Spec: widget hoort in hetzelfde blok als de slider
    const windUiIndex         = html.search(/id\s*=\s*["']wind-ui["']/i);
    const windDirectionIndex  = html.search(/id\s*=\s*["']wind-direction["']/i);

    expect(windUiIndex).toBeGreaterThanOrEqual(0);
    expect(windDirectionIndex).toBeGreaterThanOrEqual(0);
    expect(windDirectionIndex).toBeGreaterThan(windUiIndex);

  });
});

// ---------------------------------------------------------------------------
// Scenario: Kompasrichtingen N / Z / W / O als labels
// ---------------------------------------------------------------------------
describe('wind-controls – kompasrichtingen N, Z, W, O', () => {
  test('label "N" (Noord) is aanwezig in de HTML', () => {
    // Spec: N SHALL zichtbaar zijn (boven in het widget)
    // Matches standalone N character (not part of a longer word) in HTML text
    expect(html).toMatch(/>\s*N\s*</);

  });

  test('label "Z" (Zuid) is aanwezig in de HTML', () => {
    // Spec: Z SHALL zichtbaar zijn (onder in het widget)
    expect(html).toMatch(/>\s*Z\s*</);

  });

  test('label "W" (West) is aanwezig in de HTML', () => {
    // Spec: W SHALL zichtbaar zijn (links in het widget)
    expect(html).toMatch(/>\s*W\s*</);

  });

  test('label "O" (Oost) is aanwezig in de HTML', () => {
    // Spec: O SHALL zichtbaar zijn (rechts in het widget)
    expect(html).toMatch(/>\s*O\s*</);

  });

  test('alle vier kompasrichtingen staan na de #wind-ui opening tag', () => {
    // Spec: de labels horen in de wind-ui container te staan, niet erbuiten
    const windUiIndex = html.search(/id\s*=\s*["']wind-ui["']/i);
    expect(windUiIndex).toBeGreaterThanOrEqual(0);

    const afterWindUi = html.slice(windUiIndex);
    expect(afterWindUi).toMatch(/>\s*N\s*</);
    expect(afterWindUi).toMatch(/>\s*Z\s*</);
    expect(afterWindUi).toMatch(/>\s*W\s*</);
    expect(afterWindUi).toMatch(/>\s*O\s*</);

  });
});

// ---------------------------------------------------------------------------
// Scenario: Numerieke weergave (graden + sterkte)
// ---------------------------------------------------------------------------
describe('wind-controls – numerieke weergave (#wind-display)', () => {
  test('index.html bevat een element met id="wind-display"', () => {
    // Spec: huidige windrichting (graden) en sterkte SHALL numeriek getoond worden
    expect(html).toMatch(/id\s*=\s*["']wind-display["']/i);

  });

  test('#wind-display is een <span> element', () => {
    // Spec-implicatie: inline weergave past bij een <span>
    expect(html).toMatch(/<span[^>]*id\s*=\s*["']wind-display["'][^>]*>/i);

  });

  test('#wind-display staat na de slider en het widget-canvas', () => {
    // Spec: weergave staat onder de controls
    const sliderIndex  = html.search(/id\s*=\s*["']wind-strength["']/i);
    const canvasIndex  = html.search(/id\s*=\s*["']wind-direction["']/i);
    const displayIndex = html.search(/id\s*=\s*["']wind-display["']/i);

    expect(displayIndex).toBeGreaterThan(sliderIndex);
    expect(displayIndex).toBeGreaterThan(canvasIndex);

  });

  test('#wind-display zit binnen de #wind-ui container', () => {
    // Spec: alle wind-controls horen bij elkaar in #wind-ui
    const windUiIndex   = html.search(/id\s*=\s*["']wind-ui["']/i);
    const displayIndex  = html.search(/id\s*=\s*["']wind-display["']/i);

    expect(windUiIndex).toBeGreaterThanOrEqual(0);
    expect(displayIndex).toBeGreaterThan(windUiIndex);

  });
});

// ---------------------------------------------------------------------------
// Scenario: wind-controls.js script ingeladen
// ---------------------------------------------------------------------------
describe('wind-controls – script tag aanwezig', () => {
  test('index.html laadt src/wind-controls.js via een <script> tag', () => {
    // Spec task 5.4: wind-controls.js moet geladen worden vóór sketch.js
    expect(html).toMatch(/<script[^>]*src\s*=\s*["'][^"']*wind-controls\.js["'][^>]*>/i);

  });

  test('wind-controls.js wordt geladen vóór sketch.js', () => {
    // Spec task 5.4: volgorde is belangrijk voor initialisatie
    const windControlsIndex = html.search(/wind-controls\.js/i);
    const sketchIndex       = html.search(/sketch\.js/i);

    expect(windControlsIndex).toBeGreaterThanOrEqual(0);
    expect(sketchIndex).toBeGreaterThanOrEqual(0);
    expect(windControlsIndex).toBeLessThan(sketchIndex);

  });
});
