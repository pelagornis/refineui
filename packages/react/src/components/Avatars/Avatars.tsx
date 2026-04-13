import { clsx } from "clsx";
import type { HTMLAttributes } from "react";
import { Avatar } from "../Avatar";
import {
    avatarGroupCountTypo,
    avatarSizeDim,
    avatarSpreadGap,
    avatarStackOverlapCssVar,
    type AvatarSize,
} from "../Avatar/avatarStyles";

export type AvatarsSize = AvatarSize;

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

export function Avatars({
    avatars,
    size = "medium",
    max = 4,
    layout = "stack",
    className,
    style,
    ...props
}: AvatarsProps) {
    const display = avatars.slice(0, max);
    const remainder = avatars.length > max ? avatars.length - max : 0;
    const isStack = layout === "stack";

    return (
        <div
            {...props}
            data-refineui="avatars"
            data-layout={layout}
            data-avatar-stack-size={size}
            className={clsx("flex items-center", isStack ? "gap-0" : avatarSpreadGap[size], className)}
            style={{
                ...(isStack ? { ["--avatar-stack-overlap" as string]: avatarStackOverlapCssVar[size] } : {}),
                ...style,
            }}
        >
            {display.map((a, i) => (
                <div key={i} className="relative shrink-0" style={isStack ? { zIndex: i } : undefined}>
                    <Avatar src={a.src} alt={a.alt} size={size} />
                </div>
            ))}
            {remainder > 0 && (
                <div
                    className={clsx(
                        "relative box-border flex shrink-0 items-center justify-center rounded-refineui-circle border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-primary font-medium text-refineui-alias-foreground-secondary",
                        avatarSizeDim[size],
                        avatarGroupCountTypo[size],
                    )}
                    style={isStack ? { zIndex: display.length } : undefined}
                >
                    +{remainder}
                </div>
            )}
        </div>
    );
}
