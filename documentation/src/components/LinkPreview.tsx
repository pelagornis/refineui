import { spacings } from "@refineui/tokens";
import { Link } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function LinkPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", gap: spacings.sizeMedium, alignItems: "center", flexWrap: "wrap" }}>
        <Link href="#">Default link</Link>
        <Link href="https://example.com" target="_blank" rel="noopener noreferrer">
          Opens in new window (open icon)
        </Link>
        <Link href="#" onClick={(e) => e.preventDefault()} disabled>
          Disabled
        </Link>
      </div>
    </PreviewFrame>
  );
}
