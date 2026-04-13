import { clsx } from "clsx";
import type { CSSProperties, FocusEvent, HTMLAttributes, KeyboardEvent, MouseEvent, ReactElement, ReactNode } from "react";
import { cloneElement, isValidElement, useId, useRef, useState } from "react";
import { colors, spacings } from "@refineui/tokens";

export type TooltipVariant = "default" | "inverted";

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "content"> {
    trigger: ReactNode;
    content: ReactNode;
    placement?: "top" | "bottom" | "left" | "right";
    variant?: TooltipVariant;
    /** 표시 전 지연 (ms) — Web Kit 툴팁 동작에 가깝게 */
    delayMs?: number;
}

type TriggerMerge = {
    onMouseEnter?: (e: MouseEvent<HTMLElement>) => void;
    onMouseLeave?: (e: MouseEvent<HTMLElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
    "aria-describedby"?: string;
};

export function Tooltip({
    trigger,
    content,
    placement = "top",
    variant = "default",
    delayMs = 120,
    className,
    ...props
}: TooltipProps) {
    const [open, setOpen] = useState(false);
    const tooltipId = useId();
    const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isInverted = variant === "inverted";
    const bg = isInverted ? colors.primaryBlack : colors.neutralWhite;

    const clearTimer = () => {
        if (showTimer.current != null) {
            clearTimeout(showTimer.current);
            showTimer.current = null;
        }
    };

    const scheduleShow = () => {
        clearTimer();
        showTimer.current = setTimeout(() => setOpen(true), delayMs);
    };

    const hide = () => {
        clearTimer();
        setOpen(false);
    };

    const placementStyles: Record<string, CSSProperties> = {
        top: { bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: spacings.sizeXSmall },
        bottom: { top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: spacings.sizeXSmall },
        left: { right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: spacings.sizeXSmall },
        right: { left: "100%", top: "50%", transform: "translateY(-50%)", marginLeft: spacings.sizeXSmall },
    };

    const arrowHalf = Number.parseInt(spacings.sizeSmall, 10) || 6;
    const arrowStyle: CSSProperties = (() => {
        const c = bg;
        const b = arrowHalf;
        const z: CSSProperties = { position: "absolute", width: 0, height: 0 };
        if (placement === "top") {
            return {
                ...z,
                bottom: -b,
                left: "50%",
                marginLeft: -b,
                borderLeft: `${b}px solid transparent`,
                borderRight: `${b}px solid transparent`,
                borderTop: `${b}px solid ${c}`,
            };
        }
        if (placement === "bottom") {
            return {
                ...z,
                top: -b,
                left: "50%",
                marginLeft: -b,
                borderLeft: `${b}px solid transparent`,
                borderRight: `${b}px solid transparent`,
                borderBottom: `${b}px solid ${c}`,
            };
        }
        if (placement === "left") {
            return {
                ...z,
                right: -b,
                top: "50%",
                marginTop: -b,
                borderTop: `${b}px solid transparent`,
                borderBottom: `${b}px solid transparent`,
                borderRight: `${b}px solid ${c}`,
            };
        }
        return {
            ...z,
            left: -b,
            top: "50%",
            marginTop: -b,
            borderTop: `${b}px solid transparent`,
            borderBottom: `${b}px solid transparent`,
            borderLeft: `${b}px solid ${c}`,
        };
    })();

    const mergeTrigger = () => {
        const describedBy = open ? tooltipId : undefined;
        if (isValidElement(trigger)) {
            const el = trigger as ReactElement<TriggerMerge>;
            const prev = el.props["aria-describedby"];
            return cloneElement(el, {
                "aria-describedby": prev && describedBy ? `${prev} ${describedBy}` : describedBy ?? prev,
                onMouseEnter: (e: MouseEvent<HTMLElement>) => {
                    el.props.onMouseEnter?.(e);
                    scheduleShow();
                },
                onMouseLeave: (e: MouseEvent<HTMLElement>) => {
                    el.props.onMouseLeave?.(e);
                    hide();
                },
                onFocus: (e: FocusEvent<HTMLElement>) => {
                    el.props.onFocus?.(e);
                    scheduleShow();
                },
                onBlur: (e: FocusEvent<HTMLElement>) => {
                    el.props.onBlur?.(e);
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) hide();
                },
                onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
                    el.props.onKeyDown?.(e);
                    if (e.key === "Escape") hide();
                },
            } as Partial<TriggerMerge>);
        }
        return (
            <span
                tabIndex={0}
                aria-describedby={describedBy}
                onMouseEnter={scheduleShow}
                onMouseLeave={hide}
                onFocus={scheduleShow}
                onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) hide();
                }}
                onKeyDown={(e) => e.key === "Escape" && hide()}
                className="inline-flex outline-none"
            >
                {trigger}
            </span>
        );
    };

    return (
        <div data-refineui="tooltip" data-tooltip-variant={variant} className={clsx("relative inline-block", className)} {...props}>
            {mergeTrigger()}
            {open && (
                <div
                    id={tooltipId}
                    role="tooltip"
                    data-placement={placement}
                    className={clsx(
                        "refineui-typo-body-4 pointer-events-none absolute z-refineui-popup max-w-refineui-tooltip-max-width whitespace-nowrap px-refineui-size-medium py-refineui-size-small rounded-refineui-medium",
                        isInverted
                            ? "bg-refineui-primary-black text-refineui-neutral-white shadow-refineui-8dark"
                            : "bg-refineui-neutral-white text-refineui-primary-black shadow-refineui-8light",
                    )}
                    style={placementStyles[placement]}
                >
                    {content}
                    <span aria-hidden style={arrowStyle} />
                </div>
            )}
        </div>
    );
}
