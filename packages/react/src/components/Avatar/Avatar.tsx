import { clsx } from "clsx";
import { Children, cloneElement, createContext, isValidElement, useContext, useState } from "react";
import type { HTMLAttributes, ImgHTMLAttributes, ReactElement, ReactNode } from "react";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { WebIcon, type WebIconProps } from "../../WebIcon";
import {
    AVATAR_INNER_MASK,
    avatarGroupCountTypo,
    avatarIconSlotSize,
    avatarSizeDim,
    avatarSpreadGap,
    avatarStackOverlapCssVar,
    avatarStatusDim,
    avatarStatusPosition,
    avatarTypoNeutral,
    defaultPersonIconColor,
    avatarNeutralForegroundColor,
    normalizeAvatarColor,
    resolveAvatarShellColorLayer,
    resolveAvatarShellStyle,
    type AvatarColor,
    type AvatarColorIcon,
    type AvatarColorImage,
    type AvatarColorInitials,
    type AvatarLayout,
    type AvatarSize,
} from "./avatarStyles";
import { AvatarStatusGraphic } from "./avatarStatusGraphics";

export type {
    AvatarColor,
    AvatarColorIcon,
    AvatarColorImage,
    AvatarColorInitials,
    AvatarLayout,
    AvatarSize,
} from "./avatarStyles";

/** Web Kit `Avatar/Status` `65:65` — `Online` \| `Away` \| `Unavailable` \| `Offline` */
export type AvatarPresenceStatus = "online" | "away" | "unavailable" | "offline";

export type AvatarProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
    src?: string | null;
    alt?: string;
    /** Deprecated: use AvatarImage/AvatarIcon/AvatarText slots instead. */
    layout?: AvatarLayout;
    size?: AvatarSize;
    showStatus?: boolean;
    /** `showStatus`일 때만 적용 — 기본 `online` */
    status?: AvatarPresenceStatus;
    innerClassName?: string;
    children?: ReactNode;
    color?: AvatarColor;
};

export type AvatarImageProps = ImgHTMLAttributes<HTMLImageElement>;
export type AvatarFallbackProps = HTMLAttributes<HTMLSpanElement>;
export type AvatarBadgeProps = HTMLAttributes<HTMLSpanElement> & {
    status?: AvatarPresenceStatus;
};
export type AvatarTextProps = HTMLAttributes<HTMLSpanElement>;
export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
    size?: AvatarSize;
    layout?: "stack" | "spread";
}
export type AvatarGroupCountProps = HTMLAttributes<HTMLSpanElement>;

const AvatarGroupContext = createContext<{ size: AvatarSize; layout: "stack" | "spread" } | null>(null);
const AvatarShellSizeContext = createContext<AvatarSize | null>(null);

export type AvatarIconProps = Omit<WebIconProps, "size"> & { size?: number };

export function AvatarIcon({ size: sizeProp, ...props }: AvatarIconProps) {
    const shell = useContext(AvatarShellSizeContext) ?? "medium";
    return <WebIcon size={sizeProp ?? avatarIconSlotSize[shell]} {...props} />;
}

type ParsedSlots = {
    image?: ReactElement<AvatarImageProps>;
    fallback?: ReactNode;
    badge?: ReactNode;
    icon?: ReactElement<AvatarIconProps>;
    text?: ReactElement<AvatarTextProps>;
    leading: ReactNode[];
};

function parseAvatarSlots(nodes: readonly ReactNode[]): ParsedSlots {
    const leading: ReactNode[] = [];
    let image: ParsedSlots["image"];
    let fallback: ReactNode;
    let badge: ReactNode;
    let icon: ParsedSlots["icon"];
    let text: ParsedSlots["text"];
    for (const c of nodes) {
        if (!isValidElement(c)) {
            leading.push(c);
            continue;
        }
        if (c.type === AvatarImage) image = c as ReactElement<AvatarImageProps>;
        else if (c.type === AvatarFallback) fallback = c;
        else if (c.type === AvatarBadge) badge = c;
        else if (c.type === AvatarIcon) icon = c as ReactElement<AvatarIconProps>;
        else if (c.type === AvatarText) text = c as ReactElement<AvatarTextProps>;
        else leading.push(c);
    }
    return { image, fallback, badge, icon, text, leading };
}

function initialsFromAlt(alt: string, layout: AvatarLayout | undefined, size: AvatarSize): string {
    const parts = alt.trim().split(/\s+/).filter(Boolean);
    const letters = parts.map((p) => p[0] ?? "").join("").toUpperCase();
    const oneLetterTiers: AvatarSize[] = ["xxxsmall", "xxsmall", "xsmall"];
    const max = layout === "initials" ? 2 : oneLetterTiers.includes(size) ? 1 : 2;
    return letters.slice(0, max);
}

function builtInFallback(initials: string, color: AvatarColor, layout: AvatarLayout): ReactNode {
    if (layout === "icon") return <AvatarIcon name="person" color={defaultPersonIconColor[color]} />;
    if (layout === "initials") return initials || null;
    if (initials) return initials;
    return <AvatarIcon name="person" color={defaultPersonIconColor[color]} />;
}

export function Avatar({
    src,
    alt = "",
    size = "medium",
    layout,
    color,
    showStatus = false,
    status = "online",
    className,
    innerClassName,
    children,
    ...props
}: AvatarProps) {
    const [imageError, setImageError] = useState(false);
    const { image, fallback, badge, icon, text, leading } = parseAvatarSlots(Children.toArray(children));
    const slotPreferredLayout: AvatarLayout = icon ? "icon" : text ? "initials" : "image";
    const initials = initialsFromAlt(alt, layout ?? slotPreferredLayout, size);
    const effectiveSrc = image?.props.src ?? src;
    const effectiveAlt = image?.props.alt ?? alt;
    const showingImage = Boolean(effectiveSrc && !imageError);
    const resolvedLayout: AvatarLayout = showingImage
        ? "image"
        : icon
          ? "icon"
          : text
            ? "initials"
            : layout ?? (initials.length > 0 ? "initials" : "icon");
    const effectiveColor = normalizeAvatarColor(resolvedLayout, color);
    const useNeutralShellTypo =
        effectiveColor === "neutral" &&
        resolvedLayout !== "icon" &&
        !showingImage &&
        (resolvedLayout === "image" || resolvedLayout === "initials") &&
        !fallback &&
        initials.length > 0;
    const statusSlot = badge ?? (showStatus ? <AvatarBadge status={status} /> : null);
    const hasStatus = showStatus || isValidElement(badge);

    return (
        <AvatarShellSizeContext.Provider value={size}>
            <div
                data-refineui="avatar"
                data-avatar-color={effectiveColor}
                data-avatar-layout={resolvedLayout}
                data-show-status={hasStatus ? "true" : undefined}
                className={clsx("relative shrink-0", avatarSizeDim[size], className)}
                {...props}
            >
                <div
                    className={clsx(
                        AVATAR_INNER_MASK,
                        resolveAvatarShellColorLayer(effectiveColor, size, resolvedLayout),
                        useNeutralShellTypo && avatarTypoNeutral[size],
                        innerClassName,
                    )}
                    style={{
                        ...resolveAvatarShellStyle(effectiveColor, resolvedLayout),
                        ...(useNeutralShellTypo ? { color: avatarNeutralForegroundColor } : {}),
                    }}
                >
                    {leading}
                    {showingImage ? (
                        <img
                            src={effectiveSrc!}
                            alt={effectiveAlt}
                            onError={() => setImageError(true)}
                            className={clsx("size-full object-cover", image?.props.className)}
                        />
                    ) : fallback ? (
                        fallback
                    ) : icon ? (
                        cloneElement(icon, {
                            color: icon.props.color ?? defaultPersonIconColor[effectiveColor as AvatarColorIcon],
                        })
                    ) : text ? (
                        cloneElement(text, {
                            children: text.props.children ?? initials,
                        })
                    ) : (
                        builtInFallback(initials, effectiveColor, resolvedLayout)
                    )}
                </div>
                {statusSlot}
            </div>
        </AvatarShellSizeContext.Provider>
    );
}

export function AvatarImage(_props: AvatarImageProps) {
    return null;
}

export function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
    return (
        <span
            className={clsx("inline-flex size-full items-center justify-center", className)}
            {...props}
        />
    );
}

export function AvatarText({ className, ...props }: AvatarTextProps) {
    return (
        <span className={clsx("inline-flex size-full items-center justify-center", className)} {...props} />
    );
}

export function AvatarBadge({ className, status = "online", ...props }: AvatarBadgeProps) {
    const shell = useContext(AvatarShellSizeContext) ?? "medium";
    return (
        <span
            className={clsx(
                "pointer-events-none absolute z-refineui-content inline-flex items-center justify-center overflow-hidden rounded-refineui-circle bg-transparent",
                avatarStatusPosition[shell],
                avatarStatusDim[shell],
                className,
            )}
            data-avatar-status={status}
            {...props}
        >
            <AvatarStatusGraphic status={status} />
        </span>
    );
}

export function AvatarGroup({
    size = "medium",
    layout = "stack",
    className,
    children,
    style,
    ...props
}: AvatarGroupProps) {
    const list = Children.toArray(children);
    return (
        <AvatarGroupContext.Provider value={{ size, layout }}>
            <div
                {...props}
                data-refineui="avatars"
                data-layout={layout}
                data-avatar-stack-size={size}
                className={clsx(
                    "flex items-center",
                    layout === "stack" ? "gap-0" : avatarSpreadGap[size],
                    className,
                )}
                style={{
                    ...(layout === "stack" ? { ["--avatar-stack-overlap" as string]: avatarStackOverlapCssVar[size] } : {}),
                    ...style,
                }}
            >
                {list.map((child, index) => {
                    const isCount = isValidElement(child) && child.type === AvatarGroupCount;
                    const z = layout === "stack" ? index : undefined;
                    if (isCount) {
                        return (
                            <div key={`count-${index}`} className="shrink-0" style={{ zIndex: z }}>
                                {child}
                            </div>
                        );
                    }
                    return (
                        <div key={`avatar-${index}`} className="relative shrink-0" style={{ zIndex: z }}>
                            {child}
                        </div>
                    );
                })}
            </div>
        </AvatarGroupContext.Provider>
    );
}

export function AvatarGroupCount({ className, ...props }: AvatarGroupCountProps) {
    const ctx = useContext(AvatarGroupContext);
    const size = ctx?.size ?? "medium";
    const groupCountBg = resolveColorTokenValue(componentColorTokens.avatar.groupCount.background);
    const groupCountBorder = resolveColorTokenValue(componentColorTokens.avatar.groupCount.border);
    const groupCountFg = resolveColorTokenValue(componentColorTokens.avatar.groupCount.foreground);
    return (
        <span
            className={clsx(
                "relative box-border inline-flex items-center justify-center rounded-refineui-circle border-refineui-thin font-medium",
                avatarSizeDim[size],
                avatarGroupCountTypo[size],
                className,
            )}
            style={{
                backgroundColor: groupCountBg,
                borderColor: groupCountBorder,
                color: groupCountFg,
            }}
            {...props}
        />
    );
}
