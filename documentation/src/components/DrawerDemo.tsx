import { useState } from "react";
import { Drawer, Button } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <PreviewFrame>
      <Button onClick={() => setOpen(true)}>Drawer 열기</Button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Drawer 제목">
        Drawer 내용입니다. ESC 키로 닫을 수 있습니다.
      </Drawer>
    </PreviewFrame>
  );
}
