## MODIFIED Requirements

### Requirement: Bal wordt visueel weergegeven
De bal SHALL als gevulde cirkel worden getekend met de per-instantie `radius` property, de vulkleur bepaald door `colorGroup` (hue = `colorGroup × 60°`), een rand van 3px in de complementaire kleur, en een Fibonacci-label in tekstgrootte 8px. De startstraal is `BALL_RADIUS = 12px`.

#### Scenario: Bal gebruikt eigen radius
- **WHEN** een bal een `radius` van 8px heeft
- **THEN** SHALL de bal worden getekend als cirkel met straal 8px

#### Scenario: Kleur bepaald door colorGroup
- **WHEN** een bal `colorGroup = 2` heeft (hue = 120°, groen)
- **THEN** SHALL de bal groen worden getekend

#### Scenario: Startstraal is BALL_RADIUS
- **WHEN** een nieuwe bal wordt aangemaakt
- **THEN** SHALL `radius` gelijk zijn aan `BALL_RADIUS = 12`

### Requirement: Bal wrapt horizontaal
De bal SHALL bij het verlaten van de linker- of rechterrand aan de tegenovergestelde kant verschijnen, gebruik makend van de per-instantie `radius`.

#### Scenario: Wrap gebruikt eigen radius
- **WHEN** `position.x - this.radius > CANVAS_WIDTH`
- **THEN** SHALL `position.x` worden gezet op `-this.radius + 1`

### Requirement: Bal stuitert tegen boven- en onderrand
De bal SHALL van de boven- en onderrand afketsen gebruik makend van de per-instantie `radius`.

#### Scenario: Stuiteren gebruikt eigen radius
- **WHEN** `position.y + this.radius >= CANVAS_HEIGHT`
- **THEN** wordt `velocity.y` negatief gemaakt en met 0.8 vermenigvuldigd

## Test Todos

- [ ] nieuwe bal heeft `radius === BALL_RADIUS` (12)
- [ ] `colorGroup` is een integer tussen 0 en 5
- [ ] kleur van bal met `colorGroup=0` komt overeen met hue=0° (rood)
- [ ] `checkBounds` gebruikt `this.radius` voor wrap-detectie
- [ ] `checkBounds` gebruikt `this.radius` voor y-bounce-detectie
