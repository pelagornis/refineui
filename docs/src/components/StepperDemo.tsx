import { Fragment, useState } from "react";
import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

const steps = [
  { value: 0, title: "Account", description: "Profile & email" },
  { value: 1, title: "Plan", description: "Billing cycle" },
  { value: 2, title: "Review", description: "Confirm details" },
] as const;

export default function StepperDemo() {
  const [value, setValue] = useState(2);

  return (
    <Looks>
      <Look align="stretch">
        <Stepper value={value} onValueChange={setValue} orientation="horizontal" className="w-full">
          <StepperList>
            {steps.map((step, index) => (
              <Fragment key={step.value}>
                <StepperItem value={step.value}>
                  <StepperIndicator>{index + 1}</StepperIndicator>
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
