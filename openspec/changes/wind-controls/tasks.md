## 1. Tests herschrijven (TDD)

- [x] 1.1 Schrijf tests voor `getWindVector(angleDeg, strength)` in `__tests__/wind-force.test.js`: N=0°, O=90°, Z=180°, W=270°, windstilte
- [x] 1.2 Schrijf tests voor `applyWind(velocity, windVector)` met 2D windvector `{x, y}`
- [x] 1.3 Schrijf tests voor `getWindArrow(windVector)` met `{dx, dy}` output
- [x] 1.4 Schrijf DOM-tests voor `wind-controls` in `__tests__/wind-controls.test.js`: slider aanwezig (min/max/default), widget canvas aanwezig, N/Z/W/O labels, numerieke weergave

## 2. wind.js aanpassen

- [x] 2.1 Verwijder `calculateWind(frameCount)` en `WIND_FREQUENCY`
- [x] 2.2 Voeg `getWindVector(angleDeg, strength)` toe: `{x: Math.sin(rad)*strength, y: -Math.cos(rad)*strength}`
- [x] 2.3 Update `applyWind(velocity, windVector)` zodat zowel `velocity.x` als `velocity.y` worden aangepast
- [x] 2.4 Update `getWindArrow(windVector)` zodat het `{dx, dy}` teruggeeft (schaalfactor 100)
- [x] 2.5 Update module.exports met nieuwe exports, verwijder `calculateWind` en `WIND_FREQUENCY`

## 3. index.html — UI-controls toevoegen

- [x] 3.1 Voeg `<div id="wind-ui">` toe onder het canvas met slider (`id="wind-strength"`, min=0, max=0.3, step=0.01, value=0.1) en bijschrift
- [x] 3.2 Voeg `<canvas id="wind-direction" width="120" height="120">` toe in de wind-ui div met N/Z/W/O labels
- [x] 3.3 Voeg een `<span id="wind-display">` toe die graden en sterkte toont
- [x] 3.4 Stijl de controls passend bij de donkere achtergrond (inline style of `<style>` blok)

## 4. src/wind-controls.js — widget logica

- [x] 4.1 Maak `src/wind-controls.js`: initialiseer richtingswidget, teken de cirkel met labels en richtingspunt
- [x] 4.2 Implementeer klik- en sleep-handler op het widget-canvas: bereken hoek uit muispositie t.o.v. middelpunt
- [x] 4.3 Exporteer `getWindState()` die `{angleDeg, strength}` teruggeeft op basis van huidige slider- en widgetwaarden
- [x] 4.4 Update `wind-display` bij elke wijziging van slider of widget

## 5. sketch.js aanpassen

- [x] 5.1 Vervang `calculateWind(frameCount)` door `getWindState()` uit `wind-controls.js`
- [x] 5.2 Roep `applyWind(ball.velocity, windVector)` aan met de 2D windvector
- [x] 5.3 Update `drawWindArrow(arrow.dx)` naar `drawWindArrow(arrow.dx, arrow.dy)` en teken de pijl in 2D richting
- [x] 5.4 Voeg `<script src="src/wind-controls.js">` toe aan `index.html` vóór `sketch.js`
