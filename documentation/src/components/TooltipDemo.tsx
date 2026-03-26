import { spacings } from "@refineui/tokens";
import { Tooltip, Button } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function TooltipDemo() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", gap: spacings.sizeLarge, flexWrap: "wrap", alignItems: "center" }}>
        <Tooltip trigger={<Button variant="secondary">Default</Button>} content="Web Kit 기본 툴팁" placement="top" variant="default" />
        <Tooltip trigger={<Button variant="secondary">Inverted</Button>} content="다크 툴팁" placement="top" variant="inverted" />
        <Tooltip trigger={<Button variant="secondary">placement bottom</Button>} content="아래쪽" placement="bottom" variant="default" />
      </div>
    </PreviewFrame>
  );
}
