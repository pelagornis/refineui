import type { CSSProperties } from "react";
import { spacings } from "@refineui/tokens";
import type { TooltipAlign, TooltipPosition } from "./types";

export const tooltipStyles = {
    root: "relative inline-block",
    fallbackTrigger: "inline-flex outline-none",
    panel:
        "refineui-typo-body-4 pointer-events-none absolute z-refineui-popup max-w-refineui-tooltip-max-width whitespace-nowrap rounded-refineui-medium px-refineui-size-medium py-refineui-size-small shadow-refineui-8light",
} as const;

const gap = spacings.sizeXSmall;
const edgeInset = spacings.sizeMedium;

/** 패널 `absolute` 오프셋 — MCP position × align */
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
            if (align === "Start") return { right: "100%", bottom: 0, top: "auto", marginRight: gap };
            if (align === "End") return { right: "100%", top: 0, marginRight: gap };
            return { right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: gap };
        case "Right":
            if (align === "Start") return { left: "100%", bottom: 0, top: "auto", marginLeft: gap };
            if (align === "End") return { left: "100%", top: 0, marginLeft: gap };
            return { left: "100%", top: "50%", transform: "translateY(-50%)", marginLeft: gap };
        default:
            return {};
    }
}

/** CSS border 삼각형 — 배경 `bg`(resolve 후 hex)·반변 `b`(sizeSmall) */
export function tooltipArrowStyle(
    position: TooltipPosition,
    align: TooltipAlign,
    bg: string,
    b: number,
): CSSProperties {
    const baseBox: CSSProperties = { position: "absolute", width: 0, height: 0 };

    if (position === "Top") {
        const tri = {
            ...baseBox,
            bottom: -b,
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
            top: -b,
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
            right: -b,
            borderTop: `${b}px solid transparent`,
            borderBottom: `${b}px solid transparent`,
            borderLeft: `${b}px solid ${bg}`,
        };
        if (align === "Start") return { ...tri, bottom: edgeInset, top: "auto", marginTop: 0 };
        if (align === "End") return { ...tri, top: edgeInset, marginTop: 0 };
        return { ...tri, top: "50%", marginTop: -b };
    }

    const tri = {
        ...baseBox,
        left: -b,
        borderTop: `${b}px solid transparent`,
        borderBottom: `${b}px solid transparent`,
        borderRight: `${b}px solid ${bg}`,
    };
    if (align === "Start") return { ...tri, bottom: edgeInset, top: "auto", marginTop: 0 };
    if (align === "End") return { ...tri, top: edgeInset, marginTop: 0 };
    return { ...tri, top: "50%", marginTop: -b };
}
