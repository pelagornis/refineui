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
          <Tag onRemove={() => {}}>Removable</Tag>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeMedium, alignItems: "center" }}>
          <Tag size="sm">Small</Tag>
          <Tag size="md">Medium</Tag>
          <Tag size="lg">Large</Tag>
          <Tag size="sm" onRemove={() => {}}>
            sm
          </Tag>
          <Tag size="md" onRemove={() => {}}>
            md
          </Tag>
          <Tag size="lg" onRemove={() => {}}>
            lg
          </Tag>
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
