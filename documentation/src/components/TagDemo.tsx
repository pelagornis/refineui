import { spacings } from "@refineui/tokens";
import { Tag } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function TagDemo() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeMedium }}>
        <Tag variant="default">Default</Tag>
        <Tag variant="outline">Outline</Tag>
        <Tag variant="filled">Filled</Tag>
        <Tag onRemove={() => alert("제거")}>제거 가능</Tag>
      </div>
    </PreviewFrame>
  );
}
