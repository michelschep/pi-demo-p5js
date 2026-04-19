## Why

Momenteel worden alle ballen met dezelfde vaste kleur getekend, wat het bij meerdere ballen op het canvas lastig maakt om ze visueel van elkaar te onderscheiden. Door elke bal een eigen unieke kleur te geven wordt de simulatie overzichtelijker en aantrekkelijker.

## What Changes

- Elke `Ball`-instantie krijgt een eigen kleur, toegewezen bij aanmaken
- Kleuren worden willekeurig gegenereerd (hue-based) zodat ballen goed van elkaar te onderscheiden zijn
- De tekenlogica in de sketch gebruikt de kleur van de individuele bal in plaats van een vaste kleur

## Capabilities

### New Capabilities

*(geen)*

### Modified Capabilities

- `bouncing-ball`: De requirement "Bal wordt visueel weergegeven" verandert — ballen hebben niet langer een vaste gedeelde kleur, maar elk een eigen unieke kleur die bij aanmaken wordt toegewezen.

## Impact

- `src/ball.js`: `Ball`-constructor krijgt een `color`-property
- `src/sketch.js`: tekencode leest `ball.color` in plaats van een hardgecodeerde kleur
- Bestaande tests hoeven niet te veranderen (kleur is visueel, geen fysica)
