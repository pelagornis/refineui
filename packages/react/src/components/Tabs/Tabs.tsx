import type { HTMLAttributes, KeyboardEvent } from "react";
import { useCallback, useId, useRef, useState } from "react";
import { colors, spacings, borderRadii, typographys, shadows, toBoxShadow, strokeWidths } from "@refineui/tokens";

export interface TabItem {
    id: string;
    label: string;
    content: React.ReactNode;
}

export type TabsVariant = "underline" | "pill";

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    items: TabItem[];
    defaultTab?: string;
    variant?: TabsVariant;
    onChange?: (id: string) => void;
}

export function Tabs({ items, defaultTab, variant = "pill", onChange, style, ...props }: TabsProps) {
    const [active, setActive] = useState(defaultTab ?? items[0]?.id ?? "");
    const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
    const panelId = useId();
    const current = items.find((t) => t.id === active) ?? items[0];
    const isPill = variant === "pill";

    const setTabRef = useCallback((index: number, el: HTMLButtonElement | null) => {
        tabsRef.current[index] = el;
    }, []);

    const focusTab = (index: number) => {
        const n = items.length;
        if (n === 0) return;
        tabsRef.current[((index % n) + n) % n]?.focus();
    };

    const select = (id: string) => {
        setActive(id);
        onChange?.(id);
    };

    const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
        switch (e.key) {
            case "ArrowRight":
            case "ArrowDown":
                e.preventDefault();
                focusTab(index + 1);
                break;
            case "ArrowLeft":
            case "ArrowUp":
                e.preventDefault();
                focusTab(index - 1);
                break;
            case "Home":
                e.preventDefault();
                focusTab(0);
                break;
            case "End":
                e.preventDefault();
                focusTab(items.length - 1);
                break;
            default:
                break;
        }
    };

    return (
        <div data-refineui="tabs" style={{ ...style }} {...props}>
            <div
                role="tablist"
                aria-orientation="horizontal"
                style={{
                    display: "flex",
                    gap: isPill ? spacings.sizeXSmall : spacings.sizeNone,
                    padding: isPill ? spacings.sizeXSmall : 0,
                    backgroundColor: isPill ? colors.neutral200 : "transparent",
                    borderRadius: isPill ? borderRadii.roundedMedium : undefined,
                    borderBottom: isPill ? undefined : `${strokeWidths.strokeWidthThick} solid ${colors.neutral200}`,
                    marginBottom: spacings.sizeMedium,
                }}
            >
                {items.map((item, index) => {
                    const selected = active === item.id;
                    const tabId = `refineui-tab-${item.id}`;
                    return (
                        <button
                            key={item.id}
                            ref={(el) => setTabRef(index, el)}
                            id={tabId}
                            data-refineui="tab"
                            role="tab"
                            type="button"
                            aria-selected={selected}
                            aria-controls={panelId}
                            tabIndex={selected ? 0 : -1}
                            onClick={() => select(item.id)}
                            onKeyDown={(e) => onTabKeyDown(e, index)}
                            style={{
                                ...typographys.body2,
                                padding: `${spacings.sizeSmall} ${spacings.sizeMedium}`,
                                border: "none",
                                borderRadius: isPill ? borderRadii.roundedSmall : undefined,
                                borderBottom:
                                    !isPill && selected
                                        ? `${strokeWidths.strokeWidthThick} solid ${colors.primaryBlack}`
                                        : !isPill
                                          ? `${strokeWidths.strokeWidthThick} solid transparent`
                                          : undefined,
                                marginBottom: !isPill ? -2 : undefined,
                                backgroundColor: isPill && selected ? colors.neutralWhite : "transparent",
                                color: selected ? colors.primaryBlack : colors.neutral600,
                                cursor: "pointer",
                                boxShadow: isPill && selected ? toBoxShadow(shadows.shadow2Light) : undefined,
                            }}
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
