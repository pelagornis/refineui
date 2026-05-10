import { spacings } from "@refineui/tokens";
import { Field, FieldError, FieldHint, FieldLabel, FieldRequired, Input } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function FieldPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeLarge, maxWidth: "320px" }}>
        <Field>
          <FieldLabel>
            Email
            <FieldRequired />
          </FieldLabel>
          <Input type="email" placeholder="email@example.com" />
        </Field>
        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input type="password" placeholder="••••••••" />
          <FieldError>Please enter your password</FieldError>
        </Field>
        <Field>
          <FieldLabel>Nickname</FieldLabel>
          <Input placeholder="Enter text" success />
          <FieldHint>2–12 characters</FieldHint>
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Input placeholder="Enter text" />
          <FieldHint>Enter at least 8 characters</FieldHint>
        </Field>
        <Field size="lg">
          <FieldLabel>Large label</FieldLabel>
          <Input placeholder="Enter text" />
          <FieldHint>size=lg → body1</FieldHint>
        </Field>
      </div>
    </PreviewFrame>
  );
}
