import { colors, spacings, typographys } from "@refineui/tokens";
import { Card } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function CardPreview() {
  const cardContent = (
    <>
      <h3 style={{ margin: 0, marginBottom: spacings.sizeXSmall, ...typographys.subTitle2 }}>Card Title</h3>
      <p style={{ margin: 0, ...typographys.body4, color: colors.neutral600 }}>
        카드 내용입니다. 여러 줄의 텍스트를 담을 수 있습니다.
      </p>
    </>
  );
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeLarge, maxWidth: "320px" }}>
        <Card variant="elevated">{cardContent}</Card>
        <Card variant="outlined">{cardContent}</Card>
      </div>
    </PreviewFrame>
  );
}
