import type { CSSProperties } from "react";
import { colors, fontSizes, fontWeights, spacings } from "@refineui/tokens";
import { Avatars } from "@refineui/react";
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

const sample = [
  { alt: "Kim Minsoo" },
  { alt: "Lee Jiwon" },
  { alt: "Park Seoyeon" },
  { alt: "Choi Junho" },
  { alt: "Jung Hayoung" },
];

export default function AvatarsPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeLarge }}>
        <p style={sectionLabel}>layout=&quot;stack&quot; (겹침, 기본)</p>
        <div style={{ display: "flex", alignItems: "center", gap: spacings.sizeXLarge, flexWrap: "wrap" }}>
          <Avatars avatars={sample.slice(0, 3)} size="sm" layout="stack" />
          <Avatars avatars={sample.slice(0, 3)} size="md" layout="stack" />
          <Avatars avatars={sample} size="lg" max={4} layout="stack" />
        </div>

        <p style={{ ...sectionLabel, ...sectionGap }}>layout=&quot;spread&quot; (간격, Web Kit Avater Spread)</p>
        <div style={{ display: "flex", alignItems: "center", gap: spacings.sizeXLarge, flexWrap: "wrap" }}>
          <Avatars avatars={sample.slice(0, 3)} size="sm" layout="spread" />
          <Avatars avatars={sample.slice(0, 3)} size="md" layout="spread" />
          <Avatars avatars={sample} size="lg" max={4} layout="spread" />
        </div>

        <p style={{ ...sectionLabel, ...sectionGap }}>이미지 + 이니셜</p>
        <div style={{ display: "flex", alignItems: "center", gap: spacings.sizeXLarge, flexWrap: "wrap" }}>
          <Avatars
            layout="stack"
            avatars={[
              { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=1", alt: "User A" },
              { alt: "B" },
              { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=3", alt: "User C" },
            ]}
            size="md"
          />
          <Avatars
            layout="spread"
            avatars={[
              { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=4", alt: "User D" },
              { alt: "E" },
              { src: "https://api.dicebear.com/7.x/avataaars/svg?seed=6", alt: "User F" },
            ]}
            size="md"
          />
        </div>
      </div>
    </PreviewFrame>
  );
}
