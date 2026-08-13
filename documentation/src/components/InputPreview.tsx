import { spacings } from "@refineui/tokens";
import { Input } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function InputPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeLarge, maxWidth: "360px" }}>
        <Input placeholder="Large (default) — 52px · radius 16px" fullWidth />
        <Input placeholder="Email address" type="email" fullWidth />
        <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeMedium, alignItems: "center" }}>
          <Input size="sm" placeholder="Small · 36px" />
          <Input size="md" placeholder="Medium · 44px" />
          <Input size="lg" placeholder="Large · 52px" />
        </div>
        <Input placeholder="Success" success fullWidth />
        <Input placeholder="Error state" error fullWidth />
        <Input placeholder="Disabled" disabled fullWidth />
      </div>
    </PreviewFrame>
  );
}
