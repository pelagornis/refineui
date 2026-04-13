import { spacings } from "@refineui/tokens";
import { Link } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function LinkPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", gap: spacings.sizeMedium, alignItems: "center", flexWrap: "wrap" }}>
        <Link href="#">Default 링크</Link>
        <Link href="https://example.com" target="_blank" rel="noopener noreferrer">
          새 창 링크 (open 아이콘)
        </Link>
        <Link href="#" onClick={(e) => e.preventDefault()} disabled>
          Disabled
        </Link>
      </div>
    </PreviewFrame>
  );
}
