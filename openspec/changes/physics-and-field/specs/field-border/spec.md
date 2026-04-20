## ADDED Requirements

### Requirement: Zichtbare rand om het simulatieveld
Het canvas SHALL een zichtbare rand hebben die de grenzen van het speelveld aangeeft. De rand SHALL worden getekend als een rechthoek langs de binnenkant van de canvasrand in kleur `#58a6ff` met een lijndikte van 2px.

#### Scenario: Rand zichtbaar bij laden
- **WHEN** de pagina geladen is
- **THEN** SHALL een blauwe rand zichtbaar zijn langs de randen van het canvas

#### Scenario: Rand verdwijnt niet tijdens animatie
- **WHEN** ballen over het canvas bewegen
- **THEN** SHALL de rand elke frame opnieuw worden getekend en altijd zichtbaar blijven

## Test Todos

- [ ] `index.html` bevat canvas element met id waarop rand wordt getekend
- [ ] `drawFieldBorder()` functie bestaat in sketch.js
- [ ] rand wordt elke frame aangeroepen in `draw()`
