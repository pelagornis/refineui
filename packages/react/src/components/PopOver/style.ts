import type { PopoverAlign, PopoverPlacement } from "./types";

export const popoverStyles = {
    root: "relative inline-block",
    fallbackTrigger:
        "cursor-pointer border-none bg-transparent p-0 font-inherit text-inherit",
    floatingRoot: "absolute z-refineui-popup",
    panelWrap: "relative inline-block min-w-refineui-popover-panel-width",
    beakWrap: "pointer-events-none absolute",
    panel:
        "relative box-border min-w-refineui-popover-panel-width rounded-refineui-large border-refineui-thin p-refineui-size-large outline-none",
    panelShadowDefault: "shadow-refineui-8light",
    panelShadowInverted: "shadow-refineui-8dark",
} as const;

export const popoverPlacementMargin: Record<PopoverPlacement, string> = {
    top: "mb-refineui-size-xsmall",
    bottom: "mt-refineui-size-xsmall",
    left: "mr-refineui-size-xsmall",
    right: "ml-refineui-size-xsmall",
};

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

