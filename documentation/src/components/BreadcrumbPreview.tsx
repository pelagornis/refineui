import { colors, fontSizes, spacings } from "@refineui/tokens";
import { Breadcrumb } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

const caption = {
  margin: 0,
  marginBottom: spacings.sizeSmall,
  fontSize: fontSizes.fontSize200,
  color: colors.neutral600,
} as const;

export default function BreadcrumbPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeLarge, width: "100%" }}>
        <div>
          <p style={caption}>기본 (구분자 / — Figma Web Kit)</p>
          <Breadcrumb
            items={[
              { id: "1", label: "홈", href: "#" },
              { id: "2", label: "문서", href: "#" },
              { id: "3", label: "컴포넌트" },
            ]}
          />
        </div>
        <div>
          <p style={caption}>ellipsis (중간 생략 — Figma Breadcrumb Long)</p>
          <Breadcrumb
            items={[
              { id: "1", label: "홈", href: "#" },
              {
                id: "e",
                ellipsis: true,
                label: "중간 경로 생략",
                onClick: () => {},
              },
              { id: "3", label: "긴 경로의 마지막" },
            ]}
          />
        </div>
      </div>
    </PreviewFrame>
  );
}
