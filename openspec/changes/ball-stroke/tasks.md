## 1. strokeColor in Ball

- [ ] 1.1 Voeg constante `STROKE_WEIGHT = 3` toe in `src/ball.js` naast `BALL_RADIUS`
- [x] 1.2 Bereken in de `Ball`-constructor `this.strokeColor` via `hsbToRgb((hue + 180) % 360, 0.8, 0.9)` waarbij `hue` de willekeurige hue is die ook voor `this.color` gebruikt wordt

## 2. Tekenlogica in sketch

- [x] 2.1 Voeg in de draw-loop van `src/sketch.js` vóór `fill()` de aanroep `stroke(ball.strokeColor.r, ball.strokeColor.g, ball.strokeColor.b)` toe
- [x] 2.2 Voeg `strokeWeight(STROKE_WEIGHT)` toe (importeer of hergebruik de constante uit `ball.js`)

## 3. Tests

- [x] 3.1 Schrijf Jest-tests in `__tests__/ball-stroke.test.js` die controleren: elke nieuwe `Ball` heeft een `strokeColor`-property met `r`, `g`, `b` waarden (0–255), en de randkleur verandert niet na `update()`, `checkBounds()` of `resolveCollision()`
- [x] 3.2 Voeg een test toe die verifieert dat de hue van `strokeColor` ±180° verschilt van de hue van `color` (complementair)
