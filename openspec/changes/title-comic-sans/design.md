## Context

De `<h1>` titel in `index.html` heeft momenteel alleen een rode kleur via `h1 { color: red; }`. De wijziging is een eenvoudige CSS-aanpassing zonder architecturale implicaties.

## Goals / Non-Goals

**Goals:**
- Comic Sans MS toevoegen als `font-family` op de `h1` in `index.html`

**Non-Goals:**
- Geen aanpassingen aan andere tekstelementen of lettertypes
- Geen webfont-imports (Comic Sans is een systeemfont)
- Geen JavaScript-wijzigingen

## Decisions

**Systeemfont, geen import**: Comic Sans MS is op alle gangbare platformen aanwezig als systeemfont. Fallback-keten: `"Comic Sans MS", "Comic Sans", cursive`.

## Risks / Trade-offs

- [Beschikbaarheid] Comic Sans is niet op alle systemen aanwezig → Mitigation: `cursive` als generieke fallback
