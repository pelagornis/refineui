import { clsx } from "clsx";
import { iconSizes } from "@refineui/tokens";

/**
 * 단일 **`Avatar`** 토큰·맵 — Web Kit `Avatar` MCP `size`(XXXSmall→XXXLarge) 9단계.
 *
 * **컴포넌트 세트**는 Figma **「Avatars」** 페이지 `Avatar`(`56:254`) 기준 — `Layout`×`Color`×`Size` variant.
 * **그룹**: **`Avatar Stack` `69:3008`**, **`Avatar Spread` `69:3007`**는 각각 겹침·간격 **그룹** 컴포넌트이며, 단일 `Avatar`의 전체 색 목록과 혼동하지 않는다.
 *
 * **Stack `69:3008`**: 지름·겹침은 **`foundationSizes`**; Status XXXLarge만 `componentSizes.avatarStatusXxxlarge`.
 * **Spread `69:3007`**: 행 간격은 `spacings` (`avatarSpreadGap`).
 */
export type AvatarSize =
    | "xxxsmall"
    | "xxsmall"
    | "xsmall"
    | "small"
    | "medium"
    | "large"
    | "xlarge"
    | "xxlarge"
    | "xxxlarge";

/** MCP / Figma `Avatar` `layout` */
export type AvatarLayout = "image" | "icon" | "initials";

/**
 * Figma `Avatar` COMPONENT_SET `56:254` variant `Color` (플러그인 API로 열거):
 * - **Image** → `Neutral`만
 * - **Icon** / **Initials** → 동일 10색 (`Blue` … `Yellow`)
 */
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

/** layout·Figma에 맞게 색 정규화 — layout 생략 시 Image+Neutral */
export function normalizeAvatarColor(layout: AvatarLayout | undefined, color: AvatarColor | undefined): AvatarColor {
    if (layout === "image" || layout === undefined) return "neutral";
    const c = color ?? "neutral";
    if (layout === "icon" || layout === "initials") {
        return isAvatarColorIcon(c) ? c : "neutral";
    }
    return "neutral";
}

/** Figma `Global/Size/{n}` → Tailwind `size-refineui-foundation-size-*` */
export const avatarSizeDim: Record<AvatarSize, string> = {
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

/** Neutral 이니셜 타이포 — MCP `Avatar` 행 */
export const avatarTypoNeutral: Record<AvatarSize, string> = {
    xxxsmall: "refineui-typo-body-4",
    xxsmall: "refineui-typo-body-2",
    xsmall: "refineui-typo-body-1",
    small: "refineui-typo-body-1",
    medium: "refineui-typo-body-1",
    large: "refineui-typo-body-1",
    xlarge: "refineui-typo-sub-title-1",
    xxlarge: "refineui-typo-title-3",
    xxxlarge: "refineui-typo-title-2",
};

/** Person 슬롯 — Web Kit `Avatar` + `iconSizes`(`packages/tokens` dist) */
export const avatarIconSlotSize: Record<AvatarSize, number> = {
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
    "absolute inset-0 flex min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-refineui-circle bg-refineui-neutral-300";

function initialsAccentTypo(size: AvatarSize): string {
    return clsx(
        size === "xxxlarge" && "refineui-typo-title-2",
        size === "xxlarge" && "refineui-typo-title-3",
        size === "xlarge" && "refineui-typo-sub-title-1",
        !["xxxlarge", "xxlarge", "xlarge"].includes(size) && "refineui-typo-body-1",
    );
}

/** Figma `Avatar` 룩 — Icon 행은 연한 배경 + 글리프는 `defaultPersonIconColor`, Initials 행은 배경·글자 톤 맞춤 */
export function resolveAvatarShellColorLayer(
    color: AvatarColor,
    size: AvatarSize,
    layout: AvatarLayout | undefined,
): string {
    if (color === "neutral") {
        return "text-refineui-alias-foreground-secondary";
    }
    if (layout === "initials") {
        switch (color) {
            case "blue":
                return clsx("bg-refineui-blue-100 text-refineui-blue-1000", initialsAccentTypo(size));
            case "green":
                return clsx("bg-refineui-green-100 text-refineui-green-1000", initialsAccentTypo(size));
            case "lime":
                return clsx("bg-refineui-lime-100 text-refineui-lime-1000", initialsAccentTypo(size));
            case "magenta":
                return clsx("bg-refineui-magenta-100 text-refineui-magenta-1000", initialsAccentTypo(size));
            case "orange":
                return clsx("bg-refineui-orange-100 text-refineui-orange-1000", initialsAccentTypo(size));
            case "purple":
                return clsx("bg-refineui-purple-100 text-refineui-purple-1000", initialsAccentTypo(size));
            case "red":
                return clsx("bg-refineui-red-100 text-refineui-red-1000", initialsAccentTypo(size));
            case "teal":
                return clsx("bg-refineui-teal-100 text-refineui-teal-1000", initialsAccentTypo(size));
            case "yellow":
                return clsx("bg-refineui-yellow-100 text-refineui-yellow-1000", initialsAccentTypo(size));
            default:
                return "text-refineui-alias-foreground-secondary";
        }
    }
    switch (color) {
        case "blue":
            return "bg-refineui-blue-100 text-refineui-primary-black";
        case "green":
            return "bg-refineui-green-100 text-refineui-primary-black";
        case "lime":
            return "bg-refineui-lime-100 text-refineui-primary-black";
        case "magenta":
            return "bg-refineui-magenta-100 text-refineui-primary-black";
        case "orange":
            return "bg-refineui-orange-100 text-refineui-primary-black";
        case "purple":
            return "bg-refineui-purple-100 text-refineui-primary-black";
        case "red":
            return "bg-refineui-red-100 text-refineui-primary-black";
        case "teal":
            return "bg-refineui-teal-100 text-refineui-primary-black";
        case "yellow":
            return "bg-refineui-yellow-100 text-refineui-primary-black";
        default:
            return "text-refineui-alias-foreground-secondary";
    }
}

export const defaultPersonIconColor: Record<AvatarColorIcon, string> = {
    neutral: "var(--refineui-color-alias-foreground-secondary)",
    blue: "var(--refineui-color-blue-1000)",
    green: "var(--refineui-color-green-1000)",
    lime: "var(--refineui-color-lime-1000)",
    magenta: "var(--refineui-color-magenta-1000)",
    orange: "var(--refineui-color-orange-1000)",
    purple: "var(--refineui-color-purple-1000)",
    red: "var(--refineui-color-red-1000)",
    teal: "var(--refineui-color-teal-1000)",
    yellow: "var(--refineui-color-yellow-1000)",
};

/** `AvatarOverflow` more-horizontal */
export const avatarOverflowIconSize: Record<AvatarSize, number> = {
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
export const avatarSpreadGap: Record<AvatarSize, string> = {
    xxxsmall: "gap-refineui-size-x-small",
    xxsmall: "gap-refineui-size-x-small",
    xsmall: "gap-refineui-size-small",
    small: "gap-refineui-size-medium",
    medium: "gap-refineui-size-medium",
    large: "gap-refineui-size-large",
    xlarge: "gap-refineui-size-large",
    xxlarge: "gap-refineui-size-x-large",
    xxxlarge: "gap-refineui-size-x-large",
};

export const avatarGroupCountTypo: Record<AvatarSize, string> = {
    xxxsmall: "refineui-typo-caption-3",
    xxsmall: "refineui-typo-caption-3",
    xsmall: "refineui-typo-caption-2",
    small: "refineui-typo-caption-2",
    medium: "refineui-typo-caption-1",
    large: "refineui-typo-caption-1",
    xlarge: "refineui-typo-body-2",
    xxlarge: "refineui-typo-body-2",
    xxxlarge: "refineui-typo-body-2",
};

/**
 * `Avatar/Status` 오버레이 위치 — 아바타 **우하단**에 붙이되, 지름·아바타 크기에 맞춰
 * `left`/`top`으로 두었을 때와 동일한 픽셀 기하(`bottom` = D − top − d, `right` = D − left − d).
 */
export const avatarStatusPosition: Record<AvatarSize, string> = {
    xxxsmall: "bottom-0 right-0",
    xxsmall: "bottom-0 right-0",
    xsmall: "bottom-px right-px",
    small: "bottom-px right-px",
    medium: "bottom-px right-px",
    large: "bottom-px right-px",
    xlarge: "bottom-px right-px",
    xxlarge: "bottom-0 right-0",
    xxxlarge: "bottom-[-2px] right-[-2px]",
};

/** `Avatar/Status` 지름 — MCP `size-[*px]` / Foundation·`componentSizes`와 대응 */
export const avatarStatusDim: Record<AvatarSize, string> = {
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

/** Stack 겹침 — `refineui.css`의 `--avatar-stack-overlap` */
export const avatarStackOverlapCssVar: Record<AvatarSize, string> = {
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
