# animated-stepper

React stepper component workspace.

- Live demo: https://stepper.mayerattila.site/
- npm package: https://www.npmjs.com/package/animated-stepper
- Package source: `packages/stepper`
- Demo app: `apps/demo`

The hosted site is a small playground/demo page. It lets you preview step motion, edit step labels, tune theme tokens, and copy a matching props snippet.

## Package

Install from npm:

```bash
npm install animated-stepper
```

Use in React:

```tsx
import Stepper from "animated-stepper";
import "animated-stepper/style.css";
```

Full package docs live in [`packages/stepper/README.md`](packages/stepper/README.md).

## Local Development

Install dependencies:

```bash
npm install
```

Run the demo:

```bash
npm run dev
```

Build package and demo:

```bash
npm run build
```

Build package only:

```bash
npm run build:package
```

## Publish

```bash
cd packages/stepper
npm login
npm publish --access public
```

`prepublishOnly` runs the package build before publish.
