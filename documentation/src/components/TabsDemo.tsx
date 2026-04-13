import { spacings } from "@refineui/tokens";
import { Tabs } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

const items = [
  { id: "1", label: "탭 1", content: "첫 번째 탭 내용입니다." },
  { id: "2", label: "탭 2", content: "두 번째 탭 내용입니다." },
  { id: "3", label: "긴 라벨 탭 예시", content: "라벨 길이에 맞춰 pill 그룹 폭이 잡힙니다." },
  { id: "4", label: "비활성", content: "이 탭은 선택할 수 없습니다.", disabled: true },
];

export default function TabsDemo() {
  return (
    <PreviewFrame minHeight="220px">
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeLarge }}>
        <Tabs items={items} />
      </div>
    </PreviewFrame>
  );
}
