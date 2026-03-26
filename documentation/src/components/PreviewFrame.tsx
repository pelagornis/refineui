import type { ReactNode } from "react";

/** Web Kit 미리보기 박스 — 값은 Foundation `sizeXXLarge`·`roundedLarge` 와 동일 */
const previewPadding = "24px";
const previewRadius = "8px";
const previewMarginBottom = "24px";

interface PreviewFrameProps {
  children: ReactNode;
  /** 배경색 — light(기본) | dark */
  variant?: "light" | "dark";
}

export default function PreviewFrame({ children, variant }: PreviewFrameProps) {
  return (
    <div
      id="refineui-preview"
      data-refineui-preview
      data-preview-variant={variant}
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: previewPadding,
        borderRadius: previewRadius,
        marginBottom: previewMarginBottom,
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", minWidth: 0 }}>{children}</div>
    </div>
  );
}
