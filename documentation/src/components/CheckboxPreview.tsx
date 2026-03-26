import { spacings } from "@refineui/tokens";
import { Checkbox } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function CheckboxPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeMedium }}>
        <label style={{ display: "flex", alignItems: "center", gap: spacings.sizeSmall }}>
          <Checkbox defaultChecked />
          <span>체크됨</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: spacings.sizeSmall }}>
          <Checkbox />
          <span>체크 안 됨</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: spacings.sizeSmall }}>
          <Checkbox disabled />
          <span>비활성화</span>
        </label>
      </div>
    </PreviewFrame>
  );
}
