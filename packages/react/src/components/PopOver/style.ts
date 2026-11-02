import type { PopoverAlign, PopoverPlacement } from "./types";

export const popoverStyles = {
    root: "relative inline-block",
    fallbackTrigger:
        "cursor-pointer border-none bg-transparent p-0 font-inherit text-inherit",
    floatingRoot: "absolute z-refineui-popup",
    panelWrap: "relative inline-block min-w-refineui-popover-panel-width",
    /** Fill, stroke, and shadow come from `FloatingSurface`; the transparent border keeps the box size. */
    panel:
        "relative z-0 box-border min-w-refineui-popover-panel-width rounded-refineui-xx-large border-refineui-thin border-transparent outline-none",
} as const;

export function popoverFloatingClasses(placement: PopoverPlacement, align: PopoverAlign): string {
    if (placement === "bottom") {
        if (align === "center") return "top-full start-1/2 -translate-x-1/2";
        if (align === "start") return "top-full start-0";
        return "top-full end-0";
    }
    if (placement === "top") {
        if (align === "center") return "bottom-full start-1/2 -translate-x-1/2";
        if (align === "start") return "bottom-full start-0";
        return "bottom-full end-0";
    }
    if (placement === "left") {
        if (align === "center") return "end-full top-1/2 -translate-y-1/2";
        if (align === "start") return "end-full top-0";
        return "end-full bottom-0";
    }
    if (align === "center") return "start-full top-1/2 -translate-y-1/2";
    if (align === "start") return "start-full top-0";
    return "start-full bottom-0";
}

