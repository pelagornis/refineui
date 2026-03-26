import { spacings } from "@refineui/tokens";
import { Divider } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function DividerPreview() {
  return (
    <>
      <PreviewFrame>
        <p style={{ margin: 0 }}>Default — 전체 1px</p>
        <Divider />
        <p style={{ margin: 0 }}>아래 내용</p>
      </PreviewFrame>
      <PreviewFrame>
        <p style={{ margin: 0, marginBottom: spacings.sizeSmall }}>Content / Icon — gap 10px, 짧은 선 8px</p>
        <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeMedium }}>
          <Divider layout="content" align="center">
            Content
          </Divider>
          <Divider layout="content" align="left">
            Content
          </Divider>
          <Divider layout="content" align="right">
            Content
          </Divider>
          <Divider layout="icon" align="center" />
          <Divider layout="icon" align="left" />
          <Divider layout="icon" align="right" />
        </div>
      </PreviewFrame>
    </>
  );
}
