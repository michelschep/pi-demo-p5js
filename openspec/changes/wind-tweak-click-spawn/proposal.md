## Why

De windkracht is momenteel te sterk en overheerst de simulatie, waardoor de bal zich onnatuurlijk gedraagt. Daarnaast ontbreekt interactiviteit: gebruikers kunnen nu niet ingrijpen in de simulatie. Door wind te verzwakken en klik-om-bal-te-spawnen toe te voegen wordt de simulatie realistischer én leuker.

## What Changes

- **Wind zwakker**: De windkrachtmagnitude wordt verminderd zodat wind zichtbaar blijft maar niet dominant is over zwaartekracht en stuiteren.
- **Klik spawnt nieuwe bal**: Wanneer de gebruiker op het canvas klikt, verschijnt er een nieuwe bal op de klikpositie die vervolgens omlaag valt met dezelfde physics (zwaartekracht, stuiteren, windeffect).

## Capabilities

### New Capabilities
- `click-to-spawn`: Klik-interactie op het canvas waarmee een nieuwe bal wordt toegevoegd op de klikpositie.

### Modified Capabilities
- `wind-force`: De windsterkte (amplitude van de sinusgolf) wordt verminderd zodat het effect subtieler is.

## Impact

- `sketch.js` (of equivalent): aanpassen van de windkracht-amplitude en toevoegen van `mousePressed`-logica voor het spawnen van ballen.
- De bal-logica moet meerdere ballen ondersteunen (array in plaats van één object).
