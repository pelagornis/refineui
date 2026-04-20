import type { HTMLAttributes, ReactNode } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { AccordionContent } from "./AccordionContent";
import { AccordionItem } from "./AccordionItem";
import { AccordionTrigger } from "./AccordionTrigger";
import {
    AccordionContext,
    type AccordionSize,
    type AccordionType,
    type OpenState,
    toSet,
    usePrefersReducedMotion,
} from "./context";

export interface AccordionItemProps {
    id: string;
    title: ReactNode;
    content: ReactNode;
    icon?: string;
    defaultOpen?: boolean;
}

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
    items?: AccordionItemProps[];
    type?: AccordionType;
    collapsible?: boolean;
    defaultValue?: string | string[];
    value?: string | string[];
    onValueChange?: (value: string | string[] | undefined) => void;
    /** Legacy `allowMultiple` alias. */
    allowMultiple?: boolean;
    /** Figma Web Kit: Small → Caption1, Medium → Body1, Large → SubTitle1 */
    size?: AccordionSize;
}

export function Accordion({
    items,
    type,
    collapsible = false,
    defaultValue,
    value,
    onValueChange,
    allowMultiple = false,
    size = "medium",
    className,
    children,
    ...props
}: AccordionProps) {
    const reduceMotion = usePrefersReducedMotion();
    const resolvedType: AccordionType = type ?? (allowMultiple ? "multiple" : "single");
    const legacyDefault = useMemo(() => {
        if (!items) return undefined;
        const opened = items.filter((i) => i.defaultOpen).map((i) => i.id);
        if (opened.length === 0) return undefined;
        return resolvedType === "multiple" ? opened : opened[0];
    }, [items, resolvedType]);

    const initial = toSet(defaultValue ?? legacyDefault, resolvedType);
    const [uncontrolledOpen, setUncontrolledOpen] = useState<OpenState>(initial);
    const open = value === undefined ? uncontrolledOpen : toSet(value, resolvedType);

    const triggerOrderRef = useRef<string[]>([]);
    const triggerMapRef = useRef<Map<string, HTMLButtonElement>>(new Map());

    const registerTrigger = useCallback((itemValue: string, el: HTMLButtonElement | null) => {
        if (!triggerOrderRef.current.includes(itemValue)) {
            triggerOrderRef.current.push(itemValue);
        }
        if (el) triggerMapRef.current.set(itemValue, el);
        else triggerMapRef.current.delete(itemValue);
    }, []);

    const emit = useCallback(
        (next: OpenState) => {
            if (value === undefined) setUncontrolledOpen(next);
            if (!onValueChange) return;
            if (resolvedType === "multiple") onValueChange(Array.from(next));
            else onValueChange(Array.from(next)[0]);
        },
        [onValueChange, resolvedType, value],
    );

    const toggle = useCallback(
        (itemValue: string) => {
            const next = new Set(open);
            const opened = next.has(itemValue);
            if (opened) {
                if (resolvedType === "multiple" || collapsible) next.delete(itemValue);
            } else {
                if (resolvedType === "single") next.clear();
                next.add(itemValue);
            }
            emit(next);
        },
        [collapsible, emit, open, resolvedType],
    );

    const focusTrigger = (index: number) => {
        const list = triggerOrderRef.current
            .map((v) => triggerMapRef.current.get(v))
            .filter(Boolean) as HTMLButtonElement[];
        const n = list.length;
        if (n === 0) return;
        list[((index % n) + n) % n]?.focus();
    };

    const focusByDelta = useCallback((currentValue: string, delta: number) => {
        const idx = triggerOrderRef.current.indexOf(currentValue);
        focusTrigger(idx < 0 ? 0 : idx + delta);
    }, []);

    const contextValue = useMemo(
        () => ({
            size,
            isOpen: (itemValue: string) => open.has(itemValue),
            toggle,
            registerTrigger,
            focusByDelta,
            focusFirst: () => focusTrigger(0),
            focusLast: () => focusTrigger(triggerOrderRef.current.length - 1),
            reduceMotion,
        }),
        [focusByDelta, open, reduceMotion, registerTrigger, size, toggle],
    );

    const legacyChildren =
        items?.map((item) => (
            <AccordionItem key={item.id} value={item.id} icon={item.icon}>
                <AccordionTrigger>{item.title}</AccordionTrigger>
                <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
        )) ?? null;

    return (
        <AccordionContext.Provider value={contextValue}>
            <div data-refineui="accordion" className={className} {...props}>
                {children ?? legacyChildren}
            </div>
        </AccordionContext.Provider>
    );
}
