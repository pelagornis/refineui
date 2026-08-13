import { spacings } from "@refineui/tokens";
import { Field, FieldError, FieldHint, FieldLabel, FieldRequired, Input } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function FieldPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeXLarge, maxWidth: "360px" }}>
        <Field>
          <FieldLabel>
            Email
            <FieldRequired />
          </FieldLabel>
          <Input type="email" placeholder="email@example.com" fullWidth />
        </Field>
        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input type="password" placeholder="Enter password" fullWidth />
          <FieldError>Please enter your password</FieldError>
        </Field>
        <Field>
          <FieldLabel>Nickname</FieldLabel>
          <Input placeholder="Enter text" success fullWidth />
          <FieldHint>2–12 characters</FieldHint>
        </Field>
        <Field size="md">
          <FieldLabel>Medium field</FieldLabel>
          <Input placeholder="size=md" fullWidth />
          <FieldHint>Label body2 · control 40px</FieldHint>
        </Field>
        <Field size="sm">
          <FieldLabel>Compact field</FieldLabel>
          <Input placeholder="size=sm" fullWidth />
          <FieldHint>Label caption1 · control 32px</FieldHint>
        </Field>
      </div>
    </PreviewFrame>
  );
}
