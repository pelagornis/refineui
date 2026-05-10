import { spacings } from "@refineui/tokens";
import { Radio } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function RadioPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeMedium }}>
        <Radio name="demo" value="a" defaultChecked label="Option A" />
        <Radio name="demo" value="b" label="Option B" description="Supporting line of text" />
        <Radio name="demo" value="c" disabled label="Option C (disabled)" />
      </div>
    </PreviewFrame>
  );
}
