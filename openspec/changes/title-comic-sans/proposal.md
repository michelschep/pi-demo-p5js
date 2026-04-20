## Why

De titel "Stuiteren!" heeft momenteel geen lettertype-stijl. Comic Sans toevoegen geeft de pagina een speels, vrolijk karakter dat past bij de bouncende ballen animatie.

## What Changes

- De `<h1>` titel "Stuiteren!" krijgt het lettertype Comic Sans MS (met passende fallbacks).

## Capabilities

### New Capabilities

*(geen nieuwe capabilities — bestaande `page-title` capability wordt uitgebreid)*

### Modified Capabilities

- `page-title`: De titelweergave vereist nu Comic Sans MS als lettertype naast de bestaande rode kleur.

## Impact

- `index.html`: CSS voor `h1` uitbreiden met `font-family: "Comic Sans MS", "Comic Sans", cursive`
- Geen JavaScript-wijzigingen
- Geen nieuwe dependencies
