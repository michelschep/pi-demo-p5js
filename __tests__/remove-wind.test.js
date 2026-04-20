/**
 * TDD: remove-wind
 * These tests verify that all wind-related files and references have been removed.
 * They are expected to FAIL until the implementation tasks are completed.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const sketchJs = fs.readFileSync(path.join(rootDir, 'src', 'sketch.js'), 'utf8');

describe('remove-wind: wind UI and files are fully removed', () => {
  // 1.1 Test: `#wind-ui` element bestaat niet meer in de DOM (in index.html)
  test('1.1 index.html does not contain a #wind-ui element', () => {
    expect(indexHtml).not.toMatch(/id=["']wind-ui["']/);
  });

  // 1.2 Test: `<script src="src/wind-controls.js">` bestaat niet meer in `index.html`
  test('1.2 index.html does not contain a script tag for wind-controls.js', () => {
    expect(indexHtml).not.toMatch(/src=["']src\/wind-controls\.js["']/);
  });

  // 1.3 Test: `wind-controls.js` bestand bestaat niet meer op schijf
  test('1.3 src/wind-controls.js does not exist on disk', () => {
    const filePath = path.join(rootDir, 'src', 'wind-controls.js');
    expect(fs.existsSync(filePath)).toBe(false);
  });

  // 1.4 Test: `wind.js` bestand bestaat niet meer op schijf
  test('1.4 src/wind.js does not exist on disk', () => {
    const filePath = path.join(rootDir, 'src', 'wind.js');
    expect(fs.existsSync(filePath)).toBe(false);
  });

  // 1.5 Test: `<script src="src/wind.js">` bestaat niet meer in `index.html`
  test('1.5 index.html does not contain a script tag for wind.js', () => {
    expect(indexHtml).not.toMatch(/src=["']src\/wind\.js["']/);
  });

  // 1.6 Test: `sketch.js` bevat geen aanroep naar `applyWind`, `getWindVector` of `getWindState`
  test('1.6 sketch.js does not call applyWind, getWindVector or getWindState', () => {
    expect(sketchJs).not.toMatch(/applyWind\s*\(/);
    expect(sketchJs).not.toMatch(/getWindVector\s*\(/);
    expect(sketchJs).not.toMatch(/getWindState\s*\(/);
  });

  // 1.7 Test: `sketch.js` bevat geen aanroep naar `drawWindArrow`
  test('1.7 sketch.js does not call drawWindArrow', () => {
    expect(sketchJs).not.toMatch(/drawWindArrow\s*\(/);
  });
});
