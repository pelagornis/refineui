import { spacings } from "@refineui/tokens";
import { Spinner, type SpinnerSize } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

const allSizes: SpinnerSize[] = ["xs", "sm", "md", "lg", "xl", "xxl"];

export default function SpinnerPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeXXLarge }}>
        <div style={{ display: "flex", gap: spacings.sizeLarge, alignItems: "center", flexWrap: "wrap" }}>
          {allSizes.map((s) => (
            <Spinner key={s} size={s} />
          ))}
        </div>
        <div style={{ display: "flex", gap: spacings.sizeXXLarge, alignItems: "center", flexWrap: "wrap" }}>
          <Spinner size="md" label="Progress.." labelPosition="right" />
          <Spinner size="md" label="Progress.." labelPosition="left" />
          <Spinner size="sm" label="Progress.." labelPosition="bottom" />
        </div>
      </div>
    </PreviewFrame>
  );
}
