# animated-stepper

Animated stepper component for React with smooth forward/backward transitions and full theme overrides.

Live demo: https://stepper.mayerattila.site

## Features

- Smooth animated connectors and dot transitions
- Controlled state API (`activeStep` + `pendingStep`)
- Jump-to-step support
- Theme tokens for colors, spacing, and animation timings
- TypeScript types included

## Installation

```bash
npm install animated-stepper
```

## Quick Start

```tsx
import { useState } from "react";
import Stepper, { type Step } from "animated-stepper";
import "animated-stepper/style.css";

const steps: Step[] = [
  { key: "account", label: "Account" },
  { key: "details", label: "Details" },
  { key: "confirm", label: "Confirm" },
];

export default function Example() {
  const [activeStep, setActiveStep] = useState(0);
  const [pendingStep, setPendingStep] = useState<number | null>(null);

  const requestStep = (nextStep: number) => {
    if (pendingStep !== null) return;
    if (nextStep < 0 || nextStep >= steps.length) return;
    if (nextStep === activeStep) return;
    setPendingStep(nextStep);
  };

  return (
    <>
      <Stepper
        steps={steps}
        activeStep={activeStep}
        pendingStep={pendingStep}
        onCommitStep={(step) => {
          setActiveStep(step);
          setPendingStep(null);
        }}
      />

      <button onClick={() => requestStep(activeStep - 1)}>Previous</button>
      <button onClick={() => requestStep(activeStep + 1)}>Next</button>
    </>
  );
}
```

## API

### `Step`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | `string` | Yes | Unique step identifier |
| `label` | `string` | Yes | Text shown under the step dot |
| `description` | `string` | No | Optional metadata for your app logic |

### `Stepper` props

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `steps` | `Step[]` | Yes | Step definitions in display order |
| `activeStep` | `number` | Yes | Current committed step index |
| `pendingStep` | `number \| null` | Yes | Next step index while animation is running |
| `theme` | `Partial<StepperTheme>` | No | Theme token overrides |
| `onCommitStep` | `(step: number) => void` | Yes | Called when connector animation finishes |

## Theme Tokens (`StepperTheme`)

Default values:

| Token | Default |
| --- | --- |
| `connectorWidthPx` | `48` |
| `connectorGapPx` | `8` |
| `connectorDurationMs` | `320` |
| `dotDurationMs` | `220` |
| `brand` | `#2563eb` |
| `track` | `#d1d5db` |
| `dotBg` | `#ffffff` |
| `inactiveBorder` | `#9ca3af` |
| `inactiveText` | `#6b7280` |
| `activeText` | `#1f2937` |
| `completeText` | `#ffffff` |
| `labelInactive` | `#6b7280` |

Example override:

```tsx
<Stepper
  steps={steps}
  activeStep={activeStep}
  pendingStep={pendingStep}
  theme={{
    brand: "#0f766e",
    connectorWidthPx: 56,
    connectorDurationMs: 360,
  }}
  onCommitStep={onCommitStep}
/>
```

## Notes

- This is a controlled component. Manage step state in your app.
- Keep `pendingStep` as `null` when no transition is active.
- Include `animated-stepper/style.css` once in your app entry.
