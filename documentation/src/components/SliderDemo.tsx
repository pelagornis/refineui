import { useState } from "react";
import { fontSizes, spacings } from "@refineui/tokens";
import { Slider } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function SliderDemo() {
  const [value, setValue] = useState(50);
  return (
    <PreviewFrame>
      <div style={{ maxWidth: "300px" }}>
        <Slider value={value} onChange={setValue} min={0} max={100} />
        <p style={{ marginTop: spacings.sizeSmall, marginBottom: 0, fontSize: fontSizes.fontSize300 }}>값: {value}</p>
      </div>
    </PreviewFrame>
  );
}
