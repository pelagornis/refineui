import { spacings } from "@refineui/tokens";
import { Checkbox } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function CheckboxPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeMedium }}>
        <Checkbox defaultChecked label="체크됨 (default)" />
        <Checkbox label="체크 안 됨" />
        <Checkbox variant="circular" defaultChecked label="원형 variant" />
        <Checkbox
          label="제목"
          description="보조 설명 한 줄"
        />
        <Checkbox disabled label="비활성화" />
        <Checkbox disabled defaultChecked label="비활성화 · 선택됨" />
      </div>
    </PreviewFrame>
  );
}
