import { iconSizes } from "@refineui/tokens";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { buildSemanticTextClassMap, componentTextClass } from "../../typography";
import type { CSSProperties } from "react";

export type NormalizedAvatarSize =
    | "xxxsmall"
    | "xxsmall"
    | "xsmall"
    | "small"
    | "medium"
    | "large"
    | "xlarge"
    | "xxlarge"
    | "xxxlarge";

export type AvatarSize =
    | "3xs"
    | "2xs"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl";

const avatarSizeAliasMap: Record<AvatarSize, NormalizedAvatarSize> = {
    "3xs": "xxxsmall",
    "2xs": "xxsmall",
    xs: "xsmall",
    sm: "small",
    md: "medium",
    lg: "large",
    xl: "xlarge",
    "2xl": "xxlarge",
    "3xl": "xxxlarge",
};

export function normalizeAvatarSize(size: AvatarSize): NormalizedAvatarSize {
    return avatarSizeAliasMap[size];
}

/** MCP / Figma `Avatar` `layout` */
export type AvatarLayout = "image" | "icon" | "initials";

export type AvatarColorImage = "neutral";

export type AvatarColorIcon =
    | "blue"
    | "green"
    | "lime"
    | "magenta"
    | "neutral"
    | "orange"
    | "purple"
    | "red"
    | "teal"
    | "yellow";

export type AvatarColorInitials = AvatarColorIcon;

export type AvatarColor = AvatarColorImage | AvatarColorIcon;

const ICON_INITIALS_PALETTE: readonly AvatarColorIcon[] = [
    "blue",
    "green",
    "lime",
    "magenta",
    "neutral",
    "orange",
    "purple",
    "red",
    "teal",
    "yellow",
];

function isAvatarColorIcon(c: string): c is AvatarColorIcon {
    return (ICON_INITIALS_PALETTE as readonly string[]).includes(c);
}

export function normalizeAvatarColor(layout: AvatarLayout | undefined, color: AvatarColor | undefined): AvatarColor {
    if (layout === "image" || layout === undefined) return "neutral";
    const c = color ?? "neutral";
    if (layout === "icon" || layout === "initials") {
        return isAvatarColorIcon(c) ? c : "neutral";
    }
    return "neutral";
}

/** Figma `Global/Size/{n}` → CSS var (Avatar shell — do not rely only on Tailwind `size-*`). */
export const avatarSizeVar: Record<NormalizedAvatarSize, string> = {
    xxxsmall: "var(--refineui-size-foundation-size-160)",
    xxsmall: "var(--refineui-size-foundation-size-200)",
    xsmall: "var(--refineui-size-foundation-size-240)",
    small: "var(--refineui-size-foundation-size-280)",
    medium: "var(--refineui-size-foundation-size-320)",
    large: "var(--refineui-size-foundation-size-360)",
    xlarge: "var(--refineui-size-foundation-size-480)",
    xxlarge: "var(--refineui-size-foundation-size-540)",
    xxxlarge: "var(--refineui-size-foundation-size-600)",
};

/** Tailwind mirror of `avatarSizeVar` (optional; var styles are authoritative). */
export const avatarSizeDim: Record<NormalizedAvatarSize, string> = {
    xxxsmall: "size-refineui-foundation-size-160",
    xxsmall: "size-refineui-foundation-size-200",
    xsmall: "size-refineui-foundation-size-240",
    small: "size-refineui-foundation-size-280",
    medium: "size-refineui-foundation-size-320",
    large: "size-refineui-foundation-size-360",
    xlarge: "size-refineui-foundation-size-480",
    xxlarge: "size-refineui-foundation-size-540",
    xxxlarge: "size-refineui-foundation-size-600",
};

export const avatarTypoNeutral = buildSemanticTextClassMap(
    componentTypographyTokens.avatar.initialsNeutral,
);

export const avatarIconSlotSize: Record<NormalizedAvatarSize, number> = {
    xxxsmall: iconSizes.xxsmall,
    xxsmall: iconSizes.xsmall,
    xsmall: iconSizes.small,
    small: iconSizes.small,
    medium: iconSizes.medium,
    large: iconSizes.medium,
    xlarge: iconSizes.large,
    xxlarge: iconSizes.xlarge,
    xxxlarge: iconSizes.xxlarge,
};

export const AVATAR_INNER_MASK =
    "relative flex size-full min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-refineui-circle";

function initialsAccentTypo(size: NormalizedAvatarSize): string {
    const tokens = componentTypographyTokens.avatar.initialsAccent;
    if (size === "xxxlarge") return componentTextClass(tokens.xxxlarge);
    if (size === "xxlarge") return componentTextClass(tokens.xxlarge);
    if (size === "xlarge") return componentTextClass(tokens.xlarge);
    return componentTextClass(tokens.default);
}

const avatarShellBackgroundColor: Record<AvatarColor, string> = {
    neutral: resolveColorTokenValue(componentColorTokens.avatar.shell.background.neutral),
    blue: resolveColorTokenValue(componentColorTokens.avatar.shell.background.blue),
    green: resolveColorTokenValue(componentColorTokens.avatar.shell.background.green),
    lime: resolveColorTokenValue(componentColorTokens.avatar.shell.background.lime),
    magenta: resolveColorTokenValue(componentColorTokens.avatar.shell.background.magenta),
    orange: resolveColorTokenValue(componentColorTokens.avatar.shell.background.orange),
    purple: resolveColorTokenValue(componentColorTokens.avatar.shell.background.purple),
    red: resolveColorTokenValue(componentColorTokens.avatar.shell.background.red),
    teal: resolveColorTokenValue(componentColorTokens.avatar.shell.background.teal),
    yellow: resolveColorTokenValue(componentColorTokens.avatar.shell.background.yellow),
};

const avatarShellInitialsForegroundColor: Record<AvatarColor, string> = {
    neutral: resolveColorTokenValue(componentColorTokens.avatar.icon.neutral),
    blue: resolveColorTokenValue(componentColorTokens.avatar.icon.blue),
    green: resolveColorTokenValue(componentColorTokens.avatar.icon.green),
    lime: resolveColorTokenValue(componentColorTokens.avatar.icon.lime),
    magenta: resolveColorTokenValue(componentColorTokens.avatar.icon.magenta),
    orange: resolveColorTokenValue(componentColorTokens.avatar.icon.orange),
    purple: resolveColorTokenValue(componentColorTokens.avatar.icon.purple),
    red: resolveColorTokenValue(componentColorTokens.avatar.icon.red),
    teal: resolveColorTokenValue(componentColorTokens.avatar.icon.teal),
    yellow: resolveColorTokenValue(componentColorTokens.avatar.icon.yellow),
};

export const avatarNeutralForegroundColor = resolveColorTokenValue(componentColorTokens.avatar.icon.neutral);

export function resolveAvatarShellStyle(
    color: AvatarColor,
    layout: AvatarLayout | undefined,
): CSSProperties {
    if (layout === "initials") {
        return {
            backgroundColor: avatarShellBackgroundColor[color],
            color: avatarShellInitialsForegroundColor[color],
        };
    }

    return {
        backgroundColor: avatarShellBackgroundColor[color],
    };
}

export function resolveAvatarShellColorLayer(
    _color: AvatarColor,
    size: NormalizedAvatarSize,
    layout: AvatarLayout | undefined,
): string {
    if (layout === "initials") {
        return initialsAccentTypo(size);
    }
    return "";
}

export const defaultPersonIconColor: Record<AvatarColorIcon, string> = {
    neutral: resolveColorTokenValue(componentColorTokens.avatar.icon.neutral),
    blue: resolveColorTokenValue(componentColorTokens.avatar.icon.blue),
    green: resolveColorTokenValue(componentColorTokens.avatar.icon.green),
    lime: resolveColorTokenValue(componentColorTokens.avatar.icon.lime),
    magenta: resolveColorTokenValue(componentColorTokens.avatar.icon.magenta),
    orange: resolveColorTokenValue(componentColorTokens.avatar.icon.orange),
    purple: resolveColorTokenValue(componentColorTokens.avatar.icon.purple),
    red: resolveColorTokenValue(componentColorTokens.avatar.icon.red),
    teal: resolveColorTokenValue(componentColorTokens.avatar.icon.teal),
    yellow: resolveColorTokenValue(componentColorTokens.avatar.icon.yellow),
};

/** `AvatarOverflow` more-horizontal */
export const avatarOverflowIconSize: Record<NormalizedAvatarSize, number> = {
    xxxsmall: iconSizes.xsmall,
    xxsmall: iconSizes.xsmall,
    xsmall: iconSizes.small,
    small: iconSizes.small,
    medium: iconSizes.medium,
    large: iconSizes.medium,
    xlarge: iconSizes.large,
    xxlarge: iconSizes.xlarge,
    xxxlarge: iconSizes.xxlarge,
};

/** `AvatarGroup` `layout="spread"` — Web Kit `Avatar` Spread `69:3007` */
export const avatarSpreadGap: Record<NormalizedAvatarSize, string> = {
    xxxsmall: "gap-refineui-size-xx-small",
    xxsmall: "gap-refineui-size-xx-small",
    xsmall: "gap-refineui-size-x-small",
    small: "gap-refineui-size-medium",
    medium: "gap-refineui-size-medium",
    large: "gap-refineui-size-large",
    xlarge: "gap-refineui-size-large",
    xxlarge: "gap-refineui-size-x-large",
    xxxlarge: "gap-refineui-size-x-large",
};

export const avatarGroupCountTypo = buildSemanticTextClassMap(
    componentTypographyTokens.avatar.groupCount,
);

export const avatarStatusPosition: Record<NormalizedAvatarSize, string> = {
    xxxsmall: "bottom-0 end-0",
    xxsmall: "bottom-0 end-0",
    xsmall: "bottom-px end-px",
    small: "bottom-px end-px",
    medium: "bottom-px end-px",
    large: "bottom-px end-px",
    xlarge: "bottom-px end-px",
    xxlarge: "bottom-0 end-0",
    xxxlarge: "bottom-[-2px] end-[-2px]",
};

export const avatarStatusDim: Record<NormalizedAvatarSize, string> = {
    xxxsmall: "size-refineui-foundation-size-40",
    xxsmall: "size-refineui-foundation-size-60",
    xsmall: "size-refineui-foundation-size-60",
    small: "size-refineui-foundation-size-60",
    medium: "size-refineui-foundation-size-80",
    large: "size-refineui-foundation-size-100",
    xlarge: "size-refineui-foundation-size-120",
    xxlarge: "size-refineui-foundation-size-120",
    xxxlarge: "size-refineui-avatar-status-xxxlarge",
};

/** Status dot CSS vars — prevents SVG default ~300px when Tailwind `size-*` is missing. */
export const avatarStatusSizeVar: Record<NormalizedAvatarSize, string> = {
    xxxsmall: "var(--refineui-size-foundation-size-40)",
    xxsmall: "var(--refineui-size-foundation-size-60)",
    xsmall: "var(--refineui-size-foundation-size-60)",
    small: "var(--refineui-size-foundation-size-60)",
    medium: "var(--refineui-size-foundation-size-80)",
    large: "var(--refineui-size-foundation-size-100)",
    xlarge: "var(--refineui-size-foundation-size-120)",
    xxlarge: "var(--refineui-size-foundation-size-120)",
    xxxlarge: "var(--refineui-size-avatar-status-xxxlarge)",
};

export const avatarStackOverlapCssVar: Record<NormalizedAvatarSize, string> = {
    xxxsmall: "var(--refineui-size-foundation-size-40)",
    xxsmall: "var(--refineui-size-foundation-size-40)",
    xsmall: "var(--refineui-size-foundation-size-40)",
    small: "var(--refineui-size-foundation-size-60)",
    medium: "var(--refineui-size-foundation-size-60)",
    large: "var(--refineui-size-foundation-size-80)",
    xlarge: "var(--refineui-size-foundation-size-100)",
    xxlarge: "var(--refineui-size-foundation-size-100)",
    xxxlarge: "var(--refineui-size-foundation-size-120)",
};
