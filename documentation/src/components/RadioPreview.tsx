import { spacings } from "@refineui/tokens";
import { Radio } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function RadioPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeMedium }}>
        <Radio name="demo" value="a" defaultChecked label="옵션 A" />
        <Radio name="demo" value="b" label="옵션 B" description="보조 설명 한 줄" />
        <Radio name="demo" value="c" disabled label="옵션 C (비활성화)" />
      </div>
    </PreviewFrame>
  );
}
