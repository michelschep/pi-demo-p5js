## ADDED Requirements

### Requirement: Windsterkte instelbaar via slider
De pagina SHALL een `<input type="range">` element bevatten met id `wind-strength` waarmee de gebruiker de windsterkte instelt. De minimumwaarde SHALL 0 zijn, de maximumwaarde 0.3, de stapgrootte 0.01 en de standaardwaarde 0.1.

#### Scenario: Slider aanwezig met juiste grenzen
- **WHEN** de pagina geladen is
- **THEN** SHALL een slider zichtbaar zijn met min=0, max=0.3 en standaardwaarde 0.1

#### Scenario: Slider wijzigt windsterkte
- **WHEN** de gebruiker de slider naar de maximale positie beweegt
- **THEN** SHALL de windsterkte 0.3 zijn en de ballen merkbaar harder worden beïnvloed

#### Scenario: Slider op nul geeft windstilte
- **WHEN** de slider op 0 staat
- **THEN** SHALL de windkrachtvector `{x: 0, y: 0}` zijn en de windpijl niet zichtbaar zijn

### Requirement: Windrichting instelbaar via richtingswidget
De pagina SHALL een cirkelvormig richtingswidget bevatten met id `wind-direction` (een `<canvas>` element van 120 × 120 px). Het widget SHALL de kompasrichtingen N, Z, W en O als label tonen. De gebruiker SHALL door te klikken of te slepen op de cirkel de windrichting instellen. Het actieve richtingspunt SHALL op de cirkelrand verschijnen op de gekozen hoek.

#### Scenario: Widget toont kompasrichtingen
- **WHEN** de pagina geladen is
- **THEN** SHALL de labels N (boven), Z (onder), W (links) en O (rechts) zichtbaar zijn in het widget

#### Scenario: Klik stelt richting in
- **WHEN** de gebruiker klikt op de bovenkant van het widget (richting N)
- **THEN** SHALL de windrichting naar boven (Noord) worden ingesteld, resulterend in een negatieve y-component van de windvector

#### Scenario: Richtingspunt volgt klik/sleep
- **WHEN** de gebruiker klikt of sleept op een positie op de cirkel
- **THEN** SHALL het richtingspunt zich naar de dichtstbijzijnde positie op de cirkelrand bewegen

### Requirement: Huidige windinstelling zichtbaar
De pagina SHALL onder de controls de huidige windrichting (in graden) en windsterkte numeriek tonen.

#### Scenario: Waarden bijgewerkt na interactie
- **WHEN** de gebruiker de slider of widget aanpast
- **THEN** SHALL de weergegeven gradenwaarde en sterkte direct worden bijgewerkt
