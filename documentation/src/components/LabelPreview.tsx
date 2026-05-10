import { spacings } from "@refineui/tokens";
import { Label } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

/** Web Kit Label only (see Input/Field docs for composed forms). */
export default function LabelPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeLarge }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeSmall, alignItems: "center" }}>
          <Label size="sm">sm</Label>
          <Label size="md">md</Label>
          <Label size="lg">lg</Label>
          <Label disabled>disabled</Label>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeSmall, alignItems: "center" }}>
          <Label required>Required (asterisk)</Label>
        </div>
      </div>
    </PreviewFrame>
  );
}
