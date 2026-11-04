import type { CSSProperties } from "react";
import { spacings } from "@refineui/tokens";
import { clsx } from "clsx";
import { componentSizes } from "../../componentSizes";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";
import type { FloatingBeakAlign, FloatingBeakSide } from "../shared/floatingOutline";
import type { TooltipAlign, TooltipPosition } from "./types";

/** Beak protrusion plus clear space between its tip and the trigger. */
const gap = `calc(${componentSizes.tooltipBeakHeight} + ${spacings.sizeXXSmall})`;
export const TOOLTIP_BEAK_INSET = spacings.sizeMedium;

export const tooltipStyles = {
    root: "relative inline-block",
    fallbackTrigger: "inline-flex outline-none",
    /** Positions the floating stack (surface + panel), like PopOver `floatingRoot`. */
    floating: "pointer-events-none absolute z-refineui-popup",
    panelWrap: "relative inline-block max-w-refineui-tooltip-max-width",
    /** Fill, stroke, and shadow come from `FloatingSurface`; the transparent border keeps the box size. */
    panel: clsx(
        componentTextClass(componentTypographyTokens.tooltip),
        "relative z-0 box-border max-w-refineui-tooltip-max-width whitespace-nowrap rounded-refineui-medium border-refineui-hairline border-transparent px-refineui-size-medium py-refineui-size-small",
    ),
} as const;

/** Map Tooltip MCP position → PopOver-style placement. */
export function tooltipPlacement(position: TooltipPosition): "top" | "bottom" | "left" | "right" {
    switch (position) {
        case "Top":
            return "top";
        case "Left":
            return "left";
        case "Right":
            return "right";
        case "Bottom":
        default:
            return "bottom";
    }
}

export function tooltipAlignKey(align: TooltipAlign): FloatingBeakAlign {
    if (align === "Start") return "start";
    if (align === "End") return "end";
    return "center";
}

const beakSideByPlacement: Record<ReturnType<typeof tooltipPlacement>, FloatingBeakSide> = {
    bottom: "top",
    top: "bottom",
    left: "right",
    right: "left",
};

export function tooltipBeakSide(position: TooltipPosition): FloatingBeakSide {
    return beakSideByPlacement[tooltipPlacement(position)];
}

/** Floating stack offset from the trigger (gap + side). */
export function tooltipFloatingStyle(position: TooltipPosition, align: TooltipAlign): CSSProperties {
    switch (position) {
        case "Top":
            if (align === "Start") return { bottom: "100%", left: 0, marginBottom: gap };
            if (align === "End") return { bottom: "100%", right: 0, left: "auto", marginBottom: gap };
            return { bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: gap };
        case "Bottom":
            if (align === "Start") return { top: "100%", left: 0, marginTop: gap };
            if (align === "End") return { top: "100%", right: 0, left: "auto", marginTop: gap };
            return { top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: gap };
        case "Left":
            if (align === "Start") return { right: "100%", top: 0, marginRight: gap };
            if (align === "End") return { right: "100%", bottom: 0, top: "auto", marginRight: gap };
            return { right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: gap };
        case "Right":
            if (align === "Start") return { left: "100%", top: 0, marginLeft: gap };
            if (align === "End") return { left: "100%", bottom: 0, top: "auto", marginLeft: gap };
            return { left: "100%", top: "50%", transform: "translateY(-50%)", marginLeft: gap };
        default:
            return {};
    }
}
