import { spacings } from "@refineui/tokens";
import { PopOver, Button } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function PopOverDemo() {
  return (
    <PreviewFrame>
      <PopOver
        trigger={<Button variant="secondary">PopOver 열기</Button>}
        content={<div style={{ padding: spacings.sizeSmall }}>PopOver 내용입니다.</div>}
      />
    </PreviewFrame>
  );
}
