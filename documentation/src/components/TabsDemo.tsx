import { colors, fontSizes, fontWeights, spacings } from "@refineui/tokens";
import { Tabs } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

const items = [
  { id: "1", label: "탭 1", content: "첫 번째 탭 내용입니다." },
  { id: "2", label: "탭 2", content: "두 번째 탭 내용입니다." },
  { id: "3", label: "탭 3", content: "세 번째 탭 내용입니다." },
];

const sectionLabel = {
  fontSize: fontSizes.fontSize200,
  fontWeight: fontWeights.fontWeightSemibold,
  color: colors.neutral600,
  margin: 0,
  marginBottom: spacings.sizeMedium,
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
};

export default function TabsDemo() {
  return (
    <>
      <PreviewFrame>
        <p style={sectionLabel}>variant=&quot;pill&quot; (기본)</p>
        <Tabs items={items} variant="pill" />
      </PreviewFrame>
      <PreviewFrame>
        <p style={sectionLabel}>variant=&quot;underline&quot;</p>
        <Tabs
          items={items.map((i) => ({ ...i, id: `u-${i.id}` }))}
          defaultTab="u-1"
          variant="underline"
        />
      </PreviewFrame>
    </>
  );
}
