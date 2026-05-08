import type { NormalizedAvatarSize } from "../Avatar/avatarStyles";
import { avatarGroupCountTypo, avatarSizeDim, avatarSpreadGap } from "../Avatar/avatarStyles";

export const avatarsStyles = {
    root: "flex items-center",
    avatarWrap: "relative shrink-0",
    overflowCount:
        "relative box-border flex shrink-0 items-center justify-center rounded-refineui-circle border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-primary font-medium text-refineui-alias-foreground-secondary",
} as const;

export const avatarsSpreadGapBySize: Record<NormalizedAvatarSize, string> = avatarSpreadGap;
export const avatarsCountSizeBySize: Record<NormalizedAvatarSize, string> = avatarSizeDim;
export const avatarsCountTypoBySize: Record<NormalizedAvatarSize, string> = avatarGroupCountTypo;

