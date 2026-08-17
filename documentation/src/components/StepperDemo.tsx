import { Fragment, useState } from "react";
import { iconSizes } from "@refineui/tokens";
import {
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
import { Look, Looks } from "./PreviewFrame";

const steps = [
  { value: 0, title: "Account", description: "Profile & email" },
  { value: 1, title: "Plan", description: "Billing cycle" },
  { value: 2, title: "Review", description: "Confirm details" },
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

  return (
    <Looks>
      <Look align="stretch">
        <Stepper value={value} onValueChange={setValue} orientation="horizontal" className="w-full">
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
      </Look>
    </Looks>
  );
}
