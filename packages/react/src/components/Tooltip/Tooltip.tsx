import { clsx } from "clsx";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import { cloneElement, useId, useRef, useState } from "react";
import { spacings } from "@refineui/tokens";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { getMergeableTriggerChild } from "@refineui/utilities/react";
import { tooltipArrowStyle, tooltipPanelStyle, tooltipStyles } from "./style";
import type { TooltipProps, TooltipTriggerMergeProps } from "./types";

export function Tooltip({
    trigger,
    content,
    position = "Bottom",
    align = "Start",
    delayMs = 120,
    className,
    ...props
}: TooltipProps) {
    const [open, setOpen] = useState(false);
    const tooltipId = useId();
    const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const bg = resolveColorTokenValue(componentColorTokens.tooltip.default.background);
    const fg = resolveColorTokenValue(componentColorTokens.tooltip.default.foreground);

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

    const arrowHalf = Number.parseInt(spacings.sizeXSmall, 10) || 6;
    const panelPos: CSSProperties = tooltipPanelStyle(position, align);
    const arrow: CSSProperties = tooltipArrowStyle(position, align, bg, arrowHalf);

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
                <div
                    id={tooltipId}
                    role="tooltip"
                    data-position={position}
                    data-align={align}
                    className={tooltipStyles.panel}
                    style={{
                        ...panelPos,
                        backgroundColor: bg,
                        color: fg,
                    }}
                >
                    {content}
                    <span aria-hidden style={arrow} />
                </div>
            )}
        </div>
    );
}
