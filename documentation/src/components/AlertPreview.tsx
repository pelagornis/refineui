import type { CSSProperties } from "react";
import { colors, fontSizes, fontWeights, spacings, iconSizes } from "@refineui/tokens";
import { Alert, WebIcon } from "@refineui/react";

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

export default function AlertPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeLarge }}>
        <p style={sectionLabel}>Variant 기본 아이콘</p>
        <Alert variant="default" title="Alert Title" description="Alert Description" />
        <Alert
          variant="success"
          title="Alert Title"
          description="Alert Description"
          onClose={() => {}}
          actions={[{ label: "Action", onClick: () => {} }, { label: "Action", onClick: () => {} }]}
        />
        <Alert variant="danger" title="Alert Title" description="Alert Description" onClose={() => {}} />
        <Alert variant="warning" title="Alert Title" description="Alert Description" />
        <Alert variant="info" title="Alert Title" description="Alert Description" />
        <Alert variant="custom" title="Alert Title" description="Alert Description" />
        <Alert variant="info">정보 메시지입니다.</Alert>

        <p style={{ ...sectionLabel, ...sectionGap }}>icon prop — 문자열 (System Icons 슬러그)</p>
        <Alert variant="info" icon="settings" title='icon="settings"' description="RefineUI System Icons 이름을 넘기면 슬롯 안에 렌더됩니다." />
        <Alert variant="info" icon="mail" title='icon="mail"' description="메일 알림 등 용도에 맞게 바꿀 수 있습니다." />
        <Alert variant="info" icon="calendar" title='icon="calendar"' description="일정·예약 관련 메시지에 사용할 수 있습니다." />
        <Alert variant="success" icon="checkmark" title='icon="checkmark"' description="성공 톤과 다른 글리프를 조합할 수 있습니다." />
        <Alert variant="warning" icon="shield" title='icon="shield"' description="보안·권한 안내에 어울리는 아이콘 예시입니다." />
        <Alert variant="info" icon="person" title='icon="person"' description="계정·프로필 관련 알림." />
        <Alert variant="info" icon="home" title='icon="home"' description="홈·대시보드 맥락." />
        <Alert variant="info" icon="link" title='icon="link"' description="링크·연결 관련 안내." />
        <Alert variant="info" icon="image" title='icon="image"' description="미디어·첨부파일 안내." />
        <Alert variant="info" icon="folder" title='icon="folder"' description="파일·폴더 작업 안내." />

        <p style={{ ...sectionLabel, ...sectionGap }}>icon prop — ReactNode (WebIcon 직접 지정)</p>
        <Alert
          variant="custom"
          title="커스텀 WebIcon"
          description="크기·색을 직접 지정한 글리프를 슬롯 안에 넣은 예시입니다."
          icon={<WebIcon name="star" size={iconSizes.xs} color={colors.purple1000} fallback="★" aria-hidden />}
        />
      </div>
    </PreviewFrame>
  );
}
