import { spacings } from "@refineui/tokens";
import { Radio } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function RadioPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeSmall }}>
        <label style={{ display: "flex", alignItems: "center", gap: spacings.sizeSmall }}>
          <Radio name="demo" value="a" defaultChecked />
          <span>옵션 A</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: spacings.sizeSmall }}>
          <Radio name="demo" value="b" />
          <span>옵션 B</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: spacings.sizeSmall }}>
          <Radio name="demo" value="c" disabled />
          <span>옵션 C (비활성화)</span>
        </label>
      </div>
    </PreviewFrame>
  );
}
