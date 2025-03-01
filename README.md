# radio-yas
## Using Watchify

Watchify is a tool that automatically rebuilds your code when any monitored files change. To use it with your project, follow these steps:

1. Install Watchify globally with `npm install -g watchify`.
2. In your project directory, create a `watch` script in your `package.json`:

```json
"scripts": {
  "watch": "watchify script.js -o bundle.js"
}
```
3. Run `npm run watch` while you're coding to update bundle.js autmatically.