## Context

Het project is een p5.js demo-app die een stuiterende bal simuleert. De `index.html` bevat momenteel alleen het canvas. Er is geen paginatitel aanwezig.

## Goals / Non-Goals

**Goals:**
- Voeg een rode `<h1>` titel "Stuiteren!" toe bovenaan de pagina
- Minimale HTML/CSS wijziging, geen invloed op het canvas of de p5.js logica

**Non-Goals:**
- Geen wijzigingen aan de p5.js sketch
- Geen responsive of animerende titel
- Geen dark/light mode theming

## Decisions

**HTML `<h1>` met inline CSS of stijlblok**
Gebruik een `<style>` blok in de `<head>` met een klasse of direct op `h1`. Dit houdt alles netjes in één bestand zonder externe stijlbestanden toe te voegen.

## Risks / Trade-offs

- [Minimale impact] → De titel neemt verticale ruimte in; het canvas staat iets lager. Geen functioneel risico.
