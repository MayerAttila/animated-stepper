# Stepper Package Workspace

This folder contains:

- `packages/stepper`: publishable React stepper component (`animated-stepper`)
- `apps/demo`: demo website that uses the package

## Setup

```bash
npm install
```

## Run demo

```bash
npm run dev
```

## Build everything

```bash
npm run build
```

## Publish the package

```bash
cd packages/stepper
npm login
npm publish --access public
```

Package name is currently set to `animated-stepper` in `packages/stepper/package.json`.
