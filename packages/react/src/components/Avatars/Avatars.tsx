import type { HTMLAttributes } from "react";
import { colors, fontWeights, spacings, borderRadii, strokeWidths, sizes, typographys } from "@refineui/tokens";
import { Avatar } from "../Avatar";

export type AvatarsSize = "sm" | "md" | "lg";

/** Web Kit `Avater Stack`(`69:3008`) · `Avater Spread`(`69:3007`) — Figma 이름 그대로 */
export type AvatarsLayout = "stack" | "spread";

export interface AvatarItem {
    src?: string | null;
    alt: string;
}

export interface AvatarsProps extends HTMLAttributes<HTMLDivElement> {
    avatars: AvatarItem[];
    size?: AvatarsSize;
    max?: number;
    /** 기본 `stack`(겹침). `spread`는 아바타 사이 gap */
    layout?: AvatarsLayout;
}

const avatarDim: Record<AvatarsSize, string> = {
    sm: sizes.avatarSm,
    md: sizes.avatarMd,
    lg: sizes.avatarLg,
};

/** Figma Stack: `mr-[-n]` = 겹침량; `pr-[n]`과 동일 값 */
const stackOverlapPx: Record<AvatarsSize, number> = {
    sm: 6,
    md: 8,
    lg: 10,
};

/**
 * Figma Spread: Small·Medium 행은 `gap-[sizemedium]`, XXXLarge 행은 `gap-[sizexlarge]`.
 * sm/md → 10px, lg(56px 티어) → 20px.
 */
const spreadGap: Record<AvatarsSize, string> = {
    sm: spacings.sizeMedium,
    md: spacings.sizeMedium,
    lg: spacings.sizeXLarge,
};

const overflowLabelTypography: Record<AvatarsSize, (typeof typographys)["caption1"]> = {
    sm: typographys.caption2,
    md: typographys.caption1,
    lg: typographys.body2,
};

export function Avatars({ avatars, size = "md", max = 4, layout = "stack", style, ...props }: AvatarsProps) {
    const dimStr = avatarDim[size];
    const display = avatars.slice(0, max);
    const remainder = avatars.length > max ? avatars.length - max : 0;
    const overlap = stackOverlapPx[size];
    const isStack = layout === "stack";

    return (
        <div
            data-refineui="avatars"
            data-layout={layout}
            style={{
                display: "flex",
                alignItems: "center",
                gap: isStack ? 0 : spreadGap[size],
                paddingRight: isStack ? overlap : undefined,
                ...style,
            }}
            {...props}
        >
            {display.map((a, i) => (
                <div
                    key={i}
                    style={{
                        position: "relative",
                        marginLeft: isStack && i > 0 ? -overlap : 0,
                        border: `${strokeWidths.strokeWidthThick} solid ${colors.neutralWhite}`,
                        borderRadius: borderRadii.roundedCircle,
                        overflow: "hidden",
                        zIndex: isStack ? i : undefined,
                    }}
                >
                    <Avatar src={a.src} alt={a.alt} size={size} />
                </div>
            ))}
            {remainder > 0 && (
                <div
                    style={{
                        position: "relative",
                        marginLeft: isStack ? -overlap : 0,
                        width: dimStr,
                        height: dimStr,
                        borderRadius: borderRadii.roundedCircle,
                        backgroundColor: colors.neutralWhite,
                        border: `${strokeWidths.strokeWidthThin} solid ${colors.neutral300}`,
                        boxSizing: "border-box",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        ...overflowLabelTypography[size],
                        fontWeight: fontWeights.fontWeightMedium,
                        color: colors.neutral600,
                        zIndex: isStack ? display.length : undefined,
                    }}
                >
                    +{remainder}
                </div>
            )}
        </div>
    );
}
