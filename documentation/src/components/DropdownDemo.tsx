import { Dropdown, Button } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function DropdownDemo() {
  return (
    <PreviewFrame>
      <Dropdown
        showTriggerChevron
        trigger={<Button variant="secondary">메뉴 열기</Button>}
        items={[
          { id: "1", label: "항목 1", onClick: () => {} },
          { id: "2", label: "항목 2", onClick: () => {} },
          { id: "3", label: "비활성화", disabled: true },
        ]}
      />
    </PreviewFrame>
  );
}
