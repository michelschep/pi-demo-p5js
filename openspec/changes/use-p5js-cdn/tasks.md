## 1. Update HTML

- [ ] 1.1 Replace `<script src="node_modules/p5/lib/p5.min.js">` in `index.html` with `<script src="https://cdn.jsdelivr.net/npm/p5@1.11.3/lib/p5.min.js">`

## 2. Update Package Dependencies

- [ ] 2.1 Remove `"p5": "^1.11.3"` from `dependencies` in `package.json`
- [ ] 2.2 Run `npm install` to update `package-lock.json` and remove `node_modules/p5`

## 3. Verify

- [ ] 3.1 Open the project locally in a browser and confirm the sketch runs correctly with the CDN script
- [ ] 3.2 Confirm `node_modules/p5` is no longer present after `npm install`
