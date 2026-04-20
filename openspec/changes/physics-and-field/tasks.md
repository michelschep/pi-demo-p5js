## 1. Tests schrijven (TDD)

- [x] 1.1 Test: `BALL_RADIUS` is 12
- [x] 1.2 Test: `CANVAS_WIDTH` is 900, `CANVAS_HEIGHT` is 600
- [x] 1.3 Test: bal wraps rechts — positie > CANVAS_WIDTH + radius → positie wordt -radius + 1
- [x] 1.4 Test: bal wraps links — positie < -radius → positie wordt CANVAS_WIDTH + radius - 1
- [x] 1.5 Test: geen x-kaatsing — x-snelheid verandert niet bij rechterrand
- [x] 1.6 Test: wrijving — velocity.x na 1 frame = startwaarde × 0.988
- [x] 1.7 Test: wrijving — velocity.y na 1 frame = startwaarde × 0.988
- [x] 1.8 Test: micro-stop — velocity.x = 0.05 wordt 0 na update
- [x] 1.9 Test: bal tot rust — na 600 frames zonder wind is velocity.x ≈ 0
- [x] 1.10 Test: y-kaatsing blijft werken — onderkant kaatst terug
- [x] 1.11 Test: `getWindVector(180, 0.1)` geeft `{x: 0, y: -0.1}` (Z = omhoog)
- [x] 1.12 Test: `getWindVector(0, 0.1)` geeft `{x: 0, y: +0.1}` (N = omlaag)
- [x] 1.13 Test: `getWindVector(90, 0.1)` geeft `{x: -0.1, y: 0}` (O = naar links)
- [x] 1.14 Test: `getWindVector(270, 0.1)` geeft `{x: +0.1, y: 0}` (W = naar rechts)
- [x] 1.15 Test: `getWindVector(0, 0)` geeft `{x: 0, y: 0}` (windstilte)
- [x] 1.16 Test: `drawFieldBorder()` functie bestaat in sketch.js
- [x] 1.17 Test: rand wordt elke frame aangeroepen in draw()

## 2. Windvector formule omdraaien

- [x] 2.1 Pas `getWindVector` aan in `src/wind.js`: `{x: -Math.sin(rad)*strength, y: Math.cos(rad)*strength}`

## 3. Bal-fysica aanpassen

- [x] 3.1 Verander `BALL_RADIUS` van 20 naar 12 in `src/ball.js`
- [x] 3.2 Verander `CANVAS_WIDTH` naar 900 en `CANVAS_HEIGHT` naar 600 in `src/ball.js`
- [x] 3.3 Voeg `FRICTION = 0.988` constante toe in `src/ball.js`
- [x] 3.4 Pas `update()` aan: vermenigvuldig `velocity.x` en `velocity.y` met `FRICTION` elke frame
- [x] 3.5 Pas `update()` aan: zet snelheidscomponent op 0 als `Math.abs(v) < 0.1`
- [x] 3.6 Pas `checkBounds()` aan: vervang x-kaatsing door horizontale wrap-logica

## 4. Visuele aanpassingen in sketch.js

- [x] 4.1 Verander `textSize(11)` naar `textSize(8)` voor het Fibonacci-label
- [x] 4.2 Voeg `drawFieldBorder()` functie toe die een blauwe rect tekent langs de canvasrand
- [x] 4.3 Roep `drawFieldBorder()` aan in `draw()` na `background()`
