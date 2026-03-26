import type { HTMLAttributes } from "react";
import { colors, borderRadii, typographys, fontSizes, sizes, iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
    src?: string | null;
    alt?: string;
    size?: AvatarSize;
}

const avatarDim: Record<AvatarSize, string> = {
    sm: sizes.avatarSm,
    md: sizes.avatarMd,
    lg: sizes.avatarLg,
};

const avatarDimPx = (s: AvatarSize) => Number.parseInt(avatarDim[s], 10);

export function Avatar({ src, alt = "", size = "md", style, ...props }: AvatarProps) {
    const dim = avatarDimPx(size);
    const parts = alt.trim().split(/\s+/).filter(Boolean);
    const letters = parts.map((s) => s[0]).join("").toUpperCase();
    /** Web Kit Avater Initials: 작은 사이즈는 1글자, 그 이상은 2글자(MCP 그리드) */
    const initialsMax = size === "sm" ? 1 : 2;
    const initials = letters.slice(0, initialsMax);

    return (
        <div
            data-refineui="avatar"
            style={{
                width: avatarDim[size],
                height: avatarDim[size],
                borderRadius: borderRadii.roundedCircle,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.neutral300,
                color: colors.primaryBlack,
                ...typographys.caption1,
                fontSize: size === "sm" ? fontSizes.fontSize200 : size === "md" ? fontSizes.fontSize300 : fontSizes.fontSize500,
                flexShrink: 0,
                ...style,
            }}
            {...props}
        >
            {src ? (
                <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : initials ? (
                initials
            ) : (
                <WebIcon name="person" size={Math.max(iconSizes.md, Math.round(dim * 0.5))} color={colors.primaryBlack} />
            )}
        </div>
    );
}
