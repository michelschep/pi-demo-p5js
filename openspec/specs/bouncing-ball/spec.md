### Requirement: Bal beweegt over canvas
De bal SHALL een positie en snelheid hebben die elke frame worden bijgewerkt door zwaartekracht toe te passen op de snelheid en de snelheid op de positie.

#### Scenario: Bal valt door zwaartekracht
- **WHEN** de simulatie start
- **THEN** versnelt de bal naar beneden door een constante zwaartekrachtvector (0, 0.5)

### Requirement: Bal stuitert tegen randen
De bal SHALL van een canvas-rand afketsen wanneer de rand wordt geraakt, waarbij de snelheidscomponent loodrecht op de rand wordt omgedraaid en vermenigvuldigd met een dempingsfactor van 0.8.

#### Scenario: Stuiteren tegen de onderkant
- **WHEN** de y-positie van de bal plus de straal gelijk is aan of groter dan de canvas-hoogte
- **THEN** wordt de y-snelheid negatief gemaakt en met 0.8 vermenigvuldigd, en de positie gecorrigeerd zodat de bal binnen het canvas blijft

#### Scenario: Stuiteren tegen zijkanten
- **WHEN** de x-positie van de bal de linker- of rechterrand raakt
- **THEN** wordt de x-snelheid omgekeerd en met 0.8 vermenigvuldigd

### Requirement: Bal wordt visueel weergegeven
De bal SHALL als gevulde cirkel worden getekend met een vaste straal van 20px en een herkenbare kleur.

#### Scenario: Bal zichtbaar op canvas
- **WHEN** het canvas wordt getekend
- **THEN** is de bal zichtbaar als cirkel op de huidige positie
