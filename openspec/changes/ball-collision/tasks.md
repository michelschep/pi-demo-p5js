## 1. Botsingsdetectie en -respons in Ball

- [x] 1.1 Voeg methode `resolveCollision(other)` toe aan `Ball` in `src/ball.js` die de botsingsas berekent, de normaalcomponent van de snelheid uitwisselt (alleen als ballen naar elkaar toe bewegen) en posities corrigeert zodat er geen overlap is

## 2. Parencheck in sketch

- [x] 2.1 Roep `resolveCollision` aan voor elk uniek balpaar in de `draw`-loop van `src/sketch.js` (na `update` en `checkBounds`)

## 3. Tests

- [x] 3.1 Schrijf Jest-tests in `__tests__/ball-collision.test.js` die de drie spec-scenario's dekken: botsing gedetecteerd, geen botsing op afstand, frontale botsing wisselt snelheden, schuine botsing past alleen normaalcomponent aan, overlap opgeheven na botsing
