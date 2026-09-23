import { createContext, useContext, useEffect, useState } from "react";
import { semanticInteraction } from "@refineui/tokens";
import { getReducedMotionQuery } from "@refineui/utilities/animation";

export interface CollapsibleContextValue {
    open: boolean;
    toggle: () => void;
    contentId: string;
    triggerId: string;
    reduceMotion: boolean;
}

export const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

export function useCollapsibleContext(part: string): CollapsibleContextValue {
    const value = useContext(CollapsibleContext);
    if (!value) throw new Error(`${part} must be used within Collapsible`);
    return value;
}

/** Same query contract as Accordion / Tree. */
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

export const PANEL_HEIGHT_MS = Number.parseFloat(semanticInteraction.duration.panel) / 1000;
export const PANEL_CONTENT_MS = Number.parseFloat(semanticInteraction.duration.normal) / 1000;
export const PANEL_HEIGHT_EASE = semanticInteraction.easing.panel;
export const PANEL_CONTENT_EASE = semanticInteraction.easing.content;
