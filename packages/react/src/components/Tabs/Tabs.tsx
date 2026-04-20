import { clsx } from "clsx";
import type { ButtonHTMLAttributes, HTMLAttributes, KeyboardEvent, ReactNode } from "react";
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

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
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

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {}

export function TabsList({ className, ...props }: TabsListProps) {
    const { tabListRef } = useTabsContext("TabsList");

    return (
        <div
            ref={tabListRef as React.Ref<HTMLDivElement>}
            role="tablist"
            aria-orientation="horizontal"
            className={clsx(
                "box-border inline-flex max-w-full w-fit flex-wrap items-start gap-refineui-size-medium rounded-refineui-xlarge border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-surface-active p-refineui-size-small",
                className,
            )}
            {...props}
        />
    );
}

export interface TabsTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
    value: string;
    children: ReactNode;
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
                "refineui-typo-caption-1 box-border inline-flex min-h-0 min-w-0 flex-[0_1_auto] items-center rounded-refineui-large border-none px-refineui-size-small py-refineui-size-xsmall outline-none",
                disabled
                    ? "cursor-not-allowed text-refineui-alias-foreground-disabled"
                    : "cursor-pointer text-refineui-alias-foreground-primary",
                selected && "shadow-refineui-2light",
                selected && !disabled && "bg-refineui-alias-background-surface",
                selected && disabled && "bg-refineui-alias-background-surface-disabled",
                !selected && "bg-transparent",
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

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
    value: string;
}

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
