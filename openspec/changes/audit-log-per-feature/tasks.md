## 1. Per-feature rapport genereren

- [ ] 1.1 Maak de map `wiggum/reports/` aan (als die nog niet bestaat) in het rapportage-script
- [ ] 1.2 Verplaats de HTML-generatie van het `<details>`-blok per feature naar een aparte functie die het resultaat schrijft naar `wiggum/reports/<feature-name>.html`
- [ ] 1.3 Voeg een `<title>` en een terug-link naar `report.html` toe in elk per-feature bestand

## 2. Datum en tijd in Amsterdam-tijdzone

- [x] 2.1 Implementeer een hulpfunctie `formatAmsterdam(isoDate)` die een ISO-datumstring omzet naar `YYYY-MM-DD HH:mm (Amsterdam)` met tijdzone `Europe/Amsterdam` via `Intl.DateTimeFormat`
- [x] 2.2 Pas de header van elk per-feature rapport aan zodat de run-tijd als Amsterdam-tijdstempel getoond wordt
- [x] 2.3 Pas de index-tabel in `report.html` aan zodat de kolom "Run Date" datum én tijd in Amsterdam-tijdzone toont

## 3. report.html omvormen tot index

- [x] 3.1 Verwijder de logica die `<details>`-blokken toevoegt aan `report.html`
- [x] 3.2 Genereer `report.html` opnieuw als een index-pagina: bouw de tabel op door alle bestanden in `wiggum/reports/` in te lezen en er metadata uit te halen (feature-naam, tijdstempel, commit, health)
- [x] 3.3 Zorg dat elke rij in de index-tabel een klikbare link bevat naar het bijbehorende per-feature bestand (`reports/<feature-name>.html`)

## 4. Tests en verificatie

- [x] 4.1 Schrijf Jest-tests in `__tests__/audit-log-per-feature.test.js` die controleren: `formatAmsterdam` geeft een string terug in het formaat `YYYY-MM-DD HH:mm (Amsterdam)`, en de tijdzone is correct (CET = UTC+1, CEST = UTC+2)
