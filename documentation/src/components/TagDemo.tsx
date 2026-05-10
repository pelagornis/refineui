import { spacings } from "@refineui/tokens";
import { Tag } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function TagDemo() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeLarge }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeMedium, alignItems: "center" }}>
          <Tag variant="default">Default</Tag>
          <Tag variant="outline">Outline</Tag>
          <Tag variant="filled">Filled</Tag>
          <Tag onRemove={() => alert("Remove")}>Removable</Tag>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeMedium, alignItems: "center" }}>
          <Tag size="lg">Large</Tag>
          <Tag size="md">Medium</Tag>
          <Tag size="sm">Small</Tag>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeMedium, alignItems: "center" }}>
          <Tag disabled variant="default">
            Disabled default
          </Tag>
          <Tag disabled variant="outline">
            Disabled outline
          </Tag>
          <Tag disabled variant="filled">
            Disabled filled
          </Tag>
        </div>
      </div>
    </PreviewFrame>
  );
}
