import { spacings } from "@refineui/tokens";
import { Spinner } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function SpinnerPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", gap: spacings.sizeXLarge, alignItems: "center", flexWrap: "wrap" }}>
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
      </div>
    </PreviewFrame>
  );
}
