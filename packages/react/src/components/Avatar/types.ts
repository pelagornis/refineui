import type { HTMLAttributes, ImgHTMLAttributes, ReactNode } from "react";
import type { WebIconProps } from "../../WebIcon";
import type {
    AvatarColor,
    AvatarColorIcon,
    AvatarColorImage,
    AvatarColorInitials,
    AvatarLayout,
    AvatarSize,
} from "./avatarStyles";

/** Web Kit `Avatar/Status` `65:65` — `Online` | `Away` | `Unavailable` | `Offline` */
export type AvatarPresenceStatus = "online" | "away" | "unavailable" | "offline";

export type AvatarProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
    src?: string | null;
    alt?: string;
    /** 슬롯 지정이 없으면 children 형태로 자동 레이아웃을 결정합니다. */
    layout?: AvatarLayout;
    size?: AvatarSize;
    showStatus?: boolean;
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
export type AvatarIconProps = Omit<WebIconProps, "size"> & { size?: number };

export type {
    AvatarColor,
    AvatarColorIcon,
    AvatarColorImage,
    AvatarColorInitials,
    AvatarLayout,
    AvatarSize,
};

