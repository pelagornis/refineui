import { clsx } from "clsx";
import type { CSSProperties, FocusEvent, KeyboardEvent, MouseEvent, ReactElement } from "react";
import { cloneElement, useId, useRef, useState } from "react";
import { spacings } from "@refineui/tokens";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { getMergeableTriggerChild } from "../../utils/mergeTriggerChild";
import { tooltipStyles } from "./style";
import type { TooltipProps, TooltipVariant } from "./types";

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
    const bg = isInverted
        ? resolveColorTokenValue(componentColorTokens.tooltip.inverted.background)
        : resolveColorTokenValue(componentColorTokens.tooltip.default.background);
    const fg = isInverted
        ? resolveColorTokenValue(componentColorTokens.tooltip.inverted.foreground)
        : resolveColorTokenValue(componentColorTokens.tooltip.default.foreground);

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
        const mergeEl = getMergeableTriggerChild(trigger);
        if (mergeEl) {
            const el = mergeEl as ReactElement<TriggerMerge>;
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
                className={tooltipStyles.fallbackTrigger}
            >
                {trigger}
            </span>
        );
    };

    return (
        <div
            data-refineui="tooltip"
            data-tooltip-variant={variant}
            className={clsx(tooltipStyles.root, className)}
            {...props}
        >
            {mergeTrigger()}
            {open && (
                <div
                    id={tooltipId}
                    role="tooltip"
                    data-placement={placement}
                    className={clsx(
                        tooltipStyles.panel,
                        isInverted ? tooltipStyles.panelInvertedShadow : tooltipStyles.panelDefaultShadow,
                    )}
                    style={{
                        ...placementStyles[placement],
                        backgroundColor: bg,
                        color: fg,
                    }}
                >
                    {content}
                    <span aria-hidden style={arrowStyle} />
                </div>
            )}
        </div>
    );
}
