"use client";

import {
  useMemo,
  useRef,
  type CSSProperties,
  type TransitionEvent,
} from "react";

export type Step = {
  key: string;
  label: string;
  description?: string;
};

export type StepperTheme = {
  connectorWidthPx: number;
  connectorGapPx: number;

  connectorDurationMs: number;
  dotDurationMs: number;

  brand: string;
  track: string;

  dotBg: string;
  inactiveBorder: string;
  inactiveText: string;

  activeText: string;
  completeText: string;

  labelInactive: string;
};

export type StepperProps = {
  steps: Step[];
  activeStep: number;
  pendingStep: number | null;
  theme?: Partial<StepperTheme>;
  onCommitStep: (step: number) => void;
};

export const defaultStepperTheme: StepperTheme = {
  connectorWidthPx: 48,
  connectorGapPx: 8,
  connectorDurationMs: 320,
  dotDurationMs: 220,
  brand: "#2563eb",
  track: "#d1d5db",
  dotBg: "#ffffff",
  inactiveBorder: "#9ca3af",
  inactiveText: "#6b7280",
  activeText: "#1f2937",
  completeText: "#ffffff",
  labelInactive: "#6b7280",
};

export const Stepper = ({
  steps,
  activeStep,
  pendingStep,
  theme,
  onCommitStep,
}: StepperProps) => {
  const mergedTheme: StepperTheme = { ...defaultStepperTheme, ...theme };
  const isAnimating = pendingStep !== null;

  const from = activeStep;
  const to = pendingStep ?? activeStep;
  const direction: "forward" | "backward" = to > from ? "forward" : "backward";

  const visualCompleteUpto =
    isAnimating && direction === "forward" ? from + 1 : from;

  const vars = useMemo(
    () =>
      ({
        ["--st-brand" as string]: mergedTheme.brand,
        ["--st-dotBg" as string]: mergedTheme.dotBg,
        ["--st-completeText" as string]: mergedTheme.completeText,
        ["--st-activeText" as string]: mergedTheme.activeText,
        ["--st-track" as string]: mergedTheme.track,
        ["--st-inactiveBorder" as string]: mergedTheme.inactiveBorder,
        ["--st-inactiveText" as string]: mergedTheme.inactiveText,
        ["--st-labelInactive" as string]: mergedTheme.labelInactive,
        ["--st-connW" as string]: `${mergedTheme.connectorWidthPx}px`,
        ["--st-gap" as string]: `${mergedTheme.connectorGapPx}px`,
        ["--st-connDur" as string]: `${mergedTheme.connectorDurationMs}ms`,
        ["--st-dotDur" as string]: `${mergedTheme.dotDurationMs}ms`,
      }) as CSSProperties,
    [mergedTheme],
  );

  const committedRef = useRef(false);
  if (!isAnimating) {
    committedRef.current = false;
  }

  const shouldCommitOnEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (!isAnimating) {
      return;
    }
    if (e.propertyName !== "transform") {
      return;
    }
    if (committedRef.current) {
      return;
    }
    committedRef.current = true;
    onCommitStep(to);
  };

  return (
    <div className="st-wrapper" style={vars}>
      <div className="st-body">
        <div className="st-rail">
          {steps.map((step, index) => {
            const isComplete = index < visualCompleteUpto;
            const isActive = isAnimating ? index === from : index === activeStep;

            const dotState = isComplete
              ? "st-dot-complete"
              : isActive
                ? "st-dot-active"
                : "st-dot-inactive";

            return (
              <div key={step.key} className="st-node">
                <div className={`st-dot st-dot-motion ${dotState}`}>
                  {isComplete ? "\u2713" : index + 1}
                </div>

                {index < steps.length - 1 && (
                  <Connector
                    index={index}
                    from={from}
                    to={to}
                    isAnimating={isAnimating}
                    direction={direction}
                    activeStep={activeStep}
                    onMovingTransitionEnd={shouldCommitOnEnd}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="st-label-row">
          {steps.map((step, index) => {
            const isActive = isAnimating ? index === from : index === activeStep;

            return (
              <div
                key={step.key}
                className="st-label-cell"
                style={{
                  marginRight:
                    index < steps.length - 1
                      ? "calc(var(--st-connW) + 2 * var(--st-gap))"
                      : undefined,
                }}
              >
                <span className={isActive ? "st-label-active" : "st-label-inactive"}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function Connector({
  index,
  from,
  to,
  isAnimating,
  direction,
  activeStep,
  onMovingTransitionEnd,
}: {
  index: number;
  from: number;
  to: number;
  activeStep: number;
  isAnimating: boolean;
  direction: "forward" | "backward";
  onMovingTransitionEnd: (e: TransitionEvent<HTMLDivElement>) => void;
}) {
  const isMoving =
    isAnimating &&
    ((direction === "forward" && index === from) ||
      (direction === "backward" && index === to));

  const stableFilled = isAnimating
    ? direction === "forward"
      ? index < from
      : index < to
    : index < activeStep;

  const targetScale = isMoving
    ? direction === "forward"
      ? 1
      : 0
    : stableFilled
      ? 1
      : 0;

  return (
    <div className="st-connector-shell">
      <div className="st-connector-track">
        <div
          className={`st-connector-fill ${isMoving ? "st-connector-moving" : ""}`}
          style={{ transform: `scaleX(${targetScale})` }}
          onTransitionEnd={isMoving ? onMovingTransitionEnd : undefined}
        />
      </div>
    </div>
  );
}

