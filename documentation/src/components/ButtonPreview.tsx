import { spacings } from "@refineui/tokens";
import { Button } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function ButtonPreview() {
  return (
    <>
      <PreviewFrame>
        <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeMedium, alignItems: "center" }}>
          <Button variant="primary" onClick={() => alert("Primary 클릭!")}>
            Primary
          </Button>
          <Button variant="secondary" onClick={() => alert("Secondary 클릭!")}>
            Secondary
          </Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </PreviewFrame>
      <PreviewFrame>
        <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeMedium, alignItems: "center" }}>
          <Button size="sm">Small (28px)</Button>
          <Button size="md">Medium (36px)</Button>
          <Button size="lg">Large (48px)</Button>
          <Button disabled>Disabled</Button>
        </div>
      </PreviewFrame>
    </>
  );
}
