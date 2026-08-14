import type { SelectSize } from "./types";
import { clsx } from "clsx";
import { formControlShellSizeClass } from "../../formControlSizes";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

// Figma MCP — Web Kit `CxoaTfftpyh8ETDBamkkEK`:
// Trigger `1116:1429`, Menu `1117:1177`, Section `1144:2756`.
export const selectStyles = {
    root: "relative inline-block",
    trigger:
        "box-border inline-flex items-center justify-between gap-refineui-size-x-small overflow-hidden rounded-refineui-large border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-primary px-refineui-size-medium py-refineui-size-small text-refineui-alias-foreground-primary outline-none",
    triggerInner: "min-w-0 flex-1 text-left",
    triggerOpen: "",
    triggerDisabled:
        "cursor-not-allowed border-refineui-alias-border-disabled bg-refineui-alias-background-surface-disabled text-refineui-alias-foreground-disabled",
    value: "min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left",
    iconWrap: "inline-flex size-refineui-icon-xsmall shrink-0 items-center justify-center",
    positioner: "z-refineui-popup flex flex-col overflow-hidden",
    contentShell:
        "box-border flex w-full flex-col overflow-hidden rounded-refineui-large border-refineui-hairline border-refineui-alias-border-default bg-refineui-alias-background-primary p-refineui-size-x-small shadow-refineui-2light outline-none min-h-0",
    contentPopper: "h-auto max-h-[var(--refineui-select-content-available-height,100dvh)]",
    contentItemAligned: "max-h-full",
    viewportPopper:
        "relative flex max-h-full min-h-0 min-w-full w-full flex-col",
    viewportItemAligned:
        "relative flex min-h-0 min-w-full w-full max-h-full flex-1 flex-col",
    scrollAreaRootPopper: "relative flex max-h-full min-h-0 flex-col",
    scrollAreaRootItemAligned: "relative flex h-full min-h-0 flex-1 flex-col",

    group: "flex flex-col",
    label: clsx(
        componentTextClass(componentTypographyTokens.select.label),
        "px-refineui-size-small py-refineui-size-medium text-refineui-alias-foreground-primary",
    ),
    separator: "my-refineui-size-x-small h-px bg-refineui-alias-border-default",

    item: clsx(
        componentTextClass(componentTypographyTokens.select.item),
        "relative mx-refineui-size-x-small flex cursor-pointer items-center gap-refineui-size-medium rounded-refineui-x-large border-refineui-none px-refineui-size-medium py-refineui-size-small text-refineui-alias-foreground-primary outline-none transition-colors data-[disabled]:cursor-not-allowed data-[disabled]:text-refineui-alias-foreground-disabled",
    ),
    itemActive: "bg-refineui-alias-background-surface-hover",
    itemDisabled: "cursor-not-allowed text-refineui-alias-foreground-disabled",
    itemIndicator: "inline-flex size-refineui-icon-xsmall shrink-0 items-center justify-center",
    itemText: "min-w-0 flex-1 truncate",
} as const;

export const selectTriggerSizeClass: Record<SelectSize, string> = formControlShellSizeClass;
