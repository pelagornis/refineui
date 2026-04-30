import type { SelectSize } from "./types";

// Figma MCP: Select trigger (1116:1429), Select / Menu (1117:1177),
// Select / Menu / Item (1144:2410), Select / Menu / Section (1144:2756)
export const selectStyles = {
    root: "relative inline-block",
    trigger:
        "box-border inline-flex items-center justify-between gap-refineui-size-xsmall overflow-hidden rounded-refineui-large border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-primary px-refineui-size-medium py-refineui-size-small text-refineui-alias-foreground-primary outline-none focus-visible:border-refineui-alias-border-strong",
    triggerInner: "min-w-0 flex-1 text-left",
    // Figma Focus (`1117:876`): open이 아니라 focus 상태에서만 border 변경
    triggerOpen: "",
    triggerDisabled:
        "cursor-not-allowed border-refineui-alias-border-disabled bg-refineui-alias-background-surface-disabled text-refineui-alias-foreground-disabled",
    value: "min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left",
    iconWrap: "inline-flex size-[16px] shrink-0 items-center justify-center",

    content:
        "z-refineui-popup overflow-hidden rounded-refineui-large border-refineui-hairline border-refineui-alias-border-default bg-refineui-alias-background-primary p-refineui-size-xsmall shadow-refineui-2light",
    viewport:
        "flex max-h-[var(--refineui-select-content-available-height)] min-h-0 w-full flex-col overflow-x-hidden overflow-y-auto pr-refineui-size-xsmall [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
    scrollAreaRoot: "relative",
    scrollAreaScrollbar: "absolute bottom-0 right-0 top-0 w-[6px]",
    scrollAreaThumb: "w-full rounded-refineui-large bg-refineui-alias-background-surface-hover transition-transform",

    group: "flex flex-col",
    label: "refineui-typo-caption-1 px-refineui-size-small py-refineui-size-medium text-refineui-alias-foreground-primary",
    separator: "my-refineui-size-xsmall h-px bg-refineui-alias-border-default",

    item:
        "refineui-typo-body-2 relative mx-refineui-size-xsmall flex cursor-pointer items-center gap-refineui-size-medium rounded-refineui-xlarge px-refineui-size-medium py-refineui-size-small text-refineui-alias-foreground-primary outline-none transition-colors",
    itemActive: "bg-refineui-alias-background-surface-hover",
    itemDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
    itemIndicator: "inline-flex size-[16px] shrink-0 items-center justify-center",
    itemText: "min-w-0 flex-1 truncate",
} as const;

export const selectSizeClass: Record<SelectSize, string> = {
    sm: "refineui-typo-caption-1",
    md: "refineui-typo-body-2",
    lg: "refineui-typo-body-1",
};

