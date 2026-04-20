## Why

De simulatie heeft meerdere problemen: wind van het zuiden duwt ballen omlaag in plaats van omhoog, ballen komen nooit tot rust zonder wind, het veld is te klein en de ballen te groot. Daarnaast worden ballen aan de rand gestopt in plaats van aan de overkant te verschijnen, en er ontbreekt een zichtbare rand om het speelveld.

## What Changes

- **Windbug fix**: de kompaswidget toont voortaan de herkomst van de wind (meteorologische conventie). Wind uit het zuiden (Z) blaast de ballen omhoog.
- **Ballen kleiner**: straal van 20px → 12px; Fibonacci-label tekstgrootte van 11px → 8px.
- **Canvas groter**: 600×400 → 900×600.
- **Rand om het veld**: zichtbare border langs de canvasrand.
- **Horizontaal wrappen**: ballen die rechts uit beeld gaan verschijnen links, en andersom.
- **Ballen komen tot rust**: wrijving per frame zorgt dat ballen zonder wind geleidelijk stilkomen.

## Capabilities

### New Capabilities

- `field-border`: zichtbare rand om het simulatieveld.

### Modified Capabilities

- `bouncing-ball`: kleinere straal, groter canvas, horizontaal wrappen i.p.v. terugkaatsen, wrijving zodat ballen tot rust komen.
- `wind-force`: windvector semantiek omgedraaid — kompashoek geeft herkomst aan (FROM), niet bestemming. Z (180°) geeft `{x:0, y:-strength}` (omhoog).

## Impact

- `src/ball.js` — `BALL_RADIUS` (20→12), `CANVAS_WIDTH`/`HEIGHT`, `checkBounds` voor wrap + wrijving.
- `src/sketch.js` — tekstgrootte label (11→8), border tekenen, `drawWindArrow` past mee.
- `src/wind.js` — `getWindVector` formule omdraaien.
- `src/wind-controls.js` — widget-labels semantiek (Z = wind van onder = blaast omhoog).
- `__tests__/` — bestaande tests voor bounds en wind bijwerken.
