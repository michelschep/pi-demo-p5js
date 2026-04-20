## MODIFIED Requirements

### Requirement: Bal wordt visueel weergegeven
De bal SHALL als gevulde cirkel worden getekend met een vaste straal van 20px, de eigen unieke vulkleur van die bal, én een zichtbare rand van 3px in de complementaire kleur van de vulkleur, én een gecentreerd Fibonacci-getal label in contrasterende tekstkleur.

#### Scenario: Bal zichtbaar op canvas
- **WHEN** het canvas wordt getekend
- **THEN** is de bal zichtbaar als cirkel op de huidige positie, getekend in de eigen vulkleur van die bal

#### Scenario: Elke bal heeft een unieke vulkleur
- **WHEN** een nieuwe bal aangemaakt wordt
- **THEN** krijgt die bal automatisch een willekeurige unieke vulkleur (hue-gebaseerd, hoge saturatie en brightness) die verschilt van de vaste standaardkleur

#### Scenario: Kleur blijft consistent
- **WHEN** een bal over het canvas beweegt, stuitert of botst
- **THEN** blijft de vulkleur van die bal onveranderd gedurende de hele levensduur

#### Scenario: Bal heeft zichtbare rand
- **WHEN** het canvas wordt getekend
- **THEN** heeft de bal een rand van 3px in de complementaire kleur van de vulkleur (hue verschoven met 180°)

#### Scenario: Randkleur blijft consistent
- **WHEN** een bal over het canvas beweegt, stuitert of botst
- **THEN** blijft de randkleur van die bal onveranderd gedurende de hele levensduur

#### Scenario: Bal toont Fibonacci-getal label
- **WHEN** het canvas wordt getekend
- **THEN** SHALL het toegewezen Fibonacci-getal gecentreerd in de bal worden weergegeven in lettergrootte 11px

#### Scenario: Tekstkleur contrasteert met vulkleur
- **WHEN** het canvas wordt getekend
- **THEN** SHALL de tekstkleur wit zijn als de luma van de vulkleur < 128, en zwart als luma ≥ 128

## ADDED Requirements

### Requirement: Elke bal krijgt een Fibonacci-getal toegewezen
Elke nieuwe bal SHALL bij aanmaak een Fibonacci-getal toegewezen krijgen, cyclisch gekozen uit de reeks [1, 2, 3, 5, 8, 13, 21, 34, 55, 89], zodat opeenvolgende ballen steeds het volgende getal uit de reeks krijgen.

#### Scenario: Eerste bal krijgt 1
- **WHEN** de eerste bal wordt aangemaakt (na reset)
- **THEN** heeft die bal `fibonacciNumber === 1`

#### Scenario: Cyclische verdeling
- **WHEN** meer ballen worden aangemaakt dan de reeks lang is (10 getallen)
- **THEN** begint de toewijzing opnieuw bij het eerste element van de reeks

#### Scenario: Getal is onveranderlijk
- **WHEN** een bal over het canvas beweegt, stuitert of botst
- **THEN** blijft `fibonacciNumber` onveranderd gedurende de hele levensduur van de bal
