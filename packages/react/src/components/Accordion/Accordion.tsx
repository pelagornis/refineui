import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { colors, spacings, typographys, sizes, iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";

export interface AccordionItemProps {
    id: string;
    title: ReactNode;
    content: ReactNode;
    icon?: string;
    defaultOpen?: boolean;
}

export type AccordionSize = "small" | "medium" | "large";

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
    items: AccordionItemProps[];
    allowMultiple?: boolean;
    /** Figma Web Kit: Small → Caption1, Medium → Body1, Large → SubTitle1 */
    size?: AccordionSize;
}

const triggerTypographyBySize: Record<AccordionSize, (typeof typographys)["body1"]> = {
    small: typographys.caption1,
    medium: typographys.body1,
    large: typographys.subTitle1,
};

/** 높이는 조금 여유 있게, 본문은 살짝 빠르게 페이드해 닫힐 때 덜 뚝 끊기게 */
const PANEL_HEIGHT_MS = 0.38;
const PANEL_CONTENT_MS = 0.26;
const PANEL_HEIGHT_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const PANEL_CONTENT_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

function usePrefersReducedMotion(): boolean {
    const [reduce, setReduce] = useState(false);
    useEffect(() => {
        const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
        const sync = () => setReduce(mql.matches);
        sync();
        mql.addEventListener("change", sync);
        return () => mql.removeEventListener("change", sync);
    }, []);
    return reduce;
}

export function Accordion({ items, allowMultiple = false, size = "medium", style, ...props }: AccordionProps) {
    const reduceMotion = usePrefersReducedMotion();
    const triggerTypography = triggerTypographyBySize[size];
    const [openIds, setOpenIds] = useState<Set<string>>(
        () => new Set(items.filter((i) => i.defaultOpen).map((i) => i.id))
    );
    const triggersRef = useRef<(HTMLButtonElement | null)[]>([]);

    const setTriggerRef = useCallback((index: number, el: HTMLButtonElement | null) => {
        triggersRef.current[index] = el;
    }, []);

    const toggle = (id: string) => {
        setOpenIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else {
                if (!allowMultiple) next.clear();
                next.add(id);
            }
            return next;
        });
    };

    const focusTrigger = (index: number) => {
        const list = triggersRef.current.filter(Boolean) as HTMLButtonElement[];
        const n = list.length;
        if (n === 0) return;
        list[((index % n) + n) % n]?.focus();
    };

    const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
        const n = items.length;
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                focusTrigger(index + 1);
                break;
            case "ArrowUp":
                e.preventDefault();
                focusTrigger(index - 1);
                break;
            case "Home":
                e.preventDefault();
                focusTrigger(0);
                break;
            case "End":
                e.preventDefault();
                focusTrigger(n - 1);
                break;
            default:
                break;
        }
    };

    return (
        <div data-refineui="accordion" style={{ ...style }} {...props}>
            {items.map((item, index) => {
                const isOpen = openIds.has(item.id);
                return (
                    <div key={item.id}>
                        <button
                            ref={(el) => setTriggerRef(index, el)}
                            type="button"
                            data-refineui="accordion-trigger"
                            aria-expanded={isOpen}
                            aria-controls={`accordion-panel-${item.id}`}
                            id={`accordion-trigger-${item.id}`}
                            onClick={() => toggle(item.id)}
                            onKeyDown={(e) => onTriggerKeyDown(e, index)}
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: spacings.sizeMedium,
                                padding: `${spacings.sizeSmall} ${spacings.sizeMedium}`,
                                minHeight: sizes.controlTouchMin,
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                textAlign: "left",
                                ...triggerTypography,
                                color: colors.primaryBlack,
                            }}
                        >
                            <span style={{ display: "flex", alignItems: "center", gap: spacings.sizeMedium, flex: 1, minWidth: 0 }}>
                                <WebIcon name={item.icon ?? "circle"} size={iconSizes.lg} color={colors.primaryBlack} />
                                {item.title}
                            </span>
                            <WebIcon
                                name={isOpen ? "chevron-up" : "chevron-down"}
                                size={iconSizes.lg}
                                color={colors.primaryBlack}
                                fallback="▼"
                            />
                        </button>
                        <div
                            id={`accordion-panel-${item.id}`}
                            role="region"
                            aria-labelledby={`accordion-trigger-${item.id}`}
                            aria-hidden={!isOpen}
                            data-refineui="accordion-panel"
                            style={{
                                display: "grid",
                                gridTemplateRows: isOpen ? "1fr" : "0fr",
                                transition: reduceMotion
                                    ? undefined
                                    : `grid-template-rows ${PANEL_HEIGHT_MS}s ${PANEL_HEIGHT_EASE}`,
                            }}
                        >
                            <div style={{ minHeight: 0, overflow: "hidden" }}>
                                <div
                                    style={{
                                        padding: `0 ${spacings.sizeMedium} ${spacings.sizeMedium}`,
                                        ...typographys.body4,
                                        color: colors.primaryBlack,
                                        opacity: isOpen ? 1 : 0,
                                        transform: isOpen ? "translate3d(0, 0, 0)" : "translate3d(0, -6px, 0)",
                                        transition: reduceMotion
                                            ? undefined
                                            : `opacity ${PANEL_CONTENT_MS}s ${PANEL_CONTENT_EASE}, transform ${PANEL_CONTENT_MS}s ${PANEL_CONTENT_EASE}`,
                                        pointerEvents: isOpen ? undefined : "none",
                                    }}
                                >
                                    {item.content}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
