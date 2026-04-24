import { spacings } from "@refineui/tokens";
import type { TooltipAlign, TooltipPosition } from "@refineui/react";
import { Tooltip, Button } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

/** MCP 노드 명명과 동일 — 예: Top-Start, Left-Top (= Left + Start) */
const ROWS: { position: TooltipPosition; align: TooltipAlign; label: string }[][] = [
  [
    { position: "Top", align: "Start", label: "Top-Start" },
    { position: "Top", align: "Center", label: "Top-Center" },
    { position: "Top", align: "End", label: "Top-End" },
  ],
  [
    { position: "Bottom", align: "Start", label: "Bottom-Start" },
    { position: "Bottom", align: "Center", label: "Bottom-Center" },
    { position: "Bottom", align: "End", label: "Bottom-End" },
  ],
  [
    { position: "Left", align: "Start", label: "Left-Top" },
    { position: "Left", align: "Center", label: "Left-Center" },
    { position: "Left", align: "End", label: "Left-Bottom" },
  ],
  [
    { position: "Right", align: "Start", label: "Right-Top" },
    { position: "Right", align: "Center", label: "Right-Center" },
    { position: "Right", align: "End", label: "Right-Bottom" },
  ],
];

export default function TooltipDemo() {
  return (
    <PreviewFrame
      title="Web Kit MCP — position × align 12조합 · 기본값은 position Bottom, align Start"
      minHeight="min(42rem, 88vh)"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: spacings.sizeLarge,
          width: "100%",
          maxWidth: "48rem",
          margin: "0 auto",
        }}
      >
        {ROWS.flat().map((c) => (
          <div
            key={`${c.position}-${c.align}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "5.5rem",
              padding: spacings.sizeSmall,
            }}
          >
            <Tooltip
              trigger={
                <Button variant="secondary" size="sm" style={{ fontSize: "0.6875rem" }}>
                  {c.label}
                </Button>
              }
              content={c.label}
              position={c.position}
              align={c.align}
            />
          </div>
        ))}
      </div>
    </PreviewFrame>
  );
}
