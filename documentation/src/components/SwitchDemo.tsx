import { useState } from "react";
import { spacings } from "@refineui/tokens";
import { Switch } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function SwitchDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeLarge }}>
        <div style={{ display: "flex", alignItems: "center", gap: spacings.sizeMedium }}>
          <Switch checked={checked} onCheckedChange={setChecked} />
          <span>{checked ? "ON" : "OFF"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: spacings.sizeMedium }}>
          <Switch disabled />
          <span>Disabled</span>
        </div>
      </div>
    </PreviewFrame>
  );
}
