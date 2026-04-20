## 1. Tests schrijven (TDD)

- [x] 1.1 Test: twee ballen zelfde colorGroup, ratio < 1.5 → split → totaal 4 ballen
- [x] 1.2 Test: gesplitste ballen hebben `radius ≈ oudRadius × 0.707`
- [x] 1.3 Test: gesplitste ballen hebben zelfde `colorGroup` als origineel
- [x] 1.4 Test: bal r1=18 botst met r2=12 (ratio=1.5) → grote eet kleine, grote.radius ≈ √(18²+12²)
- [x] 1.5 Test: bal r1=20 botst met r2=12 (ratio>1.5) → kleine verdwijnt uit array
- [x] 1.6 Test: zelfde grootte, andere colorGroup → normale botsing (geen split, geen eten)
- [x] 1.7 Test: bal met radius=3 wordt verwijderd na frame-cleanup
- [x] 1.8 Test: bal met radius=4 blijft bestaan
- [x] 1.9 Test: nieuwe bal heeft `radius === BALL_RADIUS` (12)
- [x] 1.10 Test: `colorGroup` is integer 0–5
- [x] 1.11 Test: bal met `colorGroup=0` heeft hue=0° kleur (rood)
- [x] 1.12 Test: `checkBounds` gebruikt `this.radius` voor wrap
- [x] 1.13 Test: `checkBounds` gebruikt `this.radius` voor y-bounce
- [x] 1.14 Test: botsingsdetectie op basis van `r1 + r2` (niet `2 × BALL_RADIUS`)

## 2. Ball class aanpassen

- [x] 2.1 Voeg `this.radius = BALL_RADIUS` toe aan constructor
- [x] 2.2 Voeg `this.colorGroup = Math.floor(Math.random() * 6)` toe aan constructor
- [x] 2.3 Bepaal kleur via `colorGroup`: `hue = colorGroup * 60`, vervang willekeurige hue
- [x] 2.4 Pas `resolveCollision` aan: gebruik `this.radius + other.radius` als collision distance en overlap
- [x] 2.5 Pas `checkBounds` aan: vervang alle `BALL_RADIUS` door `this.radius`
- [x] 2.6 Voeg `MIN_RADIUS = 4` constante toe en exporteer

## 3. Lifecycle-logica in sketch.js

- [x] 3.1 Vervang de botsingsloop door een lifecycle-aware variant die split/eat/normal onderscheidt
- [x] 3.2 Implementeer `splitBall(ball)`: geeft array van 2 nieuwe ballen terug met `radius * 0.707` en loodrechte snelheid
- [x] 3.3 Implementeer `eatBall(larger, smaller)`: `larger.radius = Math.sqrt(r1²+r2²)`, update kleur/stroke
- [x] 3.4 Voeg frame-cleanup toe: filter ballen met `radius < MIN_RADIUS` na elke draw-iteratie
- [x] 3.5 Pas `ellipse()` aanroep aan: gebruik `ball.radius` i.p.v. `BALL_RADIUS`
