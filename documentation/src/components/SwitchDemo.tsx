import { useState } from "react";
import { spacings } from "@refineui/tokens";
import { Switch } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function SwitchDemo() {
  const [offToOn, setOffToOn] = useState(false);
  const [onToOff, setOnToOff] = useState(true);

  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeLarge }}>
        <div style={{ display: "flex", alignItems: "center", gap: spacings.sizeMedium }}>
          <Switch checked={offToOn} onCheckedChange={setOffToOn} />
          <span>Default · {offToOn ? "ON" : "OFF"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: spacings.sizeMedium }}>
          <Switch checked={onToOff} onCheckedChange={setOnToOff} />
          <span>Starts ON · {onToOff ? "ON" : "OFF"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: spacings.sizeMedium }}>
          <Switch disabled />
          <span>Disabled · OFF</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: spacings.sizeMedium }}>
          <Switch checked disabled />
          <span>Disabled · ON</span>
        </div>
      </div>
    </PreviewFrame>
  );
}
