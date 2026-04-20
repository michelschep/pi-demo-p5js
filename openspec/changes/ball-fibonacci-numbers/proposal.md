## Why

De ballen zijn visueel onderscheidbaar door kleur, maar hebben geen identifier. Door elke bal een Fibonacci-getal toe te kennen krijgt de gebruiker direct een speels en herkenbaar label — Fibonacci-getallen passen bij het wiskundige, fysische karakter van de simulatie.

## What Changes

- Elke `Ball` krijgt bij aanmaak een Fibonacci-getal toegewezen (cyclisch uit de reeks: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, …)
- Het getal wordt gecentreerd in de bal weergegeven via p5.js tekst-rendering
- Lettergrootte is klein genoeg om altijd binnen de cirkel (radius 20px) te passen
- Kleur van de tekst contrasteert met de vulkleur van de bal (wit of zwart afhankelijk van helderheid)

## Capabilities

### New Capabilities

*(geen)*

### Modified Capabilities

- `bouncing-ball`: Bal krijgt een zichtbaar Fibonacci-getal label gecentreerd in de cirkel; de tekenlogica in de draw-loop wordt uitgebreid met tekst-rendering

## Impact

- `src/ball.js`: toevoeging van `fibonacciNumber`-property in de constructor
- `src/sketch.js`: draw-loop uitgebreid met `text()`, `textAlign()`, `textSize()`, en `fill()` voor het label
- `__tests__/`: nieuwe tests voor de Fibonacci-toewijzing en de cyclische verdeling
