import { clsx } from "clsx";
import {
    useCallback,
    useMemo,
    useRef,
    useState,
    type HTMLAttributes,
} from "react";
import {
    TreeContext,
    toExpandedSet,
    usePrefersReducedMotion,
    type TreeSize,
} from "./context";
import { treeStyles } from "./style";

export interface TreeProps extends HTMLAttributes<HTMLUListElement> {
    size?: TreeSize;
    defaultExpanded?: string[];
    expanded?: string[];
    onExpandedChange?: (value: string[]) => void;
    defaultSelected?: string;
    selected?: string | null;
    onSelectedChange?: (value: string | null) => void;
}

type ItemMeta = { parentValue: string | null; disabled: boolean };

export function Tree({
    size = "md",
    defaultExpanded,
    expanded: expandedProp,
    onExpandedChange,
    defaultSelected,
    selected: selectedProp,
    onSelectedChange,
    className,
    children,
    ...props
}: TreeProps) {
    const reduceMotion = usePrefersReducedMotion();
    const [uncontrolledExpanded, setUncontrolledExpanded] = useState(() => toExpandedSet(defaultExpanded));
    const [uncontrolledSelected, setUncontrolledSelected] = useState<string | null>(defaultSelected ?? null);

    const expanded = expandedProp === undefined ? uncontrolledExpanded : toExpandedSet(expandedProp);
    const selected = selectedProp === undefined ? uncontrolledSelected : selectedProp;

    const orderRef = useRef<string[]>([]);
    const elMapRef = useRef<Map<string, HTMLElement>>(new Map());
    const metaMapRef = useRef<Map<string, ItemMeta>>(new Map());

    const emitExpanded = useCallback(
        (next: Set<string>) => {
            if (expandedProp === undefined) setUncontrolledExpanded(next);
            onExpandedChange?.(Array.from(next));
        },
        [expandedProp, onExpandedChange],
    );

    const emitSelected = useCallback(
        (next: string | null) => {
            if (selectedProp === undefined) setUncontrolledSelected(next);
            onSelectedChange?.(next);
        },
        [onSelectedChange, selectedProp],
    );

    const isExpanded = useCallback((value: string) => expanded.has(value), [expanded]);

    const toggleExpanded = useCallback(
        (value: string) => {
            const next = new Set(expanded);
            if (next.has(value)) next.delete(value);
            else next.add(value);
            emitExpanded(next);
        },
        [emitExpanded, expanded],
    );

    const expand = useCallback(
        (value: string) => {
            if (expanded.has(value)) return;
            const next = new Set(expanded);
            next.add(value);
            emitExpanded(next);
        },
        [emitExpanded, expanded],
    );

    const collapse = useCallback(
        (value: string) => {
            if (!expanded.has(value)) return;
            const next = new Set(expanded);
            next.delete(value);
            emitExpanded(next);
        },
        [emitExpanded, expanded],
    );

    const select = useCallback(
        (value: string) => {
            emitSelected(value);
        },
        [emitSelected],
    );

    const registerItem = useCallback((value: string, el: HTMLElement | null, meta: ItemMeta) => {
        metaMapRef.current.set(value, meta);
        if (!orderRef.current.includes(value)) {
            orderRef.current.push(value);
        }
        if (el) elMapRef.current.set(value, el);
        else {
            elMapRef.current.delete(value);
            metaMapRef.current.delete(value);
            orderRef.current = orderRef.current.filter((v) => v !== value);
        }
    }, []);

    const focusItem = useCallback((value: string) => {
        elMapRef.current.get(value)?.focus();
    }, []);

    const visibleValues = useCallback(() => {
        const result: string[] = [];
        const walk = (parent: string | null) => {
            for (const value of orderRef.current) {
                const meta = metaMapRef.current.get(value);
                if (!meta || meta.parentValue !== parent) continue;
                if (meta.disabled) continue;
                result.push(value);
                if (expanded.has(value)) walk(value);
            }
        };
        walk(null);
        return result;
    }, [expanded]);

    const focusByDelta = useCallback(
        (currentValue: string, delta: number) => {
            const list = visibleValues();
            const idx = list.indexOf(currentValue);
            if (list.length === 0) return;
            const next = list[((idx < 0 ? 0 : idx) + delta + list.length * 10) % list.length];
            if (next) focusItem(next);
        },
        [focusItem, visibleValues],
    );

    const focusFirst = useCallback(() => {
        const list = visibleValues();
        if (list[0]) focusItem(list[0]);
    }, [focusItem, visibleValues]);

    const focusLast = useCallback(() => {
        const list = visibleValues();
        const last = list[list.length - 1];
        if (last) focusItem(last);
    }, [focusItem, visibleValues]);

    const getParent = useCallback((value: string) => metaMapRef.current.get(value)?.parentValue ?? null, []);

    const contextValue = useMemo(
        () => ({
            size,
            isExpanded,
            toggleExpanded,
            expand,
            collapse,
            selected,
            select,
            registerItem,
            focusItem,
            focusByDelta,
            focusFirst,
            focusLast,
            getParent,
            reduceMotion,
        }),
        [
            collapse,
            expand,
            focusByDelta,
            focusFirst,
            focusItem,
            focusLast,
            getParent,
            isExpanded,
            reduceMotion,
            registerItem,
            select,
            selected,
            size,
            toggleExpanded,
        ],
    );

    return (
        <TreeContext.Provider value={contextValue}>
            <ul
                data-refineui="tree"
                role="tree"
                className={clsx(treeStyles.root, className)}
                {...props}
            >
                {children}
            </ul>
        </TreeContext.Provider>
    );
}
