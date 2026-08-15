import { clsx } from "clsx";
import type { CSSProperties, KeyboardEvent, Ref, RefObject } from "react";
import {
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useEffect,
    useId,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { tabsStyles } from "./style";
import type { TabsContentProps, TabsListProps, TabsProps, TabsTriggerProps } from "./types";

const TRIGGER_SELECTOR = '[data-refineui="tab"]';
const TRIGGER_ENABLED_SELECTOR = `${TRIGGER_SELECTOR}:not([disabled])`;

function slugTabValue(value: string): string {
    return value.replace(/[^a-zA-Z0-9_-]/g, "_");
}

type TabsContextValue = {
    selectedValue: string;
    setSelectedValue: (next: string) => void;
    tabListRef: RefObject<HTMLDivElement | null>;
    baseId: string;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
    const v = useContext(TabsContext);
    if (!v) throw new Error(`${component} must be used within Tabs.`);
    return v;
}

export function Tabs({
    children,
    className,
    defaultValue = "",
    value: valueControlled,
    onValueChange,
    ...props
}: TabsProps) {
    const isControlled = valueControlled !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const selectedValue = isControlled ? valueControlled! : internalValue;

    const setSelectedValue = useCallback(
        (next: string) => {
            if (!isControlled) setInternalValue(next);
            onValueChange?.(next);
        },
        [isControlled, onValueChange],
    );

    const tabListRef = useRef<HTMLDivElement | null>(null);
    const baseId = useId();

    const ctx = useMemo(
        () => ({
            selectedValue,
            setSelectedValue,
            tabListRef,
            baseId,
        }),
        [selectedValue, setSelectedValue, baseId],
    );

    return (
        <TabsContext.Provider value={ctx}>
            <div data-refineui="tabs" className={clsx(tabsStyles.root, className)} {...props}>
                {children}
            </div>
        </TabsContext.Provider>
    );
}

type IndicatorBox = {
    left: number;
    width: number;
    ready: boolean;
};

export function TabsList({ className, children, ...props }: TabsListProps) {
    const { tabListRef, selectedValue } = useTabsContext("TabsList");
    const [indicator, setIndicator] = useState<IndicatorBox>({
        left: 0,
        width: 0,
        ready: false,
    });

    const updateIndicator = useCallback(() => {
        const list = tabListRef.current;
        if (!list) return;
        const selected = list.querySelector<HTMLElement>(`${TRIGGER_SELECTOR}[data-selected="true"]`);
        if (!selected) {
            setIndicator((prev) => ({ ...prev, width: 0, ready: false }));
            return;
        }
        setIndicator({
            left: selected.offsetLeft,
            width: selected.offsetWidth,
            ready: true,
        });
    }, [tabListRef]);

    useLayoutEffect(() => {
        updateIndicator();
    }, [updateIndicator, selectedValue, children]);

    useEffect(() => {
        const list = tabListRef.current;
        if (!list) return;

        const ro = new ResizeObserver(() => {
            updateIndicator();
        });
        ro.observe(list);
        for (const tab of Array.from(list.querySelectorAll(TRIGGER_SELECTOR))) {
            ro.observe(tab);
        }

        window.addEventListener("resize", updateIndicator);

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", updateIndicator);
        };
    }, [tabListRef, updateIndicator, children]);

    const indicatorStyle: CSSProperties = {
        width: indicator.width,
        transform: `translate3d(${indicator.left}px, 0, 0)`,
    };

    return (
        <div
            ref={tabListRef as Ref<HTMLDivElement>}
            data-refineui="tabs-list"
            role="tablist"
            aria-orientation="horizontal"
            className={clsx(tabsStyles.list, className)}
            {...props}
        >
            <div
                data-refineui="tabs-indicator"
                data-ready={indicator.ready ? "true" : undefined}
                aria-hidden
                className={tabsStyles.indicator}
                style={indicatorStyle}
            />
            {children}
        </div>
    );
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
    { value, disabled, className, children, onKeyDown, onClick, ...rest },
    ref,
) {
    const ctx = useTabsContext("TabsTrigger");
    const selected = ctx.selectedValue === value;
    const safe = slugTabValue(value);
    const tabId = `${ctx.baseId}-trigger-${safe}`;
    const panelId = `${ctx.baseId}-panel-${safe}`;

    const moveFocus = useCallback(
        (delta: number) => {
            const root = ctx.tabListRef.current;
            if (!root) return;
            const arr = Array.from(root.querySelectorAll<HTMLButtonElement>(TRIGGER_ENABLED_SELECTOR));
            const n = arr.length;
            if (n === 0) return;
            const ix = arr.findIndex((b) => b.dataset.tabValue === value);
            if (ix < 0) return;
            const next = arr[(ix + delta + n) % n];
            const nextValue = next?.dataset.tabValue;
            next?.focus();
            if (nextValue) ctx.setSelectedValue(nextValue);
        },
        [ctx, value],
    );

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        switch (e.key) {
            case "ArrowRight":
            case "ArrowDown":
                e.preventDefault();
                moveFocus(1);
                break;
            case "ArrowLeft":
            case "ArrowUp":
                e.preventDefault();
                moveFocus(-1);
                break;
            case "Home": {
                e.preventDefault();
                const first = ctx.tabListRef.current?.querySelector<HTMLButtonElement>(TRIGGER_ENABLED_SELECTOR);
                const nextValue = first?.dataset.tabValue;
                first?.focus();
                if (nextValue) ctx.setSelectedValue(nextValue);
                break;
            }
            case "End": {
                e.preventDefault();
                const all = ctx.tabListRef.current?.querySelectorAll<HTMLButtonElement>(TRIGGER_ENABLED_SELECTOR);
                if (!all?.length) break;
                const last = all[all.length - 1];
                const nextValue = last?.dataset.tabValue;
                last?.focus();
                if (nextValue) ctx.setSelectedValue(nextValue);
                break;
            }
            default:
                break;
        }
    };

    return (
        <button
            ref={ref}
            type="button"
            id={tabId}
            data-refineui="tab"
            data-tab-value={value}
            data-selected={selected ? "true" : "false"}
            role="tab"
            aria-selected={selected}
            aria-controls={panelId}
            aria-disabled={disabled || undefined}
            disabled={disabled}
            tabIndex={selected && !disabled ? 0 : -1}
            className={clsx(
                tabsStyles.trigger,
                disabled ? tabsStyles.triggerDisabled : tabsStyles.triggerEnabled,
                selected && !disabled && tabsStyles.triggerSelectedEnabled,
                selected && disabled && tabsStyles.triggerSelectedDisabled,
                !selected && tabsStyles.triggerUnselected,
                className,
            )}
            onClick={(e) => {
                onClick?.(e);
                if (!disabled && !e.defaultPrevented) ctx.setSelectedValue(value);
            }}
            onKeyDown={handleKeyDown}
            {...rest}
        >
            {children}
        </button>
    );
});

export function TabsContent({ value, className, children, hidden: hiddenProp, ...props }: TabsContentProps) {
    const ctx = useTabsContext("TabsContent");
    const selected = ctx.selectedValue === value;
    const safe = slugTabValue(value);
    const tabId = `${ctx.baseId}-trigger-${safe}`;
    const panelId = `${ctx.baseId}-panel-${safe}`;

    return (
        <div
            role="tabpanel"
            id={panelId}
            aria-labelledby={tabId}
            hidden={hiddenProp ?? !selected}
            className={clsx(className)}
            {...props}
        >
            {children}
        </div>
    );
}
