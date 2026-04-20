import { clsx } from "clsx";
import type { KeyboardEvent } from "react";
import {
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useId,
    useMemo,
    useRef,
    useState,
} from "react";
import { tabsStyles } from "./style";
import type { TabsContentProps, TabsListProps, TabsProps, TabsTriggerProps } from "./types";

function slugTabValue(value: string): string {
    return value.replace(/[^a-zA-Z0-9_-]/g, "_");
}

type TabsContextValue = {
    selectedValue: string;
    setSelectedValue: (next: string) => void;
    tabListRef: React.RefObject<HTMLDivElement | null>;
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
            <div data-refineui="tabs" data-variant="pill" className={className} {...props}>
                {children}
            </div>
        </TabsContext.Provider>
    );
}

export function TabsList({ className, ...props }: TabsListProps) {
    const { tabListRef } = useTabsContext("TabsList");

    return (
        <div
            ref={tabListRef as React.Ref<HTMLDivElement>}
            role="tablist"
            aria-orientation="horizontal"
            className={clsx(
                tabsStyles.list,
                className,
            )}
            {...props}
        />
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

    const focusNeighbor = useCallback(
        (delta: number) => {
            const root = ctx.tabListRef.current;
            if (!root) return;
            const arr = Array.from(
                root.querySelectorAll<HTMLButtonElement>('[data-refineui="tab"]:not([disabled])'),
            );
            const n = arr.length;
            if (n === 0) return;
            const ix = arr.findIndex((b) => b.dataset.tabValue === value);
            if (ix < 0) return;
            const next = (ix + delta + n) % n;
            arr[next]?.focus();
        },
        [ctx.tabListRef, value],
    );

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        switch (e.key) {
            case "ArrowRight":
            case "ArrowDown":
                e.preventDefault();
                focusNeighbor(1);
                break;
            case "ArrowLeft":
            case "ArrowUp":
                e.preventDefault();
                focusNeighbor(-1);
                break;
            case "Home": {
                e.preventDefault();
                const root = ctx.tabListRef.current;
                const first = root?.querySelector<HTMLButtonElement>('[data-refineui="tab"]:not([disabled])');
                first?.focus();
                break;
            }
            case "End": {
                e.preventDefault();
                const root = ctx.tabListRef.current;
                const all = root?.querySelectorAll<HTMLButtonElement>('[data-refineui="tab"]:not([disabled])');
                if (all?.length) all[all.length - 1]?.focus();
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
                disabled
                    ? tabsStyles.triggerDisabled
                    : tabsStyles.triggerEnabled,
                selected && tabsStyles.triggerSelectedShadow,
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
