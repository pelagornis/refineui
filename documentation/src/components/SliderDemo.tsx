import { useState } from "react";
import { fontSizes, spacings } from "@refineui/tokens";
import { Slider } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function SliderDemo() {
  const [valueMd, setValueMd] = useState(50);
  const [valueSm, setValueSm] = useState(30);
  return (
    <PreviewFrame>
      <div style={{ maxWidth: "300px", display: "flex", flexDirection: "column", gap: spacings.sizeLarge }}>
        <div>
          <p style={{ margin: 0, marginBottom: spacings.sizeXSmall, fontSize: fontSizes.fontSize300 }}>Medium (default)</p>
          <Slider value={valueMd} onChange={setValueMd} min={0} max={100} size="md" />
          <p style={{ marginTop: spacings.sizeSmall, marginBottom: 0, fontSize: fontSizes.fontSize300 }}>Value: {valueMd}</p>
        </div>
        <div>
          <p style={{ margin: 0, marginBottom: spacings.sizeXSmall, fontSize: fontSizes.fontSize300 }}>Small</p>
          <Slider value={valueSm} onChange={setValueSm} min={0} max={100} size="sm" />
          <p style={{ marginTop: spacings.sizeSmall, marginBottom: 0, fontSize: fontSizes.fontSize300 }}>Value: {valueSm}</p>
        </div>
      </div>
    </PreviewFrame>
  );
}
