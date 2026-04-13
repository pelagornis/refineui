import { spacings } from "@refineui/tokens";
import { Progress } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function ProgressPreview() {
  return (
    <PreviewFrame>
      <div style={{ maxWidth: "400px", display: "flex", flexDirection: "column", gap: spacings.sizeMedium }}>
        <Progress value={30} />
        <Progress value={60} size="lg" />
        <Progress value={90} />
      </div>
    </PreviewFrame>
  );
}
