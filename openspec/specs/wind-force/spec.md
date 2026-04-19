### Requirement: Windkracht beïnvloedt de bal
Het systeem SHALL een windkrachtvector toepassen op de snelheid van elke bal elke frame. De windkracht SHALL variëren over tijd via een sinusgolf zodat de richting periodiek wisselt. De amplitude van de windkracht SHALL 0.08 zijn zodat wind subtiel en niet dominant is ten opzichte van zwaartekracht.

#### Scenario: Wind duwt de bal horizontaal
- **WHEN** de windkracht positief is (rechtse wind)
- **THEN** neemt de horizontale snelheid van de bal toe in de richting van de wind

#### Scenario: Wind wisselt van richting
- **WHEN** de sinusgolf van `frameCount` een negatieve waarde oplevert
- **THEN** werkt de wind in de tegenovergestelde richting

#### Scenario: Wind is subtiel ten opzichte van zwaartekracht
- **WHEN** de simulatie draait
- **THEN** is de maximale windkracht (0.08) significant kleiner dan de zwaartekrachtversnelling (0.5) zodat de bal niet horizontaal wegschiet

### Requirement: Windrichting wordt visueel weergegeven
Het systeem SHALL een pijl of indicator op het canvas tonen die de huidige windrichting en -sterkte aangeeft.

#### Scenario: Pijl wijst in windrichting
- **WHEN** de wind naar rechts waait
- **THEN** wijst de windpijl naar rechts

#### Scenario: Pijl wijst bij windstilte naar het midden
- **WHEN** de windkracht nul is
- **THEN** heeft de pijl een lengte van nul of is niet zichtbaar
