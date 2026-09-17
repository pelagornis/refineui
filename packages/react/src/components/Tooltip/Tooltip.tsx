import { clsx } from "clsx";
import type { ReactElement, ReactNode } from "react";
import { cloneElement, useId, useRef, useState } from "react";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { getMergeableTriggerChild } from "@refineui/utilities/react";
import {
    TOOLTIP_BEAK_H,
    TOOLTIP_BEAK_W,
    tooltipBeakRotateDeg,
    tooltipBeakWrapperStyle,
    tooltipFloatingStyle,
    tooltipStyles,
} from "./style";
import type { TooltipProps, TooltipTriggerMergeProps } from "./types";

export function Tooltip({
    trigger,
    content,
    position = "Bottom",
    align = "Start",
    delayMs = 120,
    open: ctrlOpen,
    defaultOpen = false,
    onOpenChange,
    className,
    ...props
}: TooltipProps) {
    const [innerOpen, setInnerOpen] = useState(defaultOpen);
    const open = ctrlOpen !== undefined ? ctrlOpen : innerOpen;
    const tooltipId = useId();
    const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const setOpen = (next: boolean) => {
        if (ctrlOpen === undefined) setInnerOpen(next);
        onOpenChange?.(next);
    };

    const tipColor = componentColorTokens.tooltip.default;
    const bg = resolveColorTokenValue(tipColor.background);
    const fg = resolveColorTokenValue(tipColor.foreground);
    const borderCol = resolveColorTokenValue(tipColor.border);

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

    const floatingStyle = tooltipFloatingStyle(position, align);
    const beakWrapStyle = tooltipBeakWrapperStyle(position, align);
    const beakRot = tooltipBeakRotateDeg(position);

    const describedBy = open ? tooltipId : undefined;
    const mergeEl = getMergeableTriggerChild(trigger);

    let triggerNode: ReactNode;
    if (mergeEl != null) {
        const el = mergeEl as ReactElement<TooltipTriggerMergeProps>;
        const prevDescribedBy = el.props["aria-describedby"];
        triggerNode = cloneElement(el, {
            "aria-describedby":
                prevDescribedBy && describedBy
                    ? `${prevDescribedBy} ${describedBy}`
                    : describedBy ?? prevDescribedBy,
            onMouseEnter: (e) => {
                el.props.onMouseEnter?.(e);
                scheduleShow();
            },
            onMouseLeave: (e) => {
                el.props.onMouseLeave?.(e);
                hide();
            },
            onFocus: (e) => {
                el.props.onFocus?.(e);
                scheduleShow();
            },
            onBlur: (e) => {
                el.props.onBlur?.(e);
                if (!e.currentTarget.contains(e.relatedTarget as Node)) hide();
            },
            onKeyDown: (e) => {
                el.props.onKeyDown?.(e);
                if (e.key === "Escape") hide();
            },
        } as Partial<TooltipTriggerMergeProps>);
    } else {
        triggerNode = (
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
    }

    return (
        <div data-refineui="tooltip" className={clsx(tooltipStyles.root, className)} {...props}>
            {triggerNode}
            {open && (
                <div className={tooltipStyles.floating} style={floatingStyle}>
                    <div className={tooltipStyles.panelWrap}>
                        <div
                            className={tooltipStyles.beakWrap}
                            style={{ ...beakWrapStyle, width: TOOLTIP_BEAK_W, height: TOOLTIP_BEAK_H }}
                            aria-hidden
                        >
                            <div
                                style={{
                                    width: TOOLTIP_BEAK_W,
                                    height: TOOLTIP_BEAK_H,
                                    transform: `rotate(${beakRot}deg)`,
                                    transformOrigin: "center center",
                                }}
                            >
                                <svg
                                    width={TOOLTIP_BEAK_W}
                                    height={TOOLTIP_BEAK_H}
                                    viewBox="0 0 16 8"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ display: "block" }}
                                >
                                    <polygon points="8,0 0,8 16,8" fill={borderCol} />
                                    <polygon points="8,2 2,8 14,8" fill={bg} />
                                </svg>
                            </div>
                        </div>
                        <div
                            id={tooltipId}
                            role="tooltip"
                            data-refineui="tooltip-panel"
                            data-position={position}
                            data-align={align}
                            className={tooltipStyles.panel}
                            style={{
                                backgroundColor: bg,
                                color: fg,
                                borderColor: borderCol,
                            }}
                        >
                            {content}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
