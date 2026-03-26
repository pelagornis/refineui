import { colors, fontSizes, fontWeights, spacings } from "@refineui/tokens";
import { Accordion } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

const sampleItems = [
  { id: "1", title: "섹션 1", content: "첫 번째 패널 내용입니다.", icon: "home" as const },
  { id: "2", title: "섹션 2", content: "두 번째 패널 내용입니다.", icon: "folder" as const, defaultOpen: true },
  { id: "3", title: "섹션 3", content: "세 번째 패널 내용입니다.", icon: "settings" as const },
];

const sectionCaption = {
  margin: 0,
  marginBottom: spacings.sizeSmall,
  fontSize: fontSizes.fontSize200,
  fontWeight: fontWeights.fontWeightSemibold,
  color: colors.neutral600,
} as const;

export default function AccordionPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeXLarge, width: "100%", maxWidth: 1102 }}>
        {(
          [
            { size: "small" as const, label: 'size="small" (Caption1)' },
            { size: "medium" as const, label: 'size="medium" (Body1) — 기본' },
            { size: "large" as const, label: 'size="large" (SubTitle1)' },
          ] as const
        ).map(({ size, label }) => (
          <div key={size}>
            <p style={sectionCaption}>{label}</p>
            <Accordion items={sampleItems.map((i) => ({ ...i, id: `${size}-${i.id}` }))} size={size} />
          </div>
        ))}
      </div>
    </PreviewFrame>
  );
}
