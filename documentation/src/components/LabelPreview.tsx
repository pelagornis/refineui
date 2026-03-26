import { spacings } from "@refineui/tokens";
import { Label, Input } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function LabelPreview() {
  return (
    <PreviewFrame>
      <div style={{ maxWidth: "320px", display: "flex", flexDirection: "column", gap: spacings.sizeLarge }}>
        <div>
          <Label htmlFor="label-demo">일반 라벨</Label>
          <Input id="label-demo" placeholder="입력" />
        </div>
        <div>
          <Label htmlFor="label-required" required>
            필수 라벨
          </Label>
          <Input id="label-required" placeholder="입력" />
        </div>
      </div>
    </PreviewFrame>
  );
}
