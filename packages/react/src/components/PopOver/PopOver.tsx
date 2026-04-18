import { clsx } from "clsx";
import type { HTMLAttributes, KeyboardEvent, MouseEvent, ReactElement, ReactNode, Ref } from "react";
import { cloneElement, isValidElement, useEffect, useId, useRef, useState } from "react";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { composeRef } from "../../utils/composeRef";

export interface PopOverProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "content"> {
    trigger: ReactNode;
    content: ReactNode;
    placement?: "top" | "bottom" | "left" | "right";
    /** Web Kit COMPONENT_SET `PopOver` `553:5669` — `style` Default / Inverted */
    variant?: "default" | "inverted";
}

type TriggerProps = {
    onClick?: (e: MouseEvent<HTMLElement>) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
};

type TriggerElement = ReactElement<TriggerProps> & { ref?: Ref<HTMLElement | null> };

const placementMargin: Record<NonNullable<PopOverProps["placement"]>, string> = {
    top: "mb-refineui-size-xsmall",
    bottom: "mt-refineui-size-xsmall",
    left: "mr-refineui-size-xsmall",
    right: "ml-refineui-size-xsmall",
};

const placementPosition: Record<NonNullable<PopOverProps["placement"]>, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2",
    bottom: "top-full left-1/2 -translate-x-1/2",
    left: "right-full top-1/2 -translate-y-1/2",
    right: "left-full top-1/2 -translate-y-1/2",
};

/** Web Kit COMPONENT_SET `PopOver` `553:5669` — 화살표(beak)·정렬 서브변형은 미구현, 패널 토큰만 스펙에 맞춤. */
export function PopOver({
    trigger,
    content,
    placement = "bottom",
    variant = "default",
    className,
    ...props
}: PopOverProps) {
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

    const palette =
        variant === "inverted" ? componentColorTokens.popover.inverted : componentColorTokens.popover.default;

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
                className="cursor-pointer border-none bg-transparent p-0 font-inherit text-inherit"
                onClick={toggle}
                onKeyDown={(e) => onTriggerKeyDown(e)}
            >
                {trigger}
            </button>
        );
    };

    return (
        <div ref={containerRef} data-refineui="popover" className={clsx("relative inline-block", className)} {...props}>
            {renderTrigger()}
            {open && (
                <div
                    ref={contentRef}
                    id={contentId}
                    role="dialog"
                    aria-modal="false"
                    tabIndex={-1}
                    data-variant={variant}
                    className={clsx(
                        "absolute z-refineui-popup box-border min-w-refineui-popover-panel-width outline-none p-refineui-size-large rounded-refineui-large",
                        placementPosition[placement],
                        placementMargin[placement],
                        "border-refineui-thin",
                        variant === "inverted" ? "shadow-refineui-8dark" : "shadow-refineui-8light",
                    )}
                    style={{
                        backgroundColor: resolveColorTokenValue(palette.background),
                        color: resolveColorTokenValue(palette.foreground),
                        borderColor: resolveColorTokenValue(palette.border),
                    }}
                >
                    {content}
                </div>
            )}
        </div>
    );
}
