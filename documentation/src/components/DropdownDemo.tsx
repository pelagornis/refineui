import { Dropdown, Button } from "@refineui/react";
import { spacings } from "@refineui/tokens";
import PreviewFrame from "./PreviewFrame";

/** Web Kit `503:2985` — 트리거+셰브론 / 단순 트리거, 메뉴 옵션·Title */
export default function DropdownDemo() {
  return (
    <PreviewFrame minHeight="min(60vh, 560px)">
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeXLarge, alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeLarge, alignItems: "flex-start" }}>
          <Dropdown
            showTriggerChevron
            menuTitle="계정"
            trigger={
              <Button variant="secondary" size="sm">
                옵션 열기
              </Button>
            }
            items={[
              { id: "1", label: "Profile", shortcut: "⌘P" },
              { id: "2", label: "Dashboard", shortcut: "⌘D" },
              { id: "3", label: "Team settings", shortcut: "⌘T" },
              { id: "4", label: "Billing", shortcut: "⌘B" },
              { id: "5", label: "Sign out", shortcut: "⌘⇧Q" },
              { id: "6", label: "비활성 항목", disabled: true },
            ]}
          />
          <Dropdown
            align="start"
            trigger={
              <Button variant="outline" size="md">
                메뉴 (셰브론 없음)
              </Button>
            }
            items={[
              { id: "a", label: "Duplicate" },
              { id: "b", label: "Move to…" },
              { id: "c", label: "Archive" },
              { id: "d", label: "Delete", onClick: () => {} },
            ]}
          />
        </div>
      </div>
    </PreviewFrame>
  );
}
