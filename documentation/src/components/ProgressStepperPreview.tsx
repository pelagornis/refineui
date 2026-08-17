import { useState } from "react";
import {
  ProgressStepper,
  ProgressStepperItem,
  ProgressStepperLabel,
  ProgressStepperList,
  ProgressStepperMarker,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

const checkout = [
  { value: 0, title: "Cart" },
  { value: 1, title: "Shipping" },
  { value: 2, title: "Payment" },
  { value: 3, title: "Review" },
] as const;

export default function ProgressStepperPreview() {
  const [value, setValue] = useState(1);

  return (
    <Looks>
      <Look align="stretch">
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
      </Look>
    </Looks>
  );
}
