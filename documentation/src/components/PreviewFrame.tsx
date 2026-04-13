import type { ReactNode } from "react";
import { borderRadii, spacings } from "@refineui/tokens";

/** Web Kit 미리보기 박스 — `@refineui/tokens` `spacings`·`borderRadii` */
const previewPadding = spacings.sizeXXLarge;
const previewRadius = borderRadii.roundedLarge;
const previewMarginBottom = spacings.sizeXXLarge;

interface PreviewFrameProps {
  children: ReactNode;
  /** 미리보기 블록 위 한 줄 설명(예: 변형 이름) */
  title?: string;
  /** 배경색 — light(기본) | dark */
  variant?: "light" | "dark";
  /** 미리보기 영역 최소 높이 — 드롭다운·오버레이 등 데모가 답답하지 않게 (예: `min(60vh, 560px)`) */
  minHeight?: string;
}

export default function PreviewFrame({ children, title, variant, minHeight }: PreviewFrameProps) {
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
        minHeight: minHeight,
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", minWidth: 0 }}>
        {title ? (
          <p
            style={{
              margin: 0,
              marginBottom: spacings.sizeMedium,
              fontSize: "0.8125rem",
              lineHeight: 1.4,
              color: "var(--refineui-color-neutral-600, #6c6c6c)",
            }}
          >
            {title}
          </p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
