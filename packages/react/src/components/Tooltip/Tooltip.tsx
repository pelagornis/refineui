import { clsx } from "clsx";
import type { ReactNode } from "react";
import { useId, useRef, useState } from "react";
import { borderRadii } from "@refineui/tokens";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentSizes } from "../../componentSizes";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { Slot, getMergeableTriggerChild } from "@refineui/utilities/react";
import { FloatingSurface } from "../shared/FloatingSurface";
import {
    TOOLTIP_BEAK_INSET,
    tooltipAlignKey,
    tooltipBeakSide,
    tooltipFloatingStyle,
    tooltipStyles,
} from "./style";
import type { TooltipProps } from "./types";

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
    const panelRef = useRef<HTMLDivElement>(null);

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

    const describedBy = open ? tooltipId : undefined;
    const mergeEl = getMergeableTriggerChild(trigger);

    let triggerNode: ReactNode;
    if (mergeEl != null) {
        triggerNode = (
            <Slot
                aria-describedby={describedBy}
                onMouseEnter={scheduleShow}
                onMouseLeave={hide}
                onFocus={scheduleShow}
                onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node)) hide();
                }}
                onKeyDown={(event) => {
                    if (event.key === "Escape") hide();
                }}
            >
                {mergeEl}
            </Slot>
        );
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
                            ref={panelRef}
                            id={tooltipId}
                            role="tooltip"
                            data-refineui="tooltip-panel"
                            data-position={position}
                            data-align={align}
                            className={tooltipStyles.panel}
                            style={{ color: fg }}
                        >
                            {content}
                        </div>
                        <FloatingSurface
                            panelRef={panelRef}
                            side={tooltipBeakSide(position)}
                            align={tooltipAlignKey(align)}
                            radius={borderRadii.roundedMedium}
                            beakWidth={componentSizes.tooltipBeakWidth}
                            beakHeight={componentSizes.tooltipBeakHeight}
                            tipRadius={componentSizes.tooltipBeakTipRadius}
                            beakInsetStart={TOOLTIP_BEAK_INSET}
                            beakInsetEnd={TOOLTIP_BEAK_INSET}
                            backgroundColor={bg}
                            borderColor={borderCol}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
