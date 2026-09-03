import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

/**
 * Stepper — multi-step progress rail.
 * Markers share Calendar day cell selection language (`rounded-large`, brand fill).
 * Connectors are straight rails between marker edges — not pill/circle tracks.
 */
const INDICATOR_CENTER_OFFSET =
    "calc((var(--refineui-size-calendar-day-size) - var(--refineui-size-progress-track-height-sm)) / 2)";

/** Half of calendar day size — inset so the rail meets the cell edge, not the center. */
const INDICATOR_HALF = "calc(var(--refineui-size-calendar-day-size) / 2)";

/** Vertical rail tuck under the opaque indicator. */
const CONNECTOR_OVERLAP = "var(--refineui-size-foundation-size-80)";

export const stepperStyles = {
    root: "box-border w-full outline-none",

    list: "m-0 flex list-none p-0",
    listHorizontal: "w-full flex-row items-start gap-0",
    listVertical: "w-full flex-col gap-0",

    item: clsx(
        "relative z-[1] box-border flex min-w-0",
        "outline-none transition-opacity duration-[var(--refineui-motion-duration-fast)]",
    ),
    /** Equal columns; marker centered above labels so the rail can meet the cells. */
    itemHorizontal: "flex-1 flex-col items-center gap-refineui-size-small",
    itemVertical: "w-full flex-row items-start gap-refineui-size-medium",
    itemInteractive: clsx(
        "cursor-pointer rounded-refineui-medium",
        "focus-visible:ring-2 focus-visible:ring-refineui-alias-border-focus focus-visible:ring-offset-2",
        "hover:[&_[data-refineui=stepper-indicator][data-state=upcoming]]:bg-refineui-alias-background-primary-hover",
        "hover:[&_[data-refineui=stepper-indicator][data-state=upcoming]]:border-refineui-alias-border-strong",
        "hover:[&_[data-refineui=stepper-indicator][data-state=upcoming]]:text-refineui-alias-foreground-primary-hover",
        "hover:[&_[data-refineui=stepper-title][data-state=upcoming]]:text-refineui-alias-foreground-primary",
    ),
    itemDisabled: "cursor-not-allowed opacity-50",

    indicator: clsx(
        componentTextClass(componentTypographyTokens.stepper.indicator),
        "relative z-[1] box-border inline-flex size-refineui-calendar-day-size shrink-0",
        "min-h-refineui-calendar-day-size min-w-refineui-calendar-day-size",
        "items-center justify-center overflow-hidden rounded-refineui-large border-refineui-thin p-0",
        "font-medium",
        "transition-[background-color,border-color,color]",
        "duration-[var(--refineui-motion-duration-medium)]",
        "ease-[var(--refineui-motion-easing-emphasized)]",
    ),
    indicatorComplete: clsx(
        "border-refineui-alias-background-brand bg-refineui-alias-background-brand text-refineui-alias-foreground-inversed",
    ),
    indicatorCurrent: clsx(
        "border-refineui-alias-background-brand bg-refineui-alias-background-brand text-refineui-alias-foreground-inversed",
    ),
    indicatorUpcoming: clsx(
        "border-refineui-alias-border-default bg-transparent text-refineui-alias-foreground-secondary",
    ),

    content: "flex min-w-0 flex-col gap-refineui-size-xxx-small",
    contentHorizontal: "items-center text-center",
    contentVertical: "items-start pt-refineui-size-xxx-small text-start",

    title: clsx(
        componentTextClass(componentTypographyTokens.stepper.title),
        "m-0 font-medium transition-colors duration-[var(--refineui-motion-duration-fast)]",
    ),
    titleComplete: "text-refineui-alias-foreground-primary",
    titleCurrent: "text-refineui-alias-foreground-brand",
    titleUpcoming: "text-refineui-alias-foreground-secondary",

    description: clsx(
        componentTextClass(componentTypographyTokens.stepper.description),
        "m-0 transition-colors duration-[var(--refineui-motion-duration-fast)]",
    ),
    descriptionComplete: "text-refineui-alias-foreground-secondary",
    descriptionCurrent: "text-refineui-alias-foreground-secondary",
    descriptionUpcoming: "text-refineui-alias-foreground-tertiary",

    /** Flex slot between equal columns — straight track + animated fill. */
    separator: "pointer-events-none relative z-0 box-border list-none",
    separatorHorizontal: clsx(
        "min-w-[var(--refineui-size-foundation-size-240)] flex-1 self-start",
        "h-refineui-calendar-day-size",
    ),
    separatorVertical: clsx(
        "w-refineui-calendar-day-size shrink-0 self-start",
        "min-h-[var(--refineui-size-foundation-size-400)]",
    ),

    /**
     * Equal flex item + separator widths → `-50%` reaches the adjacent column center;
     * inset by half the marker size so the stroke meets the cell edge.
     */
    separatorRail: "absolute overflow-hidden",
    separatorRailHorizontal: clsx(
        "h-refineui-progress-track-height-sm",
        "top-[var(--refineui-stepper-indicator-center)]",
        "start-[calc(-50%+var(--refineui-stepper-indicator-half))]",
        "end-[calc(-50%+var(--refineui-stepper-indicator-half))]",
    ),
    separatorRailVertical: clsx(
        "w-refineui-progress-track-height-sm",
        "start-[var(--refineui-stepper-indicator-center)]",
        "top-[calc(-1*var(--refineui-stepper-connector-overlap))]",
        "bottom-[calc(-1*var(--refineui-stepper-connector-overlap))]",
    ),

    separatorTrack: "absolute inset-0 bg-refineui-alias-border-default",

    separatorFill: clsx(
        "absolute inset-0 bg-refineui-alias-background-brand",
        "transition-transform duration-[var(--refineui-motion-duration-panel)]",
        "ease-[var(--refineui-motion-easing-emphasized)]",
        "motion-reduce:transition-none",
    ),
    separatorFillHorizontal: "origin-left scale-x-0 data-[state=complete]:scale-x-100",
    separatorFillVertical: "origin-top scale-y-0 data-[state=complete]:scale-y-100",
} as const;

export const stepperConnectorVars = {
    ["--refineui-stepper-indicator-center" as string]: INDICATOR_CENTER_OFFSET,
    ["--refineui-stepper-indicator-half" as string]: INDICATOR_HALF,
    ["--refineui-stepper-connector-overlap" as string]: CONNECTOR_OVERLAP,
} as const;
