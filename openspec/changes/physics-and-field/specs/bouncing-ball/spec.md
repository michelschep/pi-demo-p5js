## MODIFIED Requirements

### Requirement: Bal beweegt over canvas
De bal SHALL een positie en snelheid hebben die elke frame worden bijgewerkt door zwaartekracht toe te passen op de snelheid en de snelheid op de positie. Daarnaast SHALL elke frame een wrijvingsfactor `FRICTION = 0.988` op beide snelheidscomponenten worden toegepast. Wanneer een snelheidscomponent kleiner is dan 0.1 pixels/frame SHALL deze op 0 worden gezet.

#### Scenario: Bal valt door zwaartekracht
- **WHEN** de simulatie start
- **THEN** versnelt de bal naar beneden door een constante zwaartekrachtvector (0, 0.5)

#### Scenario: Bal komt tot rust zonder wind
- **WHEN** de windsterkte 0 is en de bal beweegt
- **THEN** SHALL de bal door wrijving geleidelijk vertragen en uiteindelijk stilkomen

#### Scenario: Wrijving werkt elke frame
- **WHEN** een bal snelheid heeft
- **THEN** SHALL `velocity.x` en `velocity.y` elke frame worden vermenigvuldigd met 0.988

#### Scenario: Micro-beweging stopt
- **WHEN** een snelheidscomponent kleiner dan 0.1 is
- **THEN** SHALL die component op exact 0 worden gezet

### Requirement: Bal wrapt horizontaal
De bal SHALL bij het verlaten van de linker- of rechterrand aan de tegenovergestelde kant verschijnen. Er is geen terugkaatsing aan de x-randen. De bal verdwijnt zodra zijn middelpunt minus straal de rechterkant passeert, en verschijnt met middelpunt plus straal aan de linkerkant (en vice versa).

#### Scenario: Bal verschijnt links na rechts verlaten
- **WHEN** `position.x - BALL_RADIUS > CANVAS_WIDTH`
- **THEN** SHALL `position.x` worden gezet op `-BALL_RADIUS + 1`

#### Scenario: Bal verschijnt rechts na links verlaten
- **WHEN** `position.x + BALL_RADIUS < 0`
- **THEN** SHALL `position.x` worden gezet op `CANVAS_WIDTH + BALL_RADIUS - 1`

#### Scenario: Geen x-kaatsing meer
- **WHEN** een bal de rechterrand raakt
- **THEN** SHALL de x-snelheid NIET worden omgekeerd

### Requirement: Bal stuitert tegen boven- en onderrand
De bal SHALL van de boven- en onderrand afketsen waarbij de y-snelheid wordt omgedraaid en vermenigvuldigd met dempingsfactor 0.8. De positie wordt gecorrigeerd zodat de bal binnen het canvas blijft.

#### Scenario: Stuiteren tegen de onderkant
- **WHEN** `position.y + BALL_RADIUS >= CANVAS_HEIGHT`
- **THEN** wordt `velocity.y` negatief gemaakt en met 0.8 vermenigvuldigd

#### Scenario: Stuiteren tegen de bovenkant
- **WHEN** `position.y - BALL_RADIUS <= 0`
- **THEN** wordt `velocity.y` positief gemaakt en met 0.8 vermenigvuldigd

### Requirement: Bal wordt visueel weergegeven
De bal SHALL als gevulde cirkel worden getekend met straal 12px (was 20px), de eigen unieke vulkleur, een rand van 3px in de complementaire kleur, en een Fibonacci-label in tekstgrootte 8px (was 11px).

#### Scenario: Bal heeft straal 12px
- **WHEN** het canvas wordt getekend
- **THEN** heeft de bal een straal van 12px

#### Scenario: Label is 8px
- **WHEN** het canvas wordt getekend
- **THEN** wordt het Fibonacci-getal weergegeven in tekstgrootte 8px

### Requirement: Canvas is 900×600
Het simulatiecanvas SHALL een breedte van 900px en hoogte van 600px hebben.

#### Scenario: Canvas heeft juiste afmetingen
- **WHEN** de pagina laadt
- **THEN** is het canvas 900px breed en 600px hoog

## Test Todos

- [ ] `BALL_RADIUS` is 12
- [ ] `CANVAS_WIDTH` is 900, `CANVAS_HEIGHT` is 600
- [ ] bal wraps: positie > CANVAS_WIDTH + radius → positie wordt -radius + 1
- [ ] bal wraps: positie < -radius → positie wordt CANVAS_WIDTH + radius - 1
- [ ] geen x-kaatsing: x-snelheid verandert niet bij raken rechterrand
- [ ] wrijving: velocity.x na 1 frame = startwaarde × 0.988
- [ ] wrijving: velocity.y na 1 frame = startwaarde × 0.988
- [ ] micro-stop: velocity.x = 0.05 → wordt 0 na update
- [ ] bal komt tot rust: na 600 frames zonder wind is velocity.x ≈ 0
- [ ] y-kaatsing blijft werken: onderkant kaatst terug
