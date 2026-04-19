## ADDED Requirements

### Requirement: Klik op canvas spawnt een nieuwe bal
Het systeem SHALL bij elke muisklik binnen het canvas een nieuwe bal aanmaken op de klikpositie. De nieuwe bal SHALL starten met een beginsnelheid van (0, 0) zodat hij direct omlaag valt onder zwaartekracht.

#### Scenario: Bal spawnt op klikpositie
- **WHEN** de gebruiker binnen het canvas klikt
- **THEN** verschijnt er een nieuwe bal op de exacte klikcoördinaten (mouseX, mouseY)

#### Scenario: Nieuwe bal gedraagt zich als andere ballen
- **WHEN** een nieuwe bal gespawnd is
- **THEN** valt hij omlaag door zwaartekracht, stuitert hij tegen canvas-randen en wordt hij beïnvloed door wind

#### Scenario: Klik buiten canvas spawnt geen bal
- **WHEN** de gebruiker buiten het canvas klikt
- **THEN** wordt er geen nieuwe bal aangemaakt
