import { spacings } from "@refineui/tokens";
import { Skeleton } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function SkeletonPreview() {
  return (
    <PreviewFrame>
      <div style={{ maxWidth: "320px" }}>
        <div style={{ display: "flex", gap: spacings.sizeMedium, marginBottom: spacings.sizeMedium }}>
          <Skeleton width={40} height={40} shape="circle" />
          <div style={{ flex: 1 }}>
            <Skeleton height={16} style={{ marginBottom: spacings.sizeXSmall }} />
            <Skeleton height={12} width="80%" />
          </div>
        </div>
        <Skeleton height={100} style={{ marginBottom: spacings.sizeMedium }} />
        <Skeleton height={20} />
      </div>
    </PreviewFrame>
  );
}
