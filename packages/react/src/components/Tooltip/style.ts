import type { CSSProperties } from "react";
import { spacings, strokeWidths } from "@refineui/tokens";
import { clsx } from "clsx";
import { foundationSizes } from "../../componentSizes";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";
import type { TooltipAlign, TooltipPosition } from "./types";

/** Same beak geometry as PopOver (viewBox 16×8 dual polygons). */
export const TOOLTIP_BEAK_W = foundationSizes.foundationSize160;
export const TOOLTIP_BEAK_H = foundationSizes.foundationSize80;
export const TOOLTIP_BEAK_OFFSET = foundationSizes.foundationSize80;
const BEAK_BORDER_OVERLAP = strokeWidths.strokeWidthThin;

const gap = spacings.sizeXSmall;
const edgeInset = spacings.sizeMedium;

export const tooltipStyles = {
    root: "relative inline-block",
    fallbackTrigger: "inline-flex outline-none",
    /** Positions the floating stack (beak + panel), like PopOver `floatingRoot`. */
    floating: "pointer-events-none absolute z-refineui-popup",
    panelWrap: "relative inline-block max-w-refineui-tooltip-max-width",
    beakWrap: "pointer-events-none absolute z-[1]",
    panel: clsx(
        componentTextClass(componentTypographyTokens.tooltip),
        "relative z-0 box-border max-w-refineui-tooltip-max-width whitespace-nowrap rounded-refineui-medium border-refineui-thin px-refineui-size-medium py-refineui-size-small shadow-refineui-8",
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

export function tooltipAlignKey(align: TooltipAlign): "start" | "center" | "end" {
    if (align === "Start") return "start";
    if (align === "End") return "end";
    return "center";
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

/** Beak wrapper position — mirrors PopOver `beakWrapperStyle`. */
export function tooltipBeakWrapperStyle(position: TooltipPosition, align: TooltipAlign): CSSProperties {
    const overlapOffset = `calc(-1 * ${TOOLTIP_BEAK_OFFSET} + ${BEAK_BORDER_OVERLAP})`;
    const placement = tooltipPlacement(position);
    const a = tooltipAlignKey(align);

    switch (placement) {
        case "bottom":
            if (a === "center") return { top: overlapOffset, left: `calc(50% - ${TOOLTIP_BEAK_W} / 2)` };
            if (a === "start") return { top: overlapOffset, left: edgeInset };
            return { top: overlapOffset, right: edgeInset };
        case "top":
            if (a === "center") return { bottom: overlapOffset, left: `calc(50% - ${TOOLTIP_BEAK_W} / 2)` };
            if (a === "start") return { bottom: overlapOffset, left: edgeInset };
            return { bottom: overlapOffset, right: edgeInset };
        case "left":
            if (a === "center") return { right: overlapOffset, top: `calc(50% - ${TOOLTIP_BEAK_W} / 2)` };
            if (a === "start") return { right: overlapOffset, top: edgeInset };
            return { right: overlapOffset, bottom: edgeInset };
        case "right":
            if (a === "center") return { left: overlapOffset, top: `calc(50% - ${TOOLTIP_BEAK_W} / 2)` };
            if (a === "start") return { left: overlapOffset, top: edgeInset };
            return { left: overlapOffset, bottom: edgeInset };
        default:
            return {};
    }
}

export function tooltipBeakRotateDeg(position: TooltipPosition): number {
    switch (tooltipPlacement(position)) {
        case "bottom":
            return 0;
        case "top":
            return 180;
        case "left":
            return -90;
        case "right":
            return 90;
        default:
            return 0;
    }
}
