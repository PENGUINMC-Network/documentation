# Penguin Bot Documentation

Static documentation site for **Penguin Bot**, the all-in-one Discord bot used by Penguin Network.

This documentation covers Penguin Bot and the TPA-Plugin project, including setup, configuration, commands, systems, architecture, deployment, and troubleshooting.

## Related

- **TPA-Plugin (GitHub):** https://github.com/PENGUINMC-Network/TPA-Plugin

## Tech

- **HTML** — `index.html`
- **CSS** — `src/styles.css`
- **TypeScript** — `src/main.ts` compiled to `dist/main.js`

## Development

```bash
npm install
npm run build
```

For live TypeScript compilation:

```bash
npm run dev
```

Open `index.html` in a browser (or serve the folder with any static file server) to view the documentation.

## Project Structure

```text
documentation/
├── index.html
├── package.json
├── tsconfig.json
├── src/
│   ├── main.ts
│   └── styles.css
└── dist/
    └── main.js
```
