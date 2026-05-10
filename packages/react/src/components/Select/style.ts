import type { SelectSize } from "./types";

// Figma MCP — Web Kit `CxoaTfftpyh8ETDBamkkEK`:
// Trigger `1116:1429`, Menu `1117:1177`, Section `1144:2756`.
// Select / Menu / Item COMPONENT_SET `1144:2411` — per-variant State nodes:
// Default `1144:2410`, Hover `1144:2417`, Pressed `1144:2429`, Selected `1144:2435`, Disabled `1144:2423`.
// `get_design_context` takes one node; call each variant id above or `get_metadata` on parent `1144:2411` for the full set.
export const selectStyles = {
    root: "relative inline-block",
    trigger:
        "box-border inline-flex items-center justify-between gap-refineui-size-xsmall overflow-hidden rounded-refineui-large border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-primary px-refineui-size-medium py-refineui-size-small text-refineui-alias-foreground-primary outline-none focus-visible:border-refineui-alias-border-strong",
    triggerInner: "min-w-0 flex-1 text-left",
    triggerOpen: "",
    triggerDisabled:
        "cursor-not-allowed border-refineui-alias-border-disabled bg-refineui-alias-background-surface-disabled text-refineui-alias-foreground-disabled",
    value: "min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left",
    iconWrap: "inline-flex size-[16px] shrink-0 items-center justify-center",
    positioner: "z-refineui-popup flex flex-col overflow-hidden",
    contentShell:
        "box-border flex w-full flex-col overflow-hidden rounded-refineui-large border-refineui-hairline border-refineui-alias-border-default bg-refineui-alias-background-primary p-refineui-size-xsmall shadow-refineui-2light outline-none min-h-0",
    contentPopper: "h-auto max-h-[var(--refineui-select-content-available-height,100dvh)]",
    contentItemAligned: "max-h-full",
    viewportPopper:
        "relative flex max-h-full min-h-0 min-w-full w-full flex-col overflow-x-hidden overflow-y-auto",
    viewportItemAligned:
        "relative flex min-h-0 min-w-full w-full max-h-full flex-1 flex-col overflow-x-hidden overflow-y-auto",
    scrollAreaRootPopper: "relative flex max-h-full min-h-0 flex-col",
    scrollAreaRootItemAligned: "relative flex h-full min-h-0 flex-1 flex-col",

    group: "flex flex-col",
    label: "refineui-typo-caption-1 px-refineui-size-small py-refineui-size-medium text-refineui-alias-foreground-primary",
    separator: "my-refineui-size-xsmall h-px bg-refineui-alias-border-default",

    /** Background/state colors: `refineui.css` `[data-refineui="select-item"]` + `[data-refineui="select-menu"]` (Figma `1144:2411`) */
    item:
        "refineui-typo-body-2 relative mx-refineui-size-xsmall flex cursor-pointer items-center gap-refineui-size-medium rounded-refineui-xlarge px-refineui-size-medium py-refineui-size-small text-refineui-alias-foreground-primary outline-none transition-colors data-[disabled]:cursor-not-allowed data-[disabled]:text-refineui-alias-foreground-disabled",
    /** Backgrounds use CSS alias tokens; hover via `select-menu` focus / `:hover` rules */
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

