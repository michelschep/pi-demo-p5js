## Context

De `Ball`-klasse in `src/ball.js` kent al een willekeurige vulkleur en complementaire randkleur, toegewezen bij constructie. De draw-loop in `src/sketch.js` tekent ballen met `ellipse()` en past daarna `stroke/fill` toe. De bal heeft een vaste straal van 20px.

De Fibonacci-reeks (1, 1, 2, 3, 5, 8, 13, 21, 34, 55, …) wordt cyclisch verdeeld over ballen in de volgorde van aanmaak. Een globale teller in `ball.js` houdt bij welk volgend Fibonacci-getal uitgedeeld wordt.

## Goals / Non-Goals

**Goals:**
- Elke bal krijgt bij constructie een Fibonacci-getal toegewezen via een modulaire index in een vaste reeks
- Het getal wordt gecentreerd gerenderd in de bal, met een lettergrootte die altijd binnen de cirkel past
- Tekstkleur contrasteert met de vulkleur (wit op donkere ballen, zwart op lichte)

**Non-Goals:**
- Dynamische herberekening van nummers na verwijdering van ballen
- Aanpasbare reeksen of custom nummers per bal
- Animatie of pulsatie van het label

## Decisions

### Fibonacci-toewijzing: cyclische index via module teller

Een module-level teller `_fibIndex` in `ball.js` wordt bij elke `Ball`-constructie verhoogd. Het Fibonacci-getal is `FIBONACCI[_fibIndex % FIBONACCI.length]`. De reeks bevat de eerste 10 unieke Fibonacci-getallen: `[1, 2, 3, 5, 8, 13, 21, 34, 55, 89]` (de dubbele `1` weggelaten voor diversiteit).

**Alternatief overwogen:** random pick uit de reeks — afgewezen omdat herhaling dan direct optreed bij weinig ballen, en volgorde informatiever is.

### Lettergrootte: vaste 11px

`BALL_RADIUS = 20px`. De inscribed square van een cirkel met r=20 heeft zijde `20√2 ≈ 28px`. Tweedelig getal "89" in een standaard font heeft bij 11px een breedte van ~14px en hoogte ~11px — past ruimschoots. Grotere waarde (13px) is te krap voor tweecijferige getallen.

**Alternatief overwogen:** dynamische schaalbaarheid op tekstbreedte — onnodige complexiteit voor een vaste reeks van max. "89".

### Tekstkleur: luma-drempel op vulkleur

`luma = 0.299·R + 0.587·G + 0.114·B`. Bij luma ≥ 128 → zwarte tekst (`0,0,0`), anders witte tekst (`255,255,255`). Dit is de standaard WCAG-benadering voor leesbaar contrast.

### Rendering: na `ellipse()`, aparte `fill/textAlign/textSize`

De tekst wordt direct na de `ellipse()`-aanroep per bal getekend, binnen de bestaande draw-loop. Geen aparte renderpass nodig.

## Risks / Trade-offs

- **Twee-pass render volgorde** — tekst van bal A kan in theorie onder bal B liggen bij overlap. Risico is laag: ballen botsen af, echte overlap is vluchtig. Mitigation: geen, acceptabel.
- **Module-level state `_fibIndex`** — maakt de constructor niet puur. In Jest-tests moet de teller gereset worden tussen test-runs. Mitigation: exporteer een `resetFibIndex()` testhelper die alleen in testomgeving wordt gebruikt.
