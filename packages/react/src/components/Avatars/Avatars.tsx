import { clsx } from "clsx";
import { Avatar } from "../Avatar";
import {
    avatarStackOverlapCssVar,
    normalizeAvatarSize,
} from "../Avatar/avatarStyles";
import { avatarsCountSizeBySize, avatarsCountTypoBySize, avatarsSpreadGapBySize, avatarsStyles } from "./style";
import type { AvatarsProps } from "./types";

export function Avatars({
    avatars,
    size = "md",
    max = 4,
    layout = "stack",
    className,
    style,
    ...props
}: AvatarsProps) {
    const display = avatars.slice(0, max);
    const remainder = avatars.length > max ? avatars.length - max : 0;
    const isStack = layout === "stack";
    const normalizedSize = normalizeAvatarSize(size);

    return (
        <div
            {...props}
            data-refineui="avatars"
            data-layout={layout}
            data-avatar-stack-size={normalizedSize}
            className={clsx(avatarsStyles.root, isStack ? "gap-0" : avatarsSpreadGapBySize[normalizedSize], className)}
            style={{
                ...(isStack ? { ["--avatar-stack-overlap" as string]: avatarStackOverlapCssVar[normalizedSize] } : {}),
                ...style,
            }}
        >
            {display.map((a, i) => (
                <div key={i} className={avatarsStyles.avatarWrap} style={isStack ? { zIndex: i } : undefined}>
                    <Avatar src={a.src} alt={a.alt} size={size} />
                </div>
            ))}
            {remainder > 0 && (
                <div
                    className={clsx(
                        avatarsStyles.overflowCount,
                        avatarsCountSizeBySize[normalizedSize],
                        avatarsCountTypoBySize[normalizedSize],
                    )}
                    style={isStack ? { zIndex: display.length } : undefined}
                >
                    +{remainder}
                </div>
            )}
        </div>
    );
}
