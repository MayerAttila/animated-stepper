# animated-stepper

Reusable animated stepper for React.

## Install

```bash
npm install animated-stepper
```

## Usage

```tsx
import Stepper, { defaultStepperTheme, type Step } from "animated-stepper";
import "animated-stepper/style.css";

const steps: Step[] = [
  { key: "one", label: "One" },
  { key: "two", label: "Two" },
  { key: "three", label: "Three" }
];
```
