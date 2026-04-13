import { iconSizes, spacings } from "@refineui/tokens";
import { Button, WebIcon } from "@refineui/react";
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
        </div>
      </PreviewFrame>
      <PreviewFrame title="Layout=Icon · Size=sm (Web Kit `79:3304`)">
        <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeMedium, alignItems: "center" }}>
          <Button variant="primary" size="sm" layout="icon" type="button" aria-label="확인">
            <WebIcon name="checkmark" size={iconSizes.small} color="currentColor" iconStyle="regular" aria-hidden />
          </Button>
          <Button variant="secondary" size="sm" layout="icon" type="button" aria-label="정보">
            <WebIcon name="info" size={iconSizes.small} color="currentColor" aria-hidden />
          </Button>
          <Button variant="outline" size="sm" layout="icon" type="button" aria-label="더보기">
            <WebIcon name="more-horizontal" size={iconSizes.small} color="currentColor" aria-hidden />
          </Button>
          <Button variant="ghost" size="sm" layout="icon" type="button" aria-label="닫기">
            <WebIcon name="dismiss" size={iconSizes.small} color="currentColor" iconStyle="regular" aria-hidden />
          </Button>
        </div>
      </PreviewFrame>
      <PreviewFrame title="Layout=Icon · Ghost · Size (Dialog 닫기와 동일 축)">
        <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeMedium, alignItems: "center" }}>
          <Button variant="ghost" size="sm" layout="icon" type="button" aria-label="닫기 sm">
            <WebIcon name="dismiss" size={iconSizes.small} color="currentColor" iconStyle="regular" aria-hidden />
          </Button>
          <Button variant="ghost" size="md" layout="icon" type="button" aria-label="닫기 md">
            <WebIcon name="dismiss" size={iconSizes.medium} color="currentColor" iconStyle="regular" aria-hidden />
          </Button>
          <Button variant="ghost" size="lg" layout="icon" type="button" aria-label="닫기 lg">
            <WebIcon name="dismiss" size={iconSizes.large} color="currentColor" iconStyle="regular" aria-hidden />
          </Button>
        </div>
      </PreviewFrame>
      <PreviewFrame>
        <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeMedium, alignItems: "center" }}>
          <Button size="sm">Small (28px)</Button>
          <Button size="md">Medium (36px)</Button>
          <Button size="lg">Large (48px)</Button>
        </div>
      </PreviewFrame>
      <PreviewFrame>
        <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeMedium, alignItems: "center" }}>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
          <Button variant="outline" disabled>
            Disabled
          </Button>
          <Button variant="ghost" disabled>
            Disabled
          </Button>
        </div>
      </PreviewFrame>
      <PreviewFrame>
        <div style={{ width: "100%", maxWidth: "360px" }}>
          <Button variant="primary" fullWidth type="button">
            fullWidth
          </Button>
        </div>
      </PreviewFrame>
    </>
  );
}
