## 1. Wind verzwakken

- [ ] 1.1 Verander `WIND_AMPLITUDE` in `src/wind.js` van `0.3` naar `0.08`
- [ ] 1.2 Controleer dat de windpijl-visualisatie nog steeds zichtbaar is (schaal 100 → max ±8px arrow)

## 2. Multi-bal ondersteuning

- [ ] 2.1 Vervang `let ball` door `let balls = []` in `src/sketch.js`
- [ ] 2.2 Maak in `setup()` een startbal aan en voeg deze toe aan de `balls`-array
- [ ] 2.3 Pas de `draw()`-loop aan om over alle ballen in `balls` te itereren (physics update + tekenen)

## 3. Klik-om-te-spawnen

- [ ] 3.1 Voeg een `mousePressed()`-functie toe in `src/sketch.js`
- [ ] 3.2 Controleer in `mousePressed()` of de klik binnen het canvas valt (`mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height`)
- [ ] 3.3 Maak een nieuwe `Ball` aan op `{x: mouseX, y: mouseY}` met beginsnelheid `{x: 0, y: 0}` en voeg toe aan `balls`

## 4. Verificatie

- [ ] 4.1 Test dat wind zichtbaar maar niet dominant is: bal beweegt voornamelijk verticaal
- [ ] 4.2 Test dat klikken op canvas een nieuwe bal spawnt die omlaag valt
- [ ] 4.3 Test dat klikken buiten canvas geen bal spawnt
- [ ] 4.4 Test dat alle ballen stuiteren en wind ontvangen
