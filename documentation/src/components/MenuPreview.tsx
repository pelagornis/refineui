import { Menu } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function MenuPreview() {
  return (
    <PreviewFrame>
      <Menu
        items={[
          { id: "1", label: "새로 만들기", onClick: () => alert("새로 만들기") },
          { id: "2", label: "열기", onClick: () => alert("열기") },
          { id: "3", label: "저장", onClick: () => alert("저장") },
          { id: "4", label: "비활성화", disabled: true },
        ]}
      />
    </PreviewFrame>
  );
}
