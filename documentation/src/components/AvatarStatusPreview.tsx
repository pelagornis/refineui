import { Fragment, type CSSProperties } from "react";
import { colors, fontSizes, fontWeights, spacings } from "@refineui/tokens";
import { Avatar, AvatarImage } from "@refineui/react";
import type { AvatarPresenceStatus, AvatarSize } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

const sectionLabel: CSSProperties = {
    fontSize: fontSizes.fontSize200,
    fontWeight: fontWeights.fontWeightMedium,
    color: colors.neutral600,
    marginBottom: spacings.sizeSmall,
};

const STATUS_ROWS: { label: string; sub: string; status: AvatarPresenceStatus }[] = [
    { label: "Online", sub: "Green dot", status: "online" },
    { label: "Away", sub: "Yellow crescent", status: "away" },
    { label: "Unavailable", sub: "Red dot + white bar", status: "unavailable" },
    { label: "Offline", sub: "Gray dot", status: "offline" },
];

const SIZES: AvatarSize[] = [
    "xxxsmall",
    "xxsmall",
    "xsmall",
    "small",
    "medium",
    "large",
    "xlarge",
    "xxlarge",
    "xxxlarge",
];

const heroCaption: CSSProperties = {
    fontSize: fontSizes.fontSize200,
    fontWeight: fontWeights.fontWeightMedium,
    color: colors.neutral600,
    marginTop: spacings.sizeXSmall,
    textAlign: "center",
};

export default function AvatarStatusPreview() {
    return (
        <PreviewFrame minHeight="min(18vh, 680px)">
            <div className="flex flex-col gap-refineui-size-large">
                <div>
                    <p style={sectionLabel}>Presence variants (Figma Avatar/Status · 65:65)</p>
                    <div className="flex flex-wrap justify-center gap-refineui-size-x-large gap-y-refineui-size-large">
                        {STATUS_ROWS.map(({ label, sub, status }) => (
                            <div
                                key={status}
                                className="flex flex-col items-center gap-refineui-size-x-small"
                            >
                                <Avatar
                                    size="xl"
                                    showStatus
                                    status={status}
                                >
                                    <AvatarImage
                                        src="https://avatars.githubusercontent.com/u/108743931?s=200&v=4"
                                        alt=""
                                    />
                                </Avatar>
                                <div style={heroCaption}>
                                    <div className="text-refineui-text-primary body-2 font-medium">{label}</div>
                                    <div className="caption-2">{sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PreviewFrame>
    );
}
