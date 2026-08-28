import { createContext, useEffect, useState } from "react";
import { semanticInteraction } from "@refineui/tokens";
import { getReducedMotionQuery } from "@refineui/utilities/animation";

export type TreeSize = "sm" | "md" | "lg";

export const TREE_PANEL_MS = Number.parseFloat(semanticInteraction.duration.accordionPanel) / 1000;
export const TREE_CONTENT_MS = Number.parseFloat(semanticInteraction.duration.accordionContent) / 1000;
export const TREE_PANEL_EASE = semanticInteraction.easing.panel;
export const TREE_CONTENT_EASE = semanticInteraction.easing.content;

export interface TreeContextValue {
    size: TreeSize;
    isExpanded: (value: string) => boolean;
    toggleExpanded: (value: string) => void;
    expand: (value: string) => void;
    collapse: (value: string) => void;
    selected: string | null;
    select: (value: string) => void;
    registerItem: (value: string, el: HTMLElement | null, meta: { parentValue: string | null; disabled: boolean }) => void;
    focusItem: (value: string) => void;
    focusByDelta: (currentValue: string, delta: number) => void;
    focusFirst: () => void;
    focusLast: () => void;
    getParent: (value: string) => string | null;
    reduceMotion: boolean;
}

export interface TreeItemContextValue {
    value: string;
    depth: number;
    parentValue: string | null;
    expanded: boolean;
    selected: boolean;
    disabled: boolean;
    hasBranch: boolean;
    setHasBranch: (has: boolean) => void;
    triggerId: string;
    groupId: string;
}

export const TreeContext = createContext<TreeContextValue | null>(null);
export const TreeItemContext = createContext<TreeItemContextValue | null>(null);

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

export function toExpandedSet(value: string[] | undefined): Set<string> {
    if (value == null) return new Set();
    return new Set(value);
}
