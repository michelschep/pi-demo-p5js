## 1. Kleur-property in Ball

- [ ] 1.1 Voeg een HSB-naar-RGB hulpfunctie toe in `src/ball.js` die een hue (0–360), saturatie en brightness omzet naar `{ r, g, b }`
- [ ] 1.2 Wijs in de `Ball`-constructor een willekeurige kleur toe via `this.color = hsbToRgb(Math.random() * 360, 0.8, 0.9)`

## 2. Tekenlogica in sketch

- [ ] 2.1 Vervang `fill(100, 180, 255)` in de draw-loop van `src/sketch.js` door `fill(ball.color.r, ball.color.g, ball.color.b)`

## 3. Tests

- [ ] 3.1 Schrijf Jest-tests in `__tests__/per-ball-color.test.js` die controleren: elke nieuwe `Ball` heeft een `color`-property met `r`, `g`, `b` waarden (0–255), en de kleur verandert niet na `update()`, `checkBounds()` of `resolveCollision()`
