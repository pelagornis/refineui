import { useState } from "react";
import { Dialog, Button } from "@refineui/react";
import { borderRadii, colors, spacings, strokeWidths, typographys } from "@refineui/tokens";
import PreviewFrame from "./PreviewFrame";

/** 미리보기 무대 — Dialog는 `document.body` 포털로만 표시 */
export default function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <PreviewFrame>
      <div
        data-dialog-demo-stage
        style={{
          width: "100%",
          minHeight: "min(52vh, 440px)",
          boxSizing: "border-box",
          padding: spacings.sizeLarge,
          borderRadius: borderRadii.roundedMedium,
          border: `${strokeWidths.strokeWidthThin} solid ${colors.neutral300}`,
          backgroundColor: colors.neutralWhite,
        }}
      >
        <Button onClick={() => setOpen(true)}>Dialog 열기</Button>
        <p
          style={{
            marginTop: spacings.sizeMedium,
            marginBottom: 0,
            maxWidth: "42rem",
            ...typographys.body4,
            color: colors.neutral600,
          }}
        >
          열리면 스크림과 패널은 미리보기 박스가 아니라 <strong>페이지 전체</strong> 위에 표시됩니다. ESC
          또는 배경을 누르면 닫힙니다.
        </p>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} title="Dialog 제목">
        Dialog Content
      </Dialog>
    </PreviewFrame>
  );
}
