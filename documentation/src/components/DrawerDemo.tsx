import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Button,
} from "@refineui/react";
import { borderRadii, colors, spacings, strokeWidths, typographys } from "@refineui/tokens";
import PreviewFrame from "./PreviewFrame";

/** Preview 안에서 본문과 구분되는 데모 무대 — Drawer 본체는 body 포털로만 렌더됨 */
export default function DrawerDemo() {
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
        <Drawer>
          <DrawerTrigger>Drawer 열기</DrawerTrigger>
          <DrawerContent size="small" placement="right">
            <DrawerHeader>
              <DrawerTitle>Drawer 제목</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              <p style={{ margin: 0 }}>Drawer Content</p>
            </DrawerBody>
            <DrawerFooter>
              <DrawerClose>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <Button>Submit</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
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
    </PreviewFrame>
  );
}
