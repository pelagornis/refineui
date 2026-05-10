import { spacings } from "@refineui/tokens";
import { Input } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function InputPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeMedium, maxWidth: "320px" }}>
        <Input placeholder="size md (default)" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeSmall, alignItems: "center" }}>
          <Input size="sm" placeholder="sm" />
          <Input size="md" placeholder="md" />
          <Input size="lg" placeholder="lg" />
        </div>
        <Input placeholder="Full width" fullWidth />
        <Input placeholder="Success" success />
        <Input placeholder="Error state" error />
        <Input placeholder="Disabled" disabled />
      </div>
    </PreviewFrame>
  );
}
