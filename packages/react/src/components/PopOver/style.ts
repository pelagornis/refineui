import type { PopoverAlign, PopoverPlacement } from "./types";

export const popoverStyles = {
    root: "relative inline-block",
    fallbackTrigger:
        "cursor-pointer border-none bg-transparent p-0 font-inherit text-inherit",
    floatingRoot: "absolute z-refineui-popup",
    panelWrap: "relative inline-block min-w-refineui-popover-panel-width",
    beakWrap: "pointer-events-none absolute z-[1]",
    panel:
        "relative z-0 box-border min-w-refineui-popover-panel-width rounded-refineui-xx-large border-refineui-thin outline-none",
    panelShadowDefault: "shadow-refineui-8",
} as const;

export function popoverFloatingClasses(placement: PopoverPlacement, align: PopoverAlign): string {
    if (placement === "bottom") {
        if (align === "center") return "top-full left-1/2 -translate-x-1/2";
        if (align === "start") return "top-full left-0";
        return "top-full right-0";
    }
    if (placement === "top") {
        if (align === "center") return "bottom-full left-1/2 -translate-x-1/2";
        if (align === "start") return "bottom-full left-0";
        return "bottom-full right-0";
    }
    if (placement === "left") {
        if (align === "center") return "right-full top-1/2 -translate-y-1/2";
        if (align === "start") return "right-full top-0";
        return "right-full bottom-0";
    }
    if (align === "center") return "left-full top-1/2 -translate-y-1/2";
    if (align === "start") return "left-full top-0";
    return "left-full bottom-0";
}

