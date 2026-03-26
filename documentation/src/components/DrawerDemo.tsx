import { useState } from "react";
import { Drawer, Button } from "@refineui/react";
import { borderRadii, colors, spacings, strokeWidths, typographys } from "@refineui/tokens";
import PreviewFrame from "./PreviewFrame";

/** Preview 안에서 본문과 구분되는 데모 무대 — Drawer 본체는 body 포털로만 렌더됨 */
export default function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <PreviewFrame>
      <div
        data-drawer-demo-stage
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
        <Button onClick={() => setOpen(true)}>Drawer 열기</Button>
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
      <Drawer open={open} onClose={() => setOpen(false)} title="Drawer 제목">
        Drawer Content
      </Drawer>
    </PreviewFrame>
  );
}
