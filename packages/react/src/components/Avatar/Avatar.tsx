import { clsx } from "clsx";
import { Children, createContext, isValidElement, useContext, useState } from "react";
import type { HTMLAttributes, ImgHTMLAttributes, ReactElement, ReactNode } from "react";
import { WebIcon, type WebIconProps } from "../../WebIcon";
import {
    AVATAR_INNER_MASK,
    avatarGroupCountTypo,
    avatarIconSlotSize,
    avatarOverflowIconSize,
    avatarSizeDim,
    avatarSpreadGap,
    avatarStackOverlapCssVar,
    avatarStatusDim,
    avatarStatusPosition,
    avatarTypoNeutral,
    defaultPersonIconColor,
    normalizeAvatarColor,
    resolveAvatarShellColorLayer,
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
    size?: AvatarSize;
    showStatus?: boolean;
    /** `showStatus`일 때만 적용 — 기본 `online` */
    status?: AvatarPresenceStatus;
    innerClassName?: string;
    children?: ReactNode;
} & (
    | { layout: "image"; color?: AvatarColorImage }
    | { layout: "icon"; color?: AvatarColorIcon }
    | { layout: "initials"; color?: AvatarColorInitials }
    | { layout?: undefined; color?: AvatarColorImage }
);

export type AvatarImageProps = ImgHTMLAttributes<HTMLImageElement>;
export type AvatarFallbackProps = HTMLAttributes<HTMLSpanElement>;
export type AvatarBadgeProps = HTMLAttributes<HTMLSpanElement> & {
    status?: AvatarPresenceStatus;
};
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
    leading: ReactNode[];
};

function parseAvatarSlots(nodes: readonly ReactNode[]): ParsedSlots {
    const leading: ReactNode[] = [];
    let image: ParsedSlots["image"];
    let fallback: ReactNode;
    let badge: ReactNode;
    for (const c of nodes) {
        if (!isValidElement(c)) {
            leading.push(c);
            continue;
        }
        if (c.type === AvatarImage) image = c as ReactElement<AvatarImageProps>;
        else if (c.type === AvatarFallback) fallback = c;
        else if (c.type === AvatarBadge) badge = c;
        else leading.push(c);
    }
    return { image, fallback, badge, leading };
}

function initialsFromAlt(alt: string, layout: AvatarLayout | undefined, size: AvatarSize): string {
    const parts = alt.trim().split(/\s+/).filter(Boolean);
    const letters = parts.map((p) => p[0] ?? "").join("").toUpperCase();
    const oneLetterTiers: AvatarSize[] = ["xxxsmall", "xxsmall", "xsmall"];
    const max = layout === "initials" ? 2 : oneLetterTiers.includes(size) ? 1 : 2;
    return letters.slice(0, max);
}

function builtInFallback(initials: string, color: AvatarColor, layout: AvatarLayout | undefined): ReactNode {
    if (layout === "icon") return <AvatarIcon name="person" color={defaultPersonIconColor[color]} />;
    if (layout === "initials") return initials || null;
    if (initials) return initials;
    return <AvatarIcon name="person" color={defaultPersonIconColor[color]} />;
}

export function Avatar({
    src,
    alt = "",
    size = "medium",
    color = "neutral",
    layout,
    showStatus = false,
    status = "online",
    className,
    innerClassName,
    children,
    ...props
}: AvatarProps) {
    const [imageError, setImageError] = useState(false);
    const { image, fallback, badge, leading } = parseAvatarSlots(Children.toArray(children));
    const initials = initialsFromAlt(alt, layout, size);
    const effectiveSrc = image?.props.src ?? src;
    const effectiveAlt = image?.props.alt ?? alt;
    const showingImage = Boolean(effectiveSrc && !imageError);
    const effectiveColor = normalizeAvatarColor(layout, color);
    const useNeutralShellTypo =
        effectiveColor === "neutral" &&
        layout !== "icon" &&
        !showingImage &&
        (layout === "image" || layout === undefined) &&
        !fallback &&
        initials.length > 0;
    const statusSlot = badge ?? (showStatus ? <AvatarBadge status={status} /> : null);
    const hasStatus = showStatus || isValidElement(badge);

    return (
        <AvatarShellSizeContext.Provider value={size}>
            <div
                data-refineui="avatar"
                data-avatar-color={effectiveColor}
                data-avatar-layout={layout}
                data-show-status={hasStatus ? "true" : undefined}
                className={clsx("relative shrink-0", avatarSizeDim[size], className)}
                {...props}
            >
                <div
                    className={clsx(
                        AVATAR_INNER_MASK,
                        resolveAvatarShellColorLayer(effectiveColor, size, layout),
                        useNeutralShellTypo && avatarTypoNeutral[size],
                        innerClassName,
                    )}
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
                    ) : (
                        builtInFallback(initials, effectiveColor, layout)
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

export type AvatarOverflowProps = Omit<
    AvatarProps,
    "children" | "src" | "alt" | "layout" | "color" | "showStatus" | "status" | "innerClassName"
> & { innerClassName?: string };

export function AvatarOverflow({ size = "medium", className, innerClassName, ...props }: AvatarOverflowProps) {
    return (
        <Avatar
            size={size}
            color="neutral"
            innerClassName={clsx(
                "box-border border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-primary text-refineui-alias-foreground-secondary",
                innerClassName,
            )}
            className={className}
            {...props}
        >
            <AvatarFallback>
                <AvatarIcon
                    name="more-horizontal"
                    color="var(--refineui-color-alias-foreground-secondary)"
                    size={avatarOverflowIconSize[size]}
                />
            </AvatarFallback>
        </Avatar>
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
    return (
        <span
            className={clsx(
                "relative box-border inline-flex items-center justify-center rounded-refineui-circle border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-primary font-medium text-refineui-alias-foreground-secondary",
                avatarSizeDim[size],
                avatarGroupCountTypo[size],
                className,
            )}
            {...props}
        />
    );
}
