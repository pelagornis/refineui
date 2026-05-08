import { createContext, useEffect, useState } from "react";
import { semanticInteraction } from "@refineui/tokens";
import { getReducedMotionQuery } from "@refineui/utilities/animation";

export type AccordionSize = "sm" | "md" | "lg";
export type AccordionType = "single" | "multiple";
export type OpenState = Set<string>;

export interface AccordionContextValue {
    size: AccordionSize;
    isOpen: (value: string) => boolean;
    toggle: (value: string) => void;
    registerTrigger: (value: string, el: HTMLButtonElement | null) => void;
    focusByDelta: (currentValue: string, delta: number) => void;
    focusFirst: () => void;
    focusLast: () => void;
    reduceMotion: boolean;
}

export interface ItemContextValue {
    value: string;
    triggerId: string;
    panelId: string;
    open: boolean;
    icon?: string;
}

export const AccordionContext = createContext<AccordionContextValue | null>(null);
export const AccordionItemContext = createContext<ItemContextValue | null>(null);

export const PANEL_HEIGHT_MS = Number.parseFloat(semanticInteraction.duration.accordionPanel) / 1000;
export const PANEL_CONTENT_MS = Number.parseFloat(semanticInteraction.duration.accordionContent) / 1000;
export const PANEL_HEIGHT_EASE = semanticInteraction.easing.panel;
export const PANEL_CONTENT_EASE = semanticInteraction.easing.content;

export function usePrefersReducedMotion(): boolean {
    const [reduce, setReduce] = useState(false);
    useEffect(() => {
        const mql = window.matchMedia(getReducedMotionQuery().replace("@media ", ""));
        const sync = () => setReduce(mql.matches);
        sync();
        mql.addEventListener("change", sync);
        return () => mql.removeEventListener("change", sync);
    }, []);
    return reduce;
}

export function toSet(value: string | string[] | undefined, type: AccordionType): OpenState {
    if (value == null) return new Set();
    if (Array.isArray(value)) return new Set(value);
    return type === "multiple" ? new Set([value]) : new Set([value]);
}

