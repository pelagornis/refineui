import { spacings } from "@refineui/tokens";
import { Badge } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function BadgePreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeLarge, width: "100%" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeMedium, alignItems: "center" }}>
          <Badge variant="default">Default</Badge>
          <Badge variant="neutral">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeMedium, alignItems: "center" }}>
          <Badge layout="number" variant="default">
            3
          </Badge>
          <Badge layout="number" variant="neutral">
            12
          </Badge>
          <Badge layout="number" variant="outline">
            99+
          </Badge>
          <Badge layout="number" variant="danger">
            5
          </Badge>
          <Badge layout="number" variant="warning">
            2
          </Badge>
          <Badge layout="number" variant="success">
            0
          </Badge>
        </div>
      </div>
    </PreviewFrame>
  );
}
