import type { SelectProps } from "./types";

export const selectStyles = {
    root: "relative",
    trigger:
        "box-border inline-flex items-center justify-between gap-refineui-size-xsmall border-refineui-thin outline-none transition-[border-color,box-shadow,background-color] duration-[var(--refineui-motion-duration-fast)]",
    valueText: "min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left",
    content:
        "z-refineui-popup flex max-h-[min(60vh,20rem)] flex-col overflow-x-hidden overflow-y-auto rounded-refineui-xxlarge border-refineui-hairline border-refineui-alias-border-default bg-refineui-alias-background-primary p-refineui-size-xsmall shadow-refineui-2light outline-none",
    item:
        "refineui-typo-body-2 box-border flex w-full items-center gap-refineui-size-medium rounded-refineui-xlarge border-none bg-transparent px-refineui-size-medium py-refineui-size-small text-left text-refineui-alias-foreground-primary outline-none",
    itemIcon: "inline-flex shrink-0 items-center justify-center",
    itemLabel: "min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap",
    section:
        "refineui-typo-body-1 box-border flex items-center px-refineui-size-small py-refineui-size-medium font-medium text-refineui-alias-foreground-primary",
    separator: "my-refineui-size-xsmall h-px shrink-0 bg-refineui-alias-border-default",
    scrollHintWrap: "flex w-full items-center justify-center px-[53px] py-px",
    scrollHintIcon: "text-refineui-alias-foreground-placeholder",
} as const;

export const selectSizeClass: Record<NonNullable<SelectProps["size"]>, string> = {
    sm: "min-h-refineui-control-height-sm rounded-refineui-medium px-refineui-size-medium py-refineui-size-small refineui-typo-caption-1",
    md: "min-h-refineui-control-height-md rounded-refineui-large px-refineui-size-medium py-refineui-size-small refineui-typo-body-2",
    lg: "min-h-refineui-control-height-lg rounded-refineui-xlarge px-refineui-size-large py-refineui-size-large refineui-typo-body-1",
};
