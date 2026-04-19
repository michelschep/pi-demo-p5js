### Requirement: p5.js loaded from CDN
The application SHALL load the p5.js library via a CDN `<script>` tag pointing to `https://cdn.jsdelivr.net/npm/p5@1.11.3/lib/p5.min.js`. The `index.html` file MUST NOT reference any path inside `node_modules/` for loading p5.js at runtime.

#### Scenario: CDN script tag present in index.html
- **WHEN** `index.html` is inspected
- **THEN** it SHALL contain a `<script src="https://cdn.jsdelivr.net/npm/p5@1.11.3/lib/p5.min.js">` tag
- **AND** it SHALL NOT contain a `<script src="node_modules/p5/...">` tag

#### Scenario: Sketch loads in browser after GitHub Pages deployment
- **WHEN** the deployed GitHub Pages site is opened in a browser
- **THEN** p5.js SHALL be fetched from the CDN without a 404 error
- **AND** the p5.js sketch SHALL initialize and run correctly

### Requirement: p5 removed from npm runtime dependencies
The `package.json` file SHALL NOT list `p5` under `dependencies`. The `p5` package is provided by CDN at runtime and MUST NOT be installed as a local npm dependency.

#### Scenario: p5 absent from package.json dependencies
- **WHEN** `package.json` is inspected
- **THEN** the `dependencies` object SHALL NOT contain a `p5` key

#### Scenario: npm install does not install p5
- **WHEN** `npm install` is executed in the project root
- **THEN** `node_modules/p5` SHALL NOT be present after installation
