import type { HTMLAttributes } from "react";
import type { AvatarSize } from "../Avatar/avatarStyles";

export type AvatarsSize = AvatarSize;
export type AvatarsLayout = "stack" | "spread";

export interface AvatarItem {
    src?: string | null;
    alt: string;
}

export interface AvatarsProps extends HTMLAttributes<HTMLDivElement> {
    avatars: AvatarItem[];
    size?: AvatarsSize;
    max?: number;
    layout?: AvatarsLayout;
}

