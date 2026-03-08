import { useEffect, useMemo, useState } from "react";
import Stepper, {
  defaultStepperTheme,
  type Step,
  type StepperTheme,
} from "animated-stepper";

type NumericThemeKey =
  | "connectorWidthPx"
  | "connectorGapPx"
  | "connectorDurationMs"
  | "dotDurationMs";

type ColorThemeKey =
  | "brand"
  | "track"
  | "dotBg"
  | "inactiveBorder"
  | "inactiveText"
  | "activeText"
  | "completeText"
  | "labelInactive";

type StepPreset = {
  id: string;
  label: string;
  steps: Step[];
};

type ThemePreset = {
  id: string;
  label: string;
  theme: StepperTheme;
};

const stepPresets: StepPreset[] = [
  {
    id: "product",
    label: "Product Setup",
    steps: [
      { key: "welcome", label: "Start", description: "Create workspace" },
      { key: "business", label: "Business", description: "Company details" },
      { key: "branding", label: "Brand", description: "Visual identity" },
      { key: "launch", label: "Launch", description: "Go live" },
    ],
  },
  {
    id: "checkout",
    label: "Checkout Flow",
    steps: [
      { key: "cart", label: "Cart", description: "Review items" },
      { key: "shipping", label: "Shipping", description: "Delivery method" },
      { key: "payment", label: "Payment", description: "Card details" },
      { key: "confirm", label: "Confirm", description: "Place order" },
      { key: "done", label: "Done", description: "Receipt screen" },
    ],
  },
  {
    id: "hiring",
    label: "Hiring Pipeline",
    steps: [
      { key: "screen", label: "Screen", description: "Initial review" },
      { key: "interview", label: "Interview", description: "Meet candidate" },
      { key: "challenge", label: "Challenge", description: "Task review" },
      { key: "offer", label: "Offer", description: "Comp package" },
    ],
  },
];

const themePresets: ThemePreset[] = [
  {
    id: "teal",
    label: "Teal Glass",
    theme: {
      ...defaultStepperTheme,
      brand: "#0f766e",
      track: "#cbd5e1",
      dotBg: "#ffffff",
      inactiveBorder: "#94a3b8",
      inactiveText: "#64748b",
      activeText: "#0f172a",
      completeText: "#ffffff",
      labelInactive: "#64748b",
      connectorWidthPx: 56,
      connectorGapPx: 8,
      connectorDurationMs: 360,
      dotDurationMs: 240,
    },
  },
  {
    id: "sunset",
    label: "Sunset",
    theme: {
      ...defaultStepperTheme,
      brand: "#e85d04",
      track: "#fed7aa",
      dotBg: "#fff7ed",
      inactiveBorder: "#fdba74",
      inactiveText: "#9a3412",
      activeText: "#7c2d12",
      completeText: "#ffffff",
      labelInactive: "#9a3412",
      connectorWidthPx: 62,
      connectorGapPx: 10,
      connectorDurationMs: 420,
      dotDurationMs: 280,
    },
  },
  {
    id: "slate",
    label: "Slate Mono",
    theme: {
      ...defaultStepperTheme,
      brand: "#334155",
      track: "#cbd5e1",
      dotBg: "#f8fafc",
      inactiveBorder: "#94a3b8",
      inactiveText: "#64748b",
      activeText: "#1e293b",
      completeText: "#ffffff",
      labelInactive: "#475569",
      connectorWidthPx: 52,
      connectorGapPx: 6,
      connectorDurationMs: 300,
      dotDurationMs: 210,
    },
  },
  {
    id: "default",
    label: "Package Default",
    theme: { ...defaultStepperTheme },
  },
];

const numericThemeControls: Array<{
  key: NumericThemeKey;
  label: string;
  min: number;
  max: number;
  step: number;
}> = [
  {
    key: "connectorWidthPx",
    label: "Connector width (px)",
    min: 24,
    max: 128,
    step: 1,
  },
  {
    key: "connectorGapPx",
    label: "Connector gap (px)",
    min: 0,
    max: 32,
    step: 1,
  },
  {
    key: "connectorDurationMs",
    label: "Connector duration (ms)",
    min: 80,
    max: 1000,
    step: 10,
  },
  {
    key: "dotDurationMs",
    label: "Dot duration (ms)",
    min: 80,
    max: 1000,
    step: 10,
  },
];

const colorThemeControls: Array<{ key: ColorThemeKey; label: string }> = [
  { key: "brand", label: "Brand color" },
  { key: "track", label: "Track color" },
  { key: "dotBg", label: "Dot background" },
  { key: "inactiveBorder", label: "Inactive border" },
  { key: "inactiveText", label: "Inactive text" },
  { key: "activeText", label: "Active text" },
  { key: "completeText", label: "Complete text" },
  { key: "labelInactive", label: "Inactive label text" },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const cloneSteps = (items: Step[]) => items.map((step) => ({ ...step }));

const withUniqueKeys = (items: Step[]) => {
  const seenKeys = new Map<string, number>();

  return items.map((step, index) => {
    const baseKey = step.key.trim() || `step-${index + 1}`;
    const keyCount = seenKeys.get(baseKey) ?? 0;
    seenKeys.set(baseKey, keyCount + 1);

    const uniqueKey = keyCount === 0 ? baseKey : `${baseKey}-${keyCount + 1}`;
    const label = step.label.trim() || `Step ${index + 1}`;
    const description = step.description?.trim();

    return {
      key: uniqueKey,
      label,
      description,
    };
  });
};

function App() {
  const [steps, setSteps] = useState<Step[]>(() => cloneSteps(stepPresets[0].steps));
  const [activeStep, setActiveStep] = useState(0);
  const [pendingStep, setPendingStep] = useState<number | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const [selectedStepPreset, setSelectedStepPreset] = useState(stepPresets[0].id);

  const [theme, setTheme] = useState<StepperTheme>(() => ({
    ...themePresets[0].theme,
  }));
  const [selectedThemePreset, setSelectedThemePreset] = useState(themePresets[0].id);
  const [useCustomTheme, setUseCustomTheme] = useState(true);

  const stepperSteps = useMemo(() => withUniqueKeys(steps), [steps]);
  const maxStepIndex = stepperSteps.length - 1;
  const canAnimate = pendingStep === null;

  useEffect(() => {
    setActiveStep((prev) => clamp(prev, 0, maxStepIndex));
    setPendingStep((prev) => (prev === null ? null : clamp(prev, 0, maxStepIndex)));
  }, [maxStepIndex]);

  const requestStep = (nextStep: number) => {
    if (!canAnimate) return;
    if (nextStep < 0 || nextStep > maxStepIndex) return;
    if (nextStep === activeStep) return;
    setPendingStep(nextStep);
  };

  const commitStep = (nextStep: number) => {
    setActiveStep(clamp(nextStep, 0, maxStepIndex));
    setPendingStep(null);
  };

  const updateStepField = (
    index: number,
    field: "key" | "label" | "description",
    value: string,
  ) => {
    setSelectedStepPreset("custom");
    setSteps((prev) =>
      prev.map((step, stepIndex) =>
        stepIndex === index ? { ...step, [field]: value } : step,
      ),
    );
  };

  const addStep = () => {
    setSelectedStepPreset("custom");
    setSteps((prev) => [
      ...prev,
      {
        key: `step-${prev.length + 1}`,
        label: `Step ${prev.length + 1}`,
        description: "",
      },
    ]);
  };

  const removeStep = (index: number) => {
    if (steps.length <= 1) return;
    setSelectedStepPreset("custom");
    setSteps((prev) => prev.filter((_, stepIndex) => stepIndex !== index));
  };

  const applyStepPreset = (presetId: string) => {
    const preset = stepPresets.find((item) => item.id === presetId);
    if (!preset) return;
    const nextSteps = cloneSteps(preset.steps);
    setSelectedStepPreset(preset.id);
    setSteps(nextSteps);
    setActiveStep(0);
    setPendingStep(null);
  };

  const applyThemePreset = (presetId: string) => {
    const preset = themePresets.find((item) => item.id === presetId);
    if (!preset) return;
    setSelectedThemePreset(preset.id);
    setTheme({ ...preset.theme });
    setUseCustomTheme(true);
  };

  const updateNumericTheme = (key: NumericThemeKey, value: string) => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) return;
    setSelectedThemePreset("custom");
    setTheme((prev) => ({ ...prev, [key]: parsed }));
  };

  const updateColorTheme = (key: ColorThemeKey, value: string) => {
    setSelectedThemePreset("custom");
    setTheme((prev) => ({ ...prev, [key]: value }));
  };

  const resetAll = () => {
    const defaultSteps = cloneSteps(stepPresets[0].steps);
    setSteps(defaultSteps);
    setSelectedStepPreset(stepPresets[0].id);
    setTheme({ ...defaultStepperTheme });
    setSelectedThemePreset("default");
    setUseCustomTheme(true);
    setActiveStep(0);
    setPendingStep(null);
  };

  const cleanSteps = useMemo(
    () =>
      stepperSteps.map((step) => {
        const description = step.description?.trim();
        return description
          ? step
          : {
              key: step.key,
              label: step.label,
            };
      }),
    [stepperSteps],
  );

  const snippet = useMemo(() => {
    const lines = [
      `const steps = ${JSON.stringify(cleanSteps, null, 2)};`,
      "",
      useCustomTheme
        ? `const customTheme = ${JSON.stringify(theme, null, 2)};`
        : "// using package defaults",
      "",
      "<Stepper",
      "  steps={steps}",
      `  activeStep={${activeStep}}`,
      `  pendingStep={${pendingStep === null ? "null" : pendingStep}}`,
      useCustomTheme ? "  theme={customTheme}" : "",
      "  onCommitStep={(step) => setActiveStep(step)}",
      "/>",
    ].filter((line) => line !== "");

    return lines.join("\n");
  }, [activeStep, cleanSteps, pendingStep, theme, useCustomTheme]);

  const copySnippet = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(snippet);
      } else {
        const input = document.createElement("textarea");
        input.value = snippet;
        input.setAttribute("readonly", "");
        input.style.position = "absolute";
        input.style.left = "-9999px";
        document.body.appendChild(input);
        input.select();
        const copied = document.execCommand("copy");
        document.body.removeChild(input);
        if (!copied) {
          throw new Error("Copy command failed");
        }
      }

      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }

    window.setTimeout(() => {
      setCopyStatus("idle");
    }, 1800);
  };

  return (
    <main className="playground-page">
      <section className="hero">
        <p className="hero-badge">Live package playground</p>
        <h1 className="hero-title">Stepper Props Explorer</h1>
        <p className="hero-subtitle">
          Edit every prop in real time to show motion, step configuration, and full
          theme customization.
        </p>
        <div className="hero-actions">
          <a
            className="btn link-btn"
            href="https://www.npmjs.com/package/animated-stepper"
            target="_blank"
            rel="noreferrer"
          >
            View Package on npm
          </a>
        </div>
      </section>

      <section className="preview-panel">
        <div className="preview-header">
          <h2>Live Preview</h2>
          <button type="button" className="btn btn-ghost" onClick={resetAll}>
            Reset Playground
          </button>
        </div>

        <div className="status-row">
          <p>
            Active step: <strong>{activeStep + 1}</strong>
          </p>
          <p>
            Pending step:{" "}
            <strong>{pendingStep === null ? "None" : pendingStep + 1}</strong>
          </p>
          <p>
            Theme mode: <strong>{useCustomTheme ? "Custom" : "Default"}</strong>
          </p>
        </div>

        <div className="stepper-stage">
          <Stepper
            steps={stepperSteps}
            activeStep={activeStep}
            pendingStep={pendingStep}
            theme={useCustomTheme ? theme : undefined}
            onCommitStep={commitStep}
          />
        </div>

        <div className="button-row preview-nav">
          <button
            type="button"
            className="btn"
            onClick={() => requestStep(activeStep - 1)}
            disabled={!canAnimate || activeStep === 0}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => requestStep(activeStep + 1)}
            disabled={!canAnimate || activeStep === maxStepIndex}
          >
            Next
          </button>
        </div>

      </section>

      <section className="panel-grid">
        <article className="panel panel-theme">
          <div className="theme-head">
            <h2>Theme Props (`theme`)</h2>
            <label className="toggle">
              <input
                type="checkbox"
                checked={useCustomTheme}
                onChange={(event) => setUseCustomTheme(event.target.checked)}
              />
              <span>Use custom theme override</span>
            </label>
          </div>

          <label className="field">
            <span>Preset</span>
            <select
              className="control"
              value={selectedThemePreset}
              onChange={(event) => {
                const nextPreset = event.target.value;
                if (nextPreset === "custom") {
                  setSelectedThemePreset("custom");
                  return;
                }
                applyThemePreset(nextPreset);
              }}
            >
              {themePresets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.label}
                </option>
              ))}
              <option value="custom">Custom</option>
            </select>
          </label>

          <fieldset className="theme-grid" disabled={!useCustomTheme}>
            {numericThemeControls.map((control) => (
              <label className="field" key={control.key}>
                <span>{control.label}</span>
                <div className="field-row">
                  <input
                    className="control"
                    type="range"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={theme[control.key]}
                    onChange={(event) =>
                      updateNumericTheme(control.key, event.target.value)
                    }
                  />
                  <input
                    className="control control-small"
                    type="number"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={theme[control.key]}
                    onChange={(event) =>
                      updateNumericTheme(control.key, event.target.value)
                    }
                  />
                </div>
              </label>
            ))}

            {colorThemeControls.map((control) => (
              <label className="field" key={control.key}>
                <span>{control.label}</span>
                <div className="field-row">
                  <input
                    className="control color-control"
                    type="color"
                    value={theme[control.key]}
                    onChange={(event) =>
                      updateColorTheme(control.key, event.target.value)
                    }
                  />
                  <input
                    className="control"
                    type="text"
                    value={theme[control.key]}
                    onChange={(event) =>
                      updateColorTheme(control.key, event.target.value)
                    }
                  />
                </div>
              </label>
            ))}
          </fieldset>
        </article>

        <article className="panel panel-steps">
          <h2>Step Props (`steps`)</h2>

          <label className="field">
            <span>Preset</span>
            <select
              className="control"
              value={selectedStepPreset}
              onChange={(event) => {
                const nextPreset = event.target.value;
                if (nextPreset === "custom") {
                  setSelectedStepPreset("custom");
                  return;
                }
                applyStepPreset(nextPreset);
              }}
            >
              {stepPresets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.label}
                </option>
              ))}
              <option value="custom">Custom</option>
            </select>
          </label>

          <div className="step-list">
            {steps.map((step, index) => (
              <div className="step-editor" key={`step-editor-${index}`}>
                <div className="step-editor-head">
                  <strong>Step {index + 1}</strong>
                  <button
                    type="button"
                    className="btn btn-danger btn-small"
                    onClick={() => removeStep(index)}
                    disabled={steps.length <= 1}
                  >
                    Remove
                  </button>
                </div>

                <div className="field-grid">
                  <label className="field">
                    <span>Key</span>
                    <input
                      className="control"
                      type="text"
                      value={step.key}
                      onChange={(event) =>
                        updateStepField(index, "key", event.target.value)
                      }
                      placeholder={`step-${index + 1}`}
                    />
                  </label>
                  <label className="field">
                    <span>Label</span>
                    <input
                      className="control"
                      type="text"
                      value={step.label}
                      onChange={(event) =>
                        updateStepField(index, "label", event.target.value)
                      }
                      placeholder={`Step ${index + 1}`}
                    />
                  </label>
                </div>

                <label className="field">
                  <span>Description (optional)</span>
                  <input
                    className="control"
                    type="text"
                    value={step.description ?? ""}
                    onChange={(event) =>
                      updateStepField(index, "description", event.target.value)
                    }
                    placeholder="Visible in your own app logic"
                  />
                </label>
              </div>
            ))}
          </div>

          <button type="button" className="btn btn-accent" onClick={addStep}>
            Add Step
          </button>
        </article>

        <article className="panel panel-code">
          <h2>Live Props Snapshot</h2>
          <p className="panel-note">
            Keys are normalized so blank or duplicate values still render safely.
          </p>
          <div className="snippet-wrap">
            <button
              type="button"
              className={`btn btn-small snippet-copy-btn ${copyStatus === "copied" ? "is-copied" : ""}`}
              onClick={copySnippet}
              aria-label={copyStatus === "copied" ? "Copied" : "Copy snippet"}
              title={copyStatus === "copied" ? "Copied" : "Copy snippet"}
            >
              <span className="copy-icon" aria-hidden="true" />
            </button>
            <pre>
              <code>{snippet}</code>
            </pre>
          </div>
        </article>
      </section>
    </main>
  );
}

export default App;
