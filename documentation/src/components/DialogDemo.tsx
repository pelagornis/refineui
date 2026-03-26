import { useState } from "react";
import { Dialog, Button } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <PreviewFrame>
      <Button onClick={() => setOpen(true)}>Dialog 열기</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="다이얼로그 제목">
        다이얼로그 내용입니다. ESC 키로 닫을 수 있습니다.
      </Dialog>
    </PreviewFrame>
  );
}
