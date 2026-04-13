import { spacings } from "@refineui/tokens";
import { Spinner, type SpinnerSize } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

const allSizes: SpinnerSize[] = ["xSmall", "small", "medium", "large", "xLarge", "xxLarge"];

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
          <Spinner size="medium" label="Progress.." labelPosition="right" />
          <Spinner size="medium" label="Progress.." labelPosition="left" />
          <Spinner size="small" label="Progress.." labelPosition="bottom" />
        </div>
      </div>
    </PreviewFrame>
  );
}
