import { useEffect, useLayoutEffect } from "react";
import type { MenuAlign } from "./types";

export const useIsomorphicLayoutEffect = typeof document !== "undefined" ? useLayoutEffect : useEffect;

export function parseCssPxLen(value: string, fallback: number): number {
    const n = Number.parseFloat(value);
    return Number.isFinite(n) ? n : fallback;
}

/** Scrollable ancestors + window — for `getBoundingClientRect` refresh */
export function subscribeScrollAndScrollableAncestors(target: HTMLElement | null, fn: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    const list: (Element | Window)[] = [window];
    let el: HTMLElement | null = target?.parentElement ?? null;
    while (el) {
        const { overflow, overflowX, overflowY } = getComputedStyle(el);
        if (
            [overflow, overflowX, overflowY].some((o) => o === "auto" || o === "scroll" || o === "overlay") ||
            el.scrollHeight > el.clientHeight + 1
        ) {
            list.push(el);
        }
        el = el.parentElement;
    }
    for (const t of list) {
        t.addEventListener("scroll", fn, true);
    }
    return () => {
        for (const t of list) {
            t.removeEventListener("scroll", fn, true);
        }
    };
}

/** Anchored menu placement matching shadcn `align` + RefineUI `side` (viewport clamp). */
export function computeAnchoredMenuPosition(params: {
    anchor: DOMRect;
    menuWidth: number;
    menuHeight: number;
    align: MenuAlign;
    side: "auto" | "top" | "bottom";
    gap: number;
    edge?: number;
}): { top: number; left: number; side: "top" | "bottom" } {
    const edge = params.edge ?? 8;
    const { anchor, menuWidth: menuW, menuHeight: menuH, align, side, gap } = params;
    const vw = typeof window !== "undefined" ? window.innerWidth : 800;
    const vh = typeof window !== "undefined" ? window.innerHeight : 600;

    let left =
        align === "start"
            ? anchor.left
            : align === "end"
              ? anchor.right - menuW
              : anchor.left + anchor.width / 2 - menuW / 2;
    left = Math.max(edge, Math.min(left, vw - menuW - edge));

    const spaceBelow = vh - edge - (anchor.bottom + gap);
    const spaceAbove = anchor.top - gap - edge;
    const fitsBelow = menuH <= spaceBelow;
    const fitsAbove = menuH <= spaceAbove;

    let top: number;
    let resolvedSide: "top" | "bottom" = "bottom";

    if (side === "bottom") {
        resolvedSide = "bottom";
        top = anchor.bottom + gap;
        if (!fitsBelow && fitsAbove) {
            top = anchor.top - gap - menuH;
            resolvedSide = "top";
        } else if (!fitsBelow && !fitsAbove) {
            top = Math.max(edge, Math.min(anchor.bottom + gap, vh - edge - menuH));
        }
    } else if (side === "top") {
        resolvedSide = "top";
        top = anchor.top - gap - menuH;
        if (!fitsAbove && fitsBelow) {
            top = anchor.bottom + gap;
            resolvedSide = "bottom";
        } else if (!fitsBelow && !fitsAbove) {
            top = Math.max(edge, Math.min(anchor.top - gap - menuH, vh - edge - menuH));
        }
    } else {
        if (!fitsBelow && fitsAbove) {
            top = anchor.top - gap - menuH;
            resolvedSide = "top";
        } else {
            top = anchor.bottom + gap;
            resolvedSide = "bottom";
        }
        if (!fitsBelow && !fitsAbove) {
            top = Math.max(edge, Math.min(anchor.bottom + gap, vh - edge - menuH));
            resolvedSide = "bottom";
        }
    }

    return { top, left, side: resolvedSide };
}

export function computeSubmenuPanelPosition(params: {
    trigger: DOMRect;
    panelWidth: number;
    panelHeight: number;
    gap: number;
    edge?: number;
    /** Default: right of trigger; flip left if needed */
    preferredSide?: "right" | "left";
}): { top: number; left: number } {
    const edge = params.edge ?? 8;
    const { trigger: tr, panelWidth: pw, panelHeight: ph, gap } = params;
    const vw = typeof window !== "undefined" ? window.innerWidth : 800;
    const vh = typeof window !== "undefined" ? window.innerHeight : 600;

    let left = tr.right + gap;
    if (left + pw > vw - edge) {
        left = tr.left - gap - pw;
    }
    left = Math.max(edge, Math.min(left, vw - pw - edge));

    let top = tr.top;
    top = Math.max(edge, Math.min(top, vh - ph - edge));

    return { top, left };
}

