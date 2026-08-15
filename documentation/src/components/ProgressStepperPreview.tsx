import { useState } from "react";
import { spacings } from "@refineui/tokens";
import {
  Button,
  ProgressStepper,
  ProgressStepperItem,
  ProgressStepperLabel,
  ProgressStepperList,
  ProgressStepperMarker,
} from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

const checkout = [
  { value: 0, title: "Cart" },
  { value: 1, title: "Shipping" },
  { value: 2, title: "Payment" },
  { value: 3, title: "Review" },
] as const;

export default function ProgressStepperPreview() {
  const [value, setValue] = useState(1);
  const current = checkout[value] ?? checkout[0];

  return (
    <PreviewFrame minHeight="240px">
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
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: spacings.sizeSmall,
            }}
          >
            <span
              className="refineui-typo-caption-2"
              style={{
                color: "var(--refineui-color-alias-foreground-tertiary)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Checkout
            </span>
            <span
              className="refineui-typo-caption-2"
              style={{ color: "var(--refineui-color-alias-foreground-secondary)" }}
            >
              {value + 1} of {checkout.length} · {current.title}
            </span>
          </div>

          <ProgressStepper value={value} onValueChange={setValue}>
            <ProgressStepperList>
              {checkout.map((step) => (
                <ProgressStepperItem key={step.value} value={step.value}>
                  <ProgressStepperMarker />
                  <ProgressStepperLabel>{step.title}</ProgressStepperLabel>
                </ProgressStepperItem>
              ))}
            </ProgressStepperList>
          </ProgressStepper>

          <div style={{ display: "flex", gap: spacings.sizeSmall }}>
            <Button
              variant="outline"
              size="sm"
              disabled={value <= 0}
              onClick={() => setValue((v) => Math.max(0, v - 1))}
            >
              Back
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={value >= checkout.length - 1}
              onClick={() => setValue((v) => Math.min(checkout.length - 1, v + 1))}
            >
              Continue
            </Button>
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
            Meter
          </span>
          <ProgressStepper value={2}>
            <ProgressStepperList>
              {checkout.map((step) => (
                <ProgressStepperItem key={step.value} value={step.value}>
                  <ProgressStepperMarker />
                </ProgressStepperItem>
              ))}
            </ProgressStepperList>
          </ProgressStepper>
        </div>
      </div>
    </PreviewFrame>
  );
}
