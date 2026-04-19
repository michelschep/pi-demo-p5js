## Why

Ballen negeren elkaar nu volledig en overlappen. Wanneer meerdere ballen spawnen moet de simulatie fysiek correct aanvoelen: ballen die elkaar raken moeten van elkaar afketsen.

## What Changes

- Ballen detecteren botsingen met andere ballen
- Bij een botsing worden de snelheden herschikt zodat ballen de juiste kant op ketsen (elastische botsing, gelijke massa)
- De simulatie werkt voor 1 bal precies zoals voorheen

## Capabilities

### New Capabilities
- `ball-collision`: Detectie en respons van bal-bal botsingen met correcte snelheidswisseling

### Modified Capabilities

## Impact

- `src/ball.js`: nieuwe methode voor botsingsrespons
- `src/sketch.js`: botsingen checken per frame voor alle paren
- Geen nieuwe dependencies
