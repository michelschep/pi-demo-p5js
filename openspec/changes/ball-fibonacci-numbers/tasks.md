## 1. Fibonacci-reeks in Ball

- [x] 1.1 Voeg de constante `FIBONACCI = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89]` en module-level teller `let _fibIndex = 0` toe in `src/ball.js`
- [x] 1.2 Wijs in de `Ball`-constructor `this.fibonacciNumber = FIBONACCI[_fibIndex % FIBONACCI.length]` toe en verhoog `_fibIndex` met 1
- [x] 1.3 Exporteer een `resetFibIndex()` testhelper die `_fibIndex = 0` zet (alleen beschikbaar via `module.exports` in Node.js context)

## 2. Label renderen in sketch

- [x] 2.1 Voeg na de `ellipse()`-aanroep per bal de luma-berekening toe: `luma = 0.299·R + 0.587·G + 0.114·B` op basis van `ball.color`, en kies `fill(0)` bij luma ≥ 128 of `fill(255)` bij luma < 128
- [x] 2.2 Roep `noStroke()`, `textSize(11)`, `textAlign(CENTER, CENTER)` en `text(ball.fibonacciNumber, ball.position.x, ball.position.y)` aan om het label gecentreerd in de bal te tekenen

## 3. Tests

- [x] 3.1 Schrijf Jest-tests in `__tests__/ball-fibonacci-numbers.test.js` die controleren: de eerste bal na `resetFibIndex()` heeft `fibonacciNumber === 1`, de tweede `=== 2`, de derde `=== 3`
- [x] 3.2 Voeg een test toe die verifieert dat na 10 ballen de cyclus herstart: de 11e bal heeft `fibonacciNumber === 1`
- [x] 3.3 Voeg een test toe die verifieert dat `fibonacciNumber` onveranderd blijft na `update()`, `checkBounds()` en `resolveCollision()`
