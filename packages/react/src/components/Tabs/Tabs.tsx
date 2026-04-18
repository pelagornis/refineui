import { clsx } from "clsx";
import type { HTMLAttributes, KeyboardEvent } from "react";
import { useCallback, useId, useRef, useState } from "react";

export interface TabItem {
    id: string;
    label: string;
    content: React.ReactNode;
    /** Web Kit `Tabs / Item` `636:5372` — Disabled 행 */
    disabled?: boolean;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    items: TabItem[];
    defaultTab?: string;
    onChange?: (id: string) => void;
}

function pickInitialTab(items: TabItem[], defaultTab?: string): string {
    if (defaultTab !== undefined && items.some((t) => t.id === defaultTab && !t.disabled)) {
        return defaultTab;
    }
    const first = items.find((t) => !t.disabled);
    return first?.id ?? items[0]?.id ?? "";
}

/** Web Kit `Tabs` `636:5371` · `Tabs / Item` `636:5372` — Pill 세그먼트만. */
export function Tabs({ items, defaultTab, onChange, className, ...props }: TabsProps) {
    const [active, setActive] = useState(() => pickInitialTab(items, defaultTab));
    const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
    const panelId = useId();
    const current = items.find((t) => t.id === active) ?? items[0];

    const setTabRef = useCallback((index: number, el: HTMLButtonElement | null) => {
        tabsRef.current[index] = el;
    }, []);

    const focusTabFrom = (fromIndex: number, delta: number) => {
        const n = items.length;
        if (n === 0) return;
        let i = fromIndex;
        for (let s = 0; s < n; s++) {
            i = (i + delta + n) % n;
            if (!items[i]?.disabled) {
                tabsRef.current[i]?.focus();
                return;
            }
        }
    };

    const focusFirstEnabled = () => {
        const ix = items.findIndex((t) => !t.disabled);
        if (ix >= 0) tabsRef.current[ix]?.focus();
    };

    const focusLastEnabled = () => {
        for (let i = items.length - 1; i >= 0; i--) {
            if (!items[i]?.disabled) {
                tabsRef.current[i]?.focus();
                return;
            }
        }
    };

    const select = (id: string) => {
        const item = items.find((t) => t.id === id);
        if (item?.disabled) return;
        setActive(id);
        onChange?.(id);
    };

    const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
        switch (e.key) {
            case "ArrowRight":
            case "ArrowDown":
                e.preventDefault();
                focusTabFrom(index, 1);
                break;
            case "ArrowLeft":
            case "ArrowUp":
                e.preventDefault();
                focusTabFrom(index, -1);
                break;
            case "Home":
                e.preventDefault();
                focusFirstEnabled();
                break;
            case "End":
                e.preventDefault();
                focusLastEnabled();
                break;
            default:
                break;
        }
    };

    return (
        <div data-refineui="tabs" data-variant="pill" className={className} {...props}>
            <div
                role="tablist"
                aria-orientation="horizontal"
                className="mb-refineui-size-medium box-border inline-flex max-w-full w-fit flex-wrap items-stretch gap-refineui-size-medium rounded-refineui-large border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-surface-active p-refineui-size-small"
            >
                {items.map((item, index) => {
                    const selected = active === item.id;
                    const tabId = `refineui-tab-${item.id}`;
                    const disabled = item.disabled === true;

                    return (
                        <button
                            key={item.id}
                            ref={(el) => setTabRef(index, el)}
                            id={tabId}
                            data-refineui="tab"
                            data-selected={selected ? "true" : "false"}
                            role="tab"
                            type="button"
                            aria-selected={selected}
                            aria-controls={panelId}
                            aria-disabled={disabled || undefined}
                            disabled={disabled}
                            tabIndex={selected && !disabled ? 0 : -1}
                            onClick={() => select(item.id)}
                            onKeyDown={(e) => onTabKeyDown(e, index)}
                            className={clsx(
                                "refineui-typo-body-1 min-w-0 flex-[0_1_auto] rounded-refineui-large border-none px-refineui-size-medium py-refineui-size-small",
                                disabled
                                    ? "cursor-not-allowed text-refineui-alias-foreground-disabled"
                                    : "cursor-pointer text-refineui-alias-foreground-primary",
                                selected && "shadow-refineui-2light",
                                selected && !disabled && "bg-refineui-alias-background-surface",
                                selected && disabled && "bg-refineui-alias-background-surface-disabled",
                                !selected && "bg-transparent",
                            )}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>
            <div role="tabpanel" id={panelId} aria-labelledby={`refineui-tab-${active}`}>
                {current?.content}
            </div>
        </div>
    );
}
