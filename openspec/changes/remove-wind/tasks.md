## 1. Tests schrijven (TDD)

- [ ] 1.1 Test: `#wind-ui` element bestaat niet meer in de DOM
- [ ] 1.2 Test: `<script src="src/wind-controls.js">` bestaat niet meer in `index.html`
- [ ] 1.3 Test: `wind-controls.js` bestand bestaat niet meer op schijf
- [ ] 1.4 Test: `wind.js` bestand bestaat niet meer op schijf
- [ ] 1.5 Test: `<script src="src/wind.js">` bestaat niet meer in `index.html`
- [ ] 1.6 Test: `sketch.js` bevat geen aanroep naar `applyWind`, `getWindVector` of `getWindState`
- [ ] 1.7 Test: `sketch.js` bevat geen aanroep naar `drawWindArrow`

## 2. Bestanden verwijderen

- [x] 2.1 Verwijder `src/wind.js`
- [x] 2.2 Verwijder `src/wind-controls.js`
- [x] 2.3 Verwijder `__tests__/wind-force.test.js`
- [x] 2.4 Verwijder `__tests__/wind-controls.test.js`

## 3. index.html opruimen

- [x] 3.1 Verwijder `<script src="src/wind.js">` en `<script src="src/wind-controls.js">`
- [x] 3.2 Verwijder de `#wind-ui` div inclusief alle inhoud
- [x] 3.3 Verwijder de wind-gerelateerde CSS-regels (`#wind-ui`, `.wind-compass`, `#wind-display`)

## 4. sketch.js opruimen

- [x] 4.1 Verwijder de `getWindState` / `getWindVector` / `applyWind` aanroepen uit de draw-loop
- [x] 4.2 Verwijder de `drawWindArrow` aanroep en de functiedefinitie
