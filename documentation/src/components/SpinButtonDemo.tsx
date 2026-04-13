import { useState } from "react";
import { fontSizes, spacings } from "@refineui/tokens";
import { SpinButton } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function SpinButtonDemo() {
  const [a, setA] = useState(5);
  const [b, setB] = useState(2);
  const [c, setC] = useState(12);
  return (
    <PreviewFrame>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacings.sizeLarge,
          alignItems: "flex-start",
        }}
      >
        <div>
          <p style={{ margin: 0, marginBottom: spacings.sizeXSmall, fontSize: fontSizes.fontSize300 }}>Medium</p>
          <SpinButton value={a} onChange={setA} min={0} max={10} step={1} size="md" />
        </div>
        <div>
          <p style={{ margin: 0, marginBottom: spacings.sizeXSmall, fontSize: fontSizes.fontSize300 }}>Small</p>
          <SpinButton value={b} onChange={setB} min={0} max={10} step={1} size="sm" />
        </div>
        <div>
          <p style={{ margin: 0, marginBottom: spacings.sizeXSmall, fontSize: fontSizes.fontSize300 }}>Large · disabled</p>
          <SpinButton value={c} onChange={setC} min={0} max={99} step={1} size="lg" disabled />
        </div>
      </div>
    </PreviewFrame>
  );
}
