import { spacings } from "@refineui/tokens";
import { Textarea } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function TextareaPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeMedium, maxWidth: "400px" }}>
        <Textarea placeholder="여러 줄 입력…" rows={4} />
        <Textarea placeholder="Success" success rows={3} />
        <Textarea placeholder="에러 상태" error rows={3} />
        <Textarea placeholder="Disabled" disabled rows={2} />
      </div>
    </PreviewFrame>
  );
}
