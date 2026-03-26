import type { CSSProperties } from "react";
import { colors, fontSizes, fontWeights, spacings } from "@refineui/tokens";
import { Toast } from "@refineui/react";

import PreviewFrame from "./PreviewFrame";

const sectionLabel: CSSProperties = {
  fontSize: fontSizes.fontSize200,
  fontWeight: fontWeights.fontWeightSemibold,
  color: colors.neutral600,
  margin: 0,
  marginBottom: spacings.sizeMedium,
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
};

const sectionGap: CSSProperties = { marginTop: spacings.sizeXLarge };

export default function ToastPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeLarge }}>
        <p style={sectionLabel}>기본 · 액션</p>
        <Toast
          title="Label"
          message="Description"
          iconName="info"
          action={{ label: "Action", onClick: () => {} }}
        />
        <Toast
          title="Label"
          message="Description"
          iconName="info"
          action={{ label: "Action", variant: "secondary", onClick: () => {} }}
        />

        <p style={{ ...sectionLabel, ...sectionGap }}>iconName — 다양한 System Icons</p>
        <Toast variant="success" title="저장됨" message="변경 사항이 반영되었습니다." iconName="checkmark" />
        <Toast variant="warning" title="주의" message="이 작업은 되돌릴 수 없습니다." iconName="warning" />
        <Toast variant="error" title="오류" message="요청을 처리하지 못했습니다." iconName="error-circle" />
        <Toast variant="default" title="알림" message="새 업데이트가 있습니다." iconName="mail" />
        <Toast variant="default" title="일정" message="회의가 10분 후 시작합니다." iconName="calendar" />
        <Toast variant="default" title="설정" message="권한이 필요합니다." iconName="settings" />
      </div>
    </PreviewFrame>
  );
}
