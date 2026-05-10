import { spacings } from "@refineui/tokens";
import { Checkbox } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function CheckboxPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeMedium }}>
        <Checkbox defaultChecked label="Checked (default)" />
        <Checkbox label="Unchecked" />
        <Checkbox variant="circular" defaultChecked label="Circular variant" />
        <Checkbox
          label="Title"
          description="Supporting line of text"
        />
        <Checkbox disabled label="Disabled" />
        <Checkbox disabled defaultChecked label="Disabled · selected" />
      </div>
    </PreviewFrame>
  );
}
