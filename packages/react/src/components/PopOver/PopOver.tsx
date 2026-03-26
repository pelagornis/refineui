import type { HTMLAttributes, KeyboardEvent, MouseEvent, ReactElement, ReactNode, Ref } from "react";
import { cloneElement, isValidElement, useCallback, useEffect, useId, useRef, useState } from "react";
import { colors, spacings, borderRadii, shadows, toBoxShadow, zIndex, strokeWidths } from "@refineui/tokens";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { composeRef } from "../../utils/composeRef";

export interface PopOverProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "content"> {
    trigger: ReactNode;
    content: ReactNode;
    placement?: "top" | "bottom" | "left" | "right";
}

type TriggerProps = {
    onClick?: (e: MouseEvent<HTMLElement>) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
};

type TriggerElement = ReactElement<TriggerProps> & { ref?: Ref<HTMLElement | null> };

export function PopOver({ trigger, content, placement = "bottom", style, ...props }: PopOverProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const contentId = useId();

    useFocusTrap(open, contentRef);

    useEffect(() => {
        const handler = (e: globalThis.MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
        };
        if (open) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    useEffect(() => {
        const onKey = (e: Event) => {
            if (e instanceof KeyboardEvent && e.key === "Escape") setOpen(false);
        };
        if (open) document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open]);

    const toggle = () => setOpen((o) => !o);

    const onTriggerKeyDown = (e: KeyboardEvent<HTMLElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
        }
    };

    const renderTrigger = () => {
        if (isValidElement(trigger)) {
            const el = trigger as TriggerElement;
            return cloneElement(el, {
                ref: composeRef(triggerRef, el.ref),
                "aria-expanded": open,
                "aria-haspopup": "dialog" as const,
                "aria-controls": contentId,
                onClick: (e: MouseEvent<HTMLElement>) => {
                    el.props.onClick?.(e);
                    toggle();
                },
                onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
                    el.props.onKeyDown?.(e);
                    onTriggerKeyDown(e);
                },
            } as Partial<TriggerProps>);
        }
        return (
            <button
                type="button"
                ref={triggerRef as React.RefObject<HTMLButtonElement>}
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-controls={contentId}
                onClick={toggle}
                onKeyDown={(e) => onTriggerKeyDown(e)}
                style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    padding: 0,
                    font: "inherit",
                    color: "inherit",
                }}
            >
                {trigger}
            </button>
        );
    };

    const placementStyles: Record<string, React.CSSProperties> = {
        top: { bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: spacings.sizeXSmall },
        bottom: { top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: spacings.sizeXSmall },
        left: { right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: spacings.sizeXSmall },
        right: { left: "100%", top: "50%", transform: "translateY(-50%)", marginLeft: spacings.sizeXSmall },
    };

    return (
        <div
            ref={containerRef}
            data-refineui="popover"
            style={{ position: "relative", display: "inline-block", ...style }}
            {...props}
        >
            {renderTrigger()}
            {open && (
                <div
                    ref={contentRef}
                    id={contentId}
                    role="dialog"
                    aria-modal="false"
                    tabIndex={-1}
                    style={{
                        position: "absolute",
                        ...placementStyles[placement],
                        padding: spacings.sizeMedium,
                        backgroundColor: colors.neutralWhite,
                        borderRadius: borderRadii.roundedMedium,
                        boxShadow: toBoxShadow(shadows.shadow4Light),
                        border: `${strokeWidths.strokeWidthThin} solid ${colors.neutral300}`,
                        zIndex: zIndex.zIndexPopup,
                        outline: "none",
                    }}
                >
                    {content}
                </div>
            )}
        </div>
    );
}
