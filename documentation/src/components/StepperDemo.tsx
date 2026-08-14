import { Fragment, useState } from "react";
import { iconSizes, spacings } from "@refineui/tokens";
import {
  Button,
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
  WebIcon,
} from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

const steps = [
  {
    value: 0,
    title: "Account",
    description: "Profile & email",
    panel: "Create your workspace identity and verify the contact email.",
  },
  {
    value: 1,
    title: "Plan",
    description: "Billing cycle",
    panel: "Pick a plan. Tokens keep the rail, indicator, and connector aligned.",
  },
  {
    value: 2,
    title: "Review",
    description: "Confirm details",
    panel: "Double-check everything, then finish. Completed steps stay clickable.",
  },
] as const;

function StepGlyph({ index, active }: { index: number; active: number }) {
  if (index < active) {
    return (
      <WebIcon
        name="checkmark"
        size={iconSizes.xsmall}
        color="currentColor"
        iconStyle="filled"
        fallback="✓"
      />
    );
  }
  return <span>{index + 1}</span>;
}

export default function StepperDemo() {
  const [value, setValue] = useState(1);
  const [verticalValue, setVerticalValue] = useState(0);
  const done = value >= steps.length;
  const current = done
    ? {
        title: "Done",
        panel: "All steps are complete. You can go back to review any step.",
      }
    : (steps[value] ?? steps[0]);

  return (
    <PreviewFrame minHeight="420px">
      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: "560px",
          flexDirection: "column",
          gap: spacings.sizeXXLarge,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeLarge }}>
          <Stepper value={value} onValueChange={setValue} orientation="horizontal">
            <StepperList>
              {steps.map((step, index) => (
                <Fragment key={step.value}>
                  <StepperItem value={step.value}>
                    <StepperIndicator>
                      <StepGlyph index={index} active={value} />
                    </StepperIndicator>
                    <StepperContent>
                      <StepperTitle>{step.title}</StepperTitle>
                      <StepperDescription>{step.description}</StepperDescription>
                    </StepperContent>
                  </StepperItem>
                  {index < steps.length - 1 ? <StepperSeparator /> : null}
                </Fragment>
              ))}
            </StepperList>
          </Stepper>

          <div
            style={{
              boxSizing: "border-box",
              borderRadius: "var(--refineui-radius-rounded-x-large)",
              border: "var(--refineui-stroke-width-thin) solid var(--refineui-color-alias-border-default)",
              background: "var(--refineui-color-alias-background-primary)",
              padding: spacings.sizeXLarge,
              boxShadow: "var(--refineui-shadow-2)",
              display: "flex",
              flexDirection: "column",
              gap: spacings.sizeMedium,
            }}
          >
            <strong
              className="refineui-typo-subtitle-2"
              style={{ color: "var(--refineui-color-alias-foreground-primary)" }}
            >
              {current.title}
            </strong>
            <p
              className="refineui-typo-body-3"
              style={{ margin: 0, color: "var(--refineui-color-alias-foreground-secondary)" }}
            >
              {current.panel}
            </p>
            <div style={{ display: "flex", gap: spacings.sizeSmall, marginTop: spacings.sizeXSmall }}>
              <Button
                variant="outline"
                size="sm"
                disabled={value <= 0}
                onClick={() =>
                  setValue((v) => (v >= steps.length ? steps.length - 1 : Math.max(0, v - 1)))
                }
              >
                Back
              </Button>
              {done ? null : value >= steps.length - 1 ? (
                <Button variant="primary" size="sm" onClick={() => setValue(steps.length)}>
                  Finish
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setValue((v) => Math.min(steps.length - 1, v + 1))}
                >
                  Continue
                </Button>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeMedium }}>
          <span
            className="refineui-typo-caption-2"
            style={{
              color: "var(--refineui-color-alias-foreground-tertiary)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Vertical
          </span>
          <Stepper
            value={verticalValue}
            onValueChange={setVerticalValue}
            orientation="vertical"
          >
            <StepperList>
              {steps.map((step, index) => (
                <Fragment key={`v-${step.value}`}>
                  <StepperItem value={step.value}>
                    <StepperIndicator>
                      <StepGlyph index={index} active={verticalValue} />
                    </StepperIndicator>
                    <StepperContent>
                      <StepperTitle>{step.title}</StepperTitle>
                      <StepperDescription>{step.description}</StepperDescription>
                    </StepperContent>
                  </StepperItem>
                  {index < steps.length - 1 ? <StepperSeparator /> : null}
                </Fragment>
              ))}
            </StepperList>
          </Stepper>
        </div>
      </div>
    </PreviewFrame>
  );
}
