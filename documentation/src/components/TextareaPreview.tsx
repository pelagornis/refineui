import { spacings } from "@refineui/tokens";
import { Textarea } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function TextareaPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeMedium, maxWidth: "400px" }}>
        <Textarea placeholder="Multi-line input…" rows={4} />
        <Textarea placeholder="Success" success rows={3} />
        <Textarea placeholder="Error state" error rows={3} />
        <Textarea placeholder="Disabled" disabled rows={2} />
      </div>
    </PreviewFrame>
  );
}
