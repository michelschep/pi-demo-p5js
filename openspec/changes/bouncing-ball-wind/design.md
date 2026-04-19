## Context

Een nieuw p5.js project zonder bestaande visuele demo's. De implementatie bestaat uit één HTML/JS bestand dat p5.js via CDN laadt.

## Goals / Non-Goals

**Goals:**
- Een stuiterende bal renderen op een p5.js canvas
- Zwaartekracht en windinvloed simuleren als krachtvectoren
- Botsing met canvas-randen met energieverlies (demping)
- Windkracht visueel aanduiden op het canvas

**Non-Goals:**
- Meerdere ballen of objecten
- Gebruikersinteractie om de wind aan te passen
- Mobiele optimalisatie of responsive layout
- Opslaan van simulatiestatus

## Decisions

**Enkelvoudig HTML-bestand**
Alles in één `index.html` met inline `<script>`. Eenvoudig te openen zonder server.
Alternatief (aparte `sketch.js`) is niet nodig voor een demo van deze omvang.

**p5.js via CDN**
Geen buildtool nodig, direct werkbaar in de browser.

**Krachtvectoren (p5.Vector)**
Gebruik `p5.Vector` voor positie, snelheid en krachten (zwaartekracht, wind).
`vel.add(gravity)`, `vel.add(wind)`, `pos.add(vel)` elke frame.

**Wind als sinusgolf**
De windkracht wisselt over tijd via `sin(frameCount * 0.02)` zodat de bal organisch beweegt zonder dat er invoer nodig is.

**Botsingsdemping**
Bij raakvlak met een rand wordt de snelheidscomponent omgedraaid en vermenigvuldigd met een dempingsfactor (`0.8`).

## Risks / Trade-offs

- Hoge framerate op langzame hardware → Mitigation: geen zware berekeningen, simpele physics
- Wind wordt nooit nul → bal blijft altijd bewegen (gewenst voor demo)
