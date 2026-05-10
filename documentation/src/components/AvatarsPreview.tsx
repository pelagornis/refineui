import type { CSSProperties } from "react";
import { colors, fontSizes, fontWeights, spacings } from "@refineui/tokens";
import {
  Avatar,
  AvatarGroup,
  AvatarIcon,
  AvatarImage,
  AvatarText,
} from "@refineui/react";
import type { AvatarSize } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

const sectionLabel: CSSProperties = {
  fontSize: fontSizes.fontSize200,
  fontWeight: fontWeights.fontWeightSemibold,
  color: colors.neutral600,
  margin: 0,
  marginBottom: spacings.sizeMedium,
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
};

const rowLabel: CSSProperties = {
  flexShrink: 0,
  width: 88,
  fontSize: fontSizes.fontSize200,
  fontWeight: fontWeights.fontWeightMedium,
  color: colors.neutral600,
};

/** Web Kit `Avatar` Stack `69:3008` — rows `76:1427` / `76:1435` / `76:1451` */
function AvatarStackRow({ size, label }: { size: AvatarSize; label: string }) {
  return (
    <div className="flex flex-wrap items-center gap-refineui-size-medium rounded-refineui-large bg-refineui-neutral-150 px-refineui-size-large py-refineui-size-medium">
      <span style={rowLabel}>{label}</span>
      <AvatarGroup size={size} layout="stack">
        <Avatar size={size}>
          <AvatarImage src="https://avatars.githubusercontent.com/u/108743931?s=200&v=4" alt="User" />
        </Avatar>
        <Avatar size={size} color="neutral">
          <AvatarIcon name="person" />
        </Avatar>
        <Avatar size={size} color="orange">
          <AvatarText>PL</AvatarText>
        </Avatar>
        <Avatar size={size} color="red">
          <AvatarIcon name="person" />
        </Avatar>
        <Avatar size={size}>
          <AvatarIcon name="more-horizontal" />
        </Avatar>
      </AvatarGroup>
    </div>
  );
}

export default function AvatarsPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeLarge }}>
        <p style={sectionLabel}>Example</p>
        <p
          style={{
            fontSize: fontSizes.fontSize200,
            color: colors.neutral550,
            margin: 0,
            marginTop: `calc(-1 * ${spacings.sizeSmall})`,
            marginBottom: spacings.sizeLarge,
            lineHeight: 1.5,
          }}
        >
          Same order as Web Kit <strong>Avatar Stack</strong> (<code style={{ fontFamily: "monospace", fontSize: "0.95em" }}>69:3008</code>):
          Image (green <strong>Status</strong>) → Neutral Icon → Initials (Orange) → Icon (Red) → More.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeLarge }}>
          <AvatarStackRow size="md" label="Medium (32px)" />
          <AvatarStackRow size="lg" label="Large (36px)" />
          <AvatarStackRow size="2xl" label="XXLarge (56px)" />
        </div>
      </div>
    </PreviewFrame>
  );
}
