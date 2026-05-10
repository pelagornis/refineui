import type { ReactNode } from "react";
import { borderRadii, spacings } from "@refineui/tokens";

/** Web Kit preview chrome — `@refineui/tokens` `spacings` and `borderRadii` */
const previewPadding = spacings.sizeXXLarge;
const previewRadius = borderRadii.roundedLarge;
const previewMarginBottom = spacings.sizeXXLarge;

interface PreviewFrameProps {
  children: ReactNode;
  /** One-line caption above the preview (e.g. variant name) */
  title?: string;
  /** Background — light (default) | dark */
  variant?: "light" | "dark";
  /** Min height for overlay demos (dropdown, popover, etc.) */
  minHeight?: string;
  /** Min width for form/panel demos */
  minWidth?: string;
}

export default function PreviewFrame({ children, title, variant, minHeight, minWidth }: PreviewFrameProps) {
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
        minWidth: minWidth ?? 0,
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
