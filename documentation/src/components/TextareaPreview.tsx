import { spacings } from "@refineui/tokens";
import { Textarea } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function TextareaPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeLarge, maxWidth: "360px" }}>
        <Textarea placeholder="Multi-line input…" rows={4} fullWidth />
        <Textarea placeholder="Success" success rows={3} fullWidth />
        <Textarea placeholder="Error state" error rows={3} fullWidth />
        <Textarea placeholder="Disabled" disabled rows={2} fullWidth />
      </div>
    </PreviewFrame>
  );
}
