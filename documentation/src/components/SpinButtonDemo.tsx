import { useState } from "react";
import { SpinButton } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function SpinButtonDemo() {
  const [value, setValue] = useState(5);
  return (
    <PreviewFrame>
      <SpinButton value={value} onChange={setValue} min={0} max={10} step={1} />
    </PreviewFrame>
  );
}
