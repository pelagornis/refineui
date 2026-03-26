import { spacings } from "@refineui/tokens";
import { Divider } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

const verticalRowHeight = `${Number.parseInt(spacings.sizeXXXLarge, 10) + Number.parseInt(spacings.sizeXXLarge, 10) + Number.parseInt(spacings.sizeSmall, 10)}px`;

export default function DividerPreview() {
  return (
    <>
      <PreviewFrame>
        <p style={{ margin: 0 }}>위 내용</p>
        <Divider />
        <p style={{ margin: 0 }}>아래 내용</p>
      </PreviewFrame>
      <PreviewFrame>
        <div style={{ display: "flex", height: verticalRowHeight, alignItems: "center", gap: spacings.sizeMedium }}>
          <span>왼쪽</span>
          <Divider orientation="vertical" />
          <span>오른쪽</span>
        </div>
      </PreviewFrame>
    </>
  );
}
