import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

/**
 * Stepper — multi-step progress rail.
 * Horizontal: stacked marker + label; connector spans between circle centers.
 * Vertical: left rail; connector overlaps opaque indicators.
 */
const INDICATOR_CENTER_OFFSET =
    "calc((var(--refineui-size-foundation-size-320) - var(--refineui-size-progress-track-height-sm)) / 2)";

/** Half of foundation 320 — inset so the rail meets the circle edge, not the center. */
const INDICATOR_RADIUS = "var(--refineui-size-foundation-size-160)";

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
    /** Equal columns; marker centered above labels so the rail can meet the circles. */
    itemHorizontal: "flex-1 flex-col items-center gap-refineui-size-small",
    itemVertical: "w-full flex-row items-start gap-refineui-size-medium",
    itemInteractive: clsx(
        "cursor-pointer rounded-refineui-medium",
        "focus-visible:ring-2 focus-visible:ring-refineui-alias-border-focus focus-visible:ring-offset-2",
        "hover:[&_[data-refineui=stepper-indicator][data-state=upcoming]]:border-refineui-alias-border-strong",
        "hover:[&_[data-refineui=stepper-indicator][data-state=upcoming]]:bg-refineui-alias-background-surface-hover",
        "hover:[&_[data-refineui=stepper-title][data-state=upcoming]]:text-refineui-alias-foreground-primary",
    ),
    itemDisabled: "cursor-not-allowed opacity-50",

    indicator: clsx(
        componentTextClass(componentTypographyTokens.stepper.indicator),
        "relative z-[1] box-border inline-flex size-refineui-foundation-size-320 shrink-0",
        "items-center justify-center overflow-hidden rounded-refineui-circle",
        "border-refineui-thin font-medium",
        "transition-[background-color,border-color,color,box-shadow]",
        "duration-[var(--refineui-motion-duration-medium)]",
        "ease-[var(--refineui-motion-easing-emphasized)]",
    ),
    indicatorComplete: clsx(
        "border-refineui-alias-background-brand bg-refineui-alias-background-brand",
        "text-refineui-alias-foreground-on-brand shadow-refineui-2",
    ),
    indicatorCurrent: clsx(
        "border-refineui-alias-background-brand bg-refineui-alias-background-brand-subtle",
        "text-refineui-alias-foreground-brand shadow-refineui-2",
        "ring-2 ring-refineui-alias-background-brand-subtle",
    ),
    indicatorUpcoming: clsx(
        "border-refineui-alias-border-default bg-refineui-alias-background-primary",
        "text-refineui-alias-foreground-secondary",
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

    /** Flex slot between equal columns — track + animated fill. */
    separator: "pointer-events-none relative z-0 box-border list-none",
    separatorHorizontal: clsx(
        "min-w-[var(--refineui-size-foundation-size-240)] flex-1 self-start",
        "h-[var(--refineui-size-foundation-size-320)]",
    ),
    separatorVertical: clsx(
        "w-[var(--refineui-size-foundation-size-320)] shrink-0 self-start",
        "min-h-[var(--refineui-size-foundation-size-400)]",
    ),

    /**
     * Equal flex item + separator widths → `-50%` reaches the adjacent column center;
     * inset by indicator radius so the stroke meets the circle edge.
     */
    separatorRail: "absolute overflow-hidden rounded-refineui-circle",
    separatorRailHorizontal: clsx(
        "h-refineui-progress-track-height-sm",
        "top-[var(--refineui-stepper-indicator-center)]",
        "left-[calc(-50%+var(--refineui-stepper-indicator-radius))]",
        "right-[calc(-50%+var(--refineui-stepper-indicator-radius))]",
    ),
    separatorRailVertical: clsx(
        "w-refineui-progress-track-height-sm",
        "left-[var(--refineui-stepper-indicator-center)]",
        "top-[calc(-1*var(--refineui-stepper-connector-overlap))]",
        "bottom-[calc(-1*var(--refineui-stepper-connector-overlap))]",
    ),

    separatorTrack: "absolute inset-0 rounded-refineui-circle bg-refineui-alias-border-default",

    separatorFill: clsx(
        "absolute inset-0 rounded-refineui-circle bg-refineui-alias-background-brand",
        "transition-transform duration-[var(--refineui-motion-duration-panel)]",
        "ease-[var(--refineui-motion-easing-emphasized)]",
        "motion-reduce:transition-none",
    ),
    separatorFillHorizontal: "origin-left scale-x-0 data-[state=complete]:scale-x-100",
    separatorFillVertical: "origin-top scale-y-0 data-[state=complete]:scale-y-100",
} as const;

export const stepperConnectorVars = {
    ["--refineui-stepper-indicator-center" as string]: INDICATOR_CENTER_OFFSET,
    ["--refineui-stepper-indicator-radius" as string]: INDICATOR_RADIUS,
    ["--refineui-stepper-connector-overlap" as string]: CONNECTOR_OVERLAP,
} as const;
