import type { SelectProps } from "./types";

export const selectStyles = {
    base: "box-border border-refineui-thin outline-none transition-[border-color,box-shadow,background-color] duration-[var(--refineui-motion-duration-fast)]",
    disabledCursor: "cursor-not-allowed",
    enabledCursor: "cursor-pointer",
} as const;

export const selectSizeClass: Record<NonNullable<SelectProps["size"]>, string> = {
    sm: "min-h-refineui-control-height-sm rounded-refineui-medium px-refineui-size-medium py-refineui-size-small refineui-typo-caption-1",
    md: "min-h-refineui-control-height-md rounded-refineui-large px-refineui-size-large py-refineui-size-medium refineui-typo-body-2",
    lg: "min-h-refineui-control-height-lg rounded-refineui-xlarge px-refineui-size-large py-refineui-size-large refineui-typo-body-1",
};

