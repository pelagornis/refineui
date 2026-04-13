import { spacings } from "@refineui/tokens";
import { PopOver, Button } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function PopOverDemo() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeMedium, alignItems: "flex-start" }}>
        <PopOver
          trigger={<Button variant="secondary">Default</Button>}
          content={<div style={{ padding: spacings.sizeSmall }}>PopOver 내용입니다.</div>}
        />
        <PopOver
          variant="inverted"
          trigger={<Button variant="primary">Inverted</Button>}
          content={<div style={{ padding: spacings.sizeSmall }}>어두운 패널</div>}
        />
      </div>
    </PreviewFrame>
  );
}
