import type { CSSProperties } from "react";
import { shadows, spacings, strokeWidths, type ShadowLevel } from "@refineui/tokens";
import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";
import type { TooltipAlign, TooltipPosition } from "./types";

export const tooltipStyles = {
    root: "relative inline-block",
    fallbackTrigger: "inline-flex outline-none",
    panel: clsx(
        componentTextClass(componentTypographyTokens.tooltip),
        "pointer-events-none absolute z-refineui-popup max-w-refineui-tooltip-max-width whitespace-nowrap rounded-refineui-medium px-refineui-size-medium py-refineui-size-small",
    ),
} as const;

const gap = spacings.sizeXSmall;
const edgeInset = spacings.sizeMedium;
/** Tuck the CSS triangle into the panel so a hairline does not show at the join. */
const arrowPanelOverlap = strokeWidths.strokeWidthThin;

function arrowOutset(halfPx: number): string {
    return `calc(-1 * ${halfPx}px + ${arrowPanelOverlap})`;
}

/** `ShadowLevel` layers include spread; `drop-shadow()` does not. */
function dropShadowFromLayer(layer: string): string {
    const [x, y, blur, , ...colorTokens] = layer.split(" ");
    return `drop-shadow(${x} ${y} ${blur} ${colorTokens.join(" ")})`;
}

function dropShadowFromLevel(level: ShadowLevel): string {
    return `${dropShadowFromLayer(level.key)} ${dropShadowFromLayer(level.ambient)}`;
}

/** Silhouette elevation so the arrow does not sit outside a rectangular box-shadow. */
export const tooltipPanelDropShadow = dropShadowFromLevel(shadows.shadow8Light);

/** Panel `absolute` offset — MCP position × align */
export function tooltipPanelStyle(position: TooltipPosition, align: TooltipAlign): CSSProperties {
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
            // MCP: Left-Top = Start, Left-Bottom = End, Left-Center
            if (align === "Start") return { right: "100%", top: 0, marginRight: gap };
            if (align === "End") return { right: "100%", bottom: 0, top: "auto", marginRight: gap };
            return { right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: gap };
        case "Right":
            // MCP: Right-Top = Start, Right-Bottom = End, Right-Center
            if (align === "Start") return { left: "100%", top: 0, marginLeft: gap };
            if (align === "End") return { left: "100%", bottom: 0, top: "auto", marginLeft: gap };
            return { left: "100%", top: "50%", transform: "translateY(-50%)", marginLeft: gap };
        default:
            return {};
    }
}

/** CSS border triangle — background `bg` (resolved hex), half-edge `b` (sizeSmall) */
export function tooltipArrowStyle(
    position: TooltipPosition,
    align: TooltipAlign,
    bg: string,
    b: number,
): CSSProperties {
    const baseBox: CSSProperties = { position: "absolute", display: "block", width: 0, height: 0 };
    const outset = arrowOutset(b);

    if (position === "Top") {
        const tri = {
            ...baseBox,
            bottom: outset,
            borderLeft: `${b}px solid transparent`,
            borderRight: `${b}px solid transparent`,
            borderTop: `${b}px solid ${bg}`,
        };
        if (align === "Start") return { ...tri, left: edgeInset, marginLeft: 0 };
        if (align === "End") return { ...tri, right: edgeInset, left: "auto", marginLeft: 0 };
        return { ...tri, left: "50%", marginLeft: -b };
    }

    if (position === "Bottom") {
        const tri = {
            ...baseBox,
            top: outset,
            borderLeft: `${b}px solid transparent`,
            borderRight: `${b}px solid transparent`,
            borderBottom: `${b}px solid ${bg}`,
        };
        if (align === "Start") return { ...tri, left: edgeInset, marginLeft: 0 };
        if (align === "End") return { ...tri, right: edgeInset, left: "auto", marginLeft: 0 };
        return { ...tri, left: "50%", marginLeft: -b };
    }

    if (position === "Left") {
        const tri = {
            ...baseBox,
            right: outset,
            borderTop: `${b}px solid transparent`,
            borderBottom: `${b}px solid transparent`,
            borderLeft: `${b}px solid ${bg}`,
        };
        // Start = Top → arrow near top of panel; End = Bottom → near bottom
        if (align === "Start") return { ...tri, top: edgeInset, marginTop: 0 };
        if (align === "End") return { ...tri, bottom: edgeInset, top: "auto", marginTop: 0 };
        return { ...tri, top: "50%", marginTop: -b };
    }

    const tri = {
        ...baseBox,
        left: outset,
        borderTop: `${b}px solid transparent`,
        borderBottom: `${b}px solid transparent`,
        borderRight: `${b}px solid ${bg}`,
    };
    if (align === "Start") return { ...tri, top: edgeInset, marginTop: 0 };
    if (align === "End") return { ...tri, bottom: edgeInset, top: "auto", marginTop: 0 };
    return { ...tri, top: "50%", marginTop: -b };
}
