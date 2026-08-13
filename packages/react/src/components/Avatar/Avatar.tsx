import { clsx } from "clsx";
import { Children, cloneElement, createContext, isValidElement, useContext, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { WebIcon } from "../../WebIcon";
import {
    AVATAR_INNER_MASK,
    avatarGroupCountTypo,
    avatarIconSlotSize,
    avatarSizeDim,
    avatarSizeVar,
    avatarSpreadGap,
    avatarStackOverlapCssVar,
    avatarStatusDim,
    avatarStatusPosition,
    avatarStatusSizeVar,
    avatarTypoNeutral,
    defaultPersonIconColor,
    avatarNeutralForegroundColor,
    normalizeAvatarColor,
    normalizeAvatarSize,
    resolveAvatarShellColorLayer,
    resolveAvatarShellStyle,
    type AvatarColor,
    type AvatarColorIcon,
    type AvatarColorImage,
    type AvatarColorInitials,
    type AvatarLayout,
    type AvatarSize,
    type NormalizedAvatarSize,
} from "./avatarStyles";
import { AvatarStatusGraphic } from "./avatarStatusGraphics";
import { avatarStyles } from "./style";
import type {
    AvatarBadgeProps,
    AvatarFallbackProps,
    AvatarGroupCountProps,
    AvatarGroupProps,
    AvatarIconProps,
    AvatarImageProps,
    AvatarPresenceStatus,
    AvatarProps,
    AvatarTextProps,
} from "./types";

const AvatarGroupContext = createContext<{ size: NormalizedAvatarSize; layout: "stack" | "spread" } | null>(null);
const AvatarShellSizeContext = createContext<NormalizedAvatarSize | null>(null);

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

function initialsFromAlt(alt: string, layout: AvatarLayout | undefined, size: NormalizedAvatarSize): string {
    const parts = alt.trim().split(/\s+/).filter(Boolean);
    const letters = parts.map((p) => p[0] ?? "").join("").toUpperCase();
    const oneLetterTiers: readonly NormalizedAvatarSize[] = ["xxxsmall", "xxsmall", "xsmall"];
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
    size = "md",
    layout,
    color,
    showStatus = false,
    status = "online",
    className,
    innerClassName,
    children,
    style,
    ...props
}: AvatarProps) {
    const [imageError, setImageError] = useState(false);
    const normalizedSize = normalizeAvatarSize(size);
    const box = avatarSizeVar[normalizedSize];
    const { image, fallback, badge, icon, text, leading } = parseAvatarSlots(Children.toArray(children));
    const slotPreferredLayout: AvatarLayout = icon ? "icon" : text ? "initials" : "image";
    const initials = initialsFromAlt(alt, layout ?? slotPreferredLayout, normalizedSize);
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
        <AvatarShellSizeContext.Provider value={normalizedSize}>
            <div
                data-refineui="avatar"
                data-avatar-color={effectiveColor}
                data-avatar-layout={resolvedLayout}
                data-show-status={hasStatus ? "true" : undefined}
                className={clsx(avatarStyles.root, avatarSizeDim[normalizedSize], className)}
                style={{ width: box, height: box, minWidth: box, minHeight: box, ...style }}
                {...props}
            >
                <div
                    className={clsx(
                        AVATAR_INNER_MASK,
                        resolveAvatarShellColorLayer(effectiveColor, normalizedSize, resolvedLayout),
                        useNeutralShellTypo && avatarTypoNeutral[normalizedSize],
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
                            className={clsx(avatarStyles.image, image?.props.className)}
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
            className={clsx(avatarStyles.fallback, className)}
            {...props}
        />
    );
}

export function AvatarText({ className, ...props }: AvatarTextProps) {
    return <span className={clsx(avatarStyles.text, className)} {...props} />;
}

export function AvatarBadge({ className, status = "online", style, ...props }: AvatarBadgeProps) {
    const shell = useContext(AvatarShellSizeContext) ?? "medium";
    const box = avatarStatusSizeVar[shell];
    return (
        <span
            className={clsx(
                avatarStyles.badge,
                avatarStatusPosition[shell],
                avatarStatusDim[shell],
                className,
            )}
            data-avatar-status={status}
            style={{ width: box, height: box, minWidth: box, minHeight: box, ...style }}
            {...props}
        >
            <AvatarStatusGraphic status={status} />
        </span>
    );
}

export function AvatarGroup({
    size = "md",
    layout = "stack",
    className,
    children,
    style,
    ...props
}: AvatarGroupProps) {
    const list = Children.toArray(children);
    const normalizedSize = normalizeAvatarSize(size);
    return (
        <AvatarGroupContext.Provider value={{ size: normalizedSize, layout }}>
            <div
                {...props}
                data-refineui="avatars"
                data-layout={layout}
                data-avatar-stack-size={normalizedSize}
                className={clsx(
                    avatarStyles.groupRoot,
                    layout === "stack" ? "gap-0" : avatarSpreadGap[normalizedSize],
                    className,
                )}
                style={{
                    ...(layout === "stack" ? { ["--avatar-stack-overlap" as string]: avatarStackOverlapCssVar[normalizedSize] } : {}),
                    ...style,
                }}
            >
                {list.map((child, index) => {
                    const isCount = isValidElement(child) && child.type === AvatarGroupCount;
                    const z = layout === "stack" ? index : undefined;
                    if (isCount) {
                        return (
                            <div key={`count-${index}`} className={avatarStyles.groupCountWrap} style={{ zIndex: z }}>
                                {child}
                            </div>
                        );
                    }
                    return (
                        <div key={`avatar-${index}`} className={avatarStyles.groupAvatarWrap} style={{ zIndex: z }}>
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
                avatarStyles.groupCount,
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
