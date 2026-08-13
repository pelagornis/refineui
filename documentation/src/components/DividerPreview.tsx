import { spacings } from "@refineui/tokens";
import { Divider } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function DividerPreview() {
  return (
    <>
      <PreviewFrame>
        <p style={{ margin: 0 }}>Default — full-width 1px</p>
        <Divider />
        <p style={{ margin: 0 }}>Content below</p>
      </PreviewFrame>
      <PreviewFrame>
        <p style={{ margin: 0, marginBottom: spacings.sizeXSmall }}>Content / Icon — gap 10px, short line 8px</p>
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
