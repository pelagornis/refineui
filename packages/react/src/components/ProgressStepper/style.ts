import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

/**
 * Track is a 16px pill. End inset matches the cap radius so first/last
 * pips sit on the straight run without extra lead/trail length.
 * Fill stays a pill; width is current pip plus the fill cap radius so the
 * round tip sits after the pip instead of wrapping it.
 */
export const progressStepperVars = {
    ["--refineui-progress-stepper-track" as string]: "var(--refineui-size-foundation-size-160)",
    ["--refineui-progress-stepper-pip" as string]: "var(--refineui-size-foundation-size-80)",
    ["--refineui-progress-stepper-inset" as string]: "var(--refineui-size-foundation-size-80)",
} as const;

export const progressStepperStyles = {
    root: "box-border w-full outline-none",

    listWrap: "relative w-full overflow-visible",

    track: clsx(
        "pointer-events-none absolute start-0 end-0 top-0 z-0 w-full overflow-hidden rounded-refineui-circle",
        "h-[var(--refineui-progress-stepper-track)]",
        "bg-refineui-alias-background-brand-subtle",
    ),
    fill: clsx(
        "block h-full min-w-0 rounded-refineui-circle bg-refineui-alias-background-brand",
        "transition-[width] duration-[var(--refineui-motion-duration-panel)]",
        "ease-[var(--refineui-motion-easing-emphasized)]",
        "motion-reduce:transition-none",
    ),

    list: "relative z-[1] m-0 flex w-full list-none flex-row items-start gap-0 p-0",

    item: clsx(
        "group/step z-[1] box-border flex min-w-0 flex-1 flex-col",
        "pt-[calc(var(--refineui-progress-stepper-track)+var(--refineui-spacing-size-x-small))]",
        "overflow-visible outline-none",
        "transition-opacity duration-[var(--refineui-motion-duration-fast)]",
    ),
    itemInteractive: clsx(
        "cursor-pointer",
        "focus-visible:[&_[data-refineui=progress-stepper-marker]]:ring-2",
        "focus-visible:[&_[data-refineui=progress-stepper-marker]]:ring-refineui-alias-border-focus",
        "hover:[&_[data-refineui=progress-stepper-marker][data-state=upcoming]]:bg-refineui-alias-foreground-secondary",
        "hover:[&_[data-refineui=progress-stepper-label][data-state=upcoming]]:text-refineui-alias-foreground-secondary",
    ),
    itemDisabled: "cursor-not-allowed opacity-50",

    marker: clsx(
        componentTextClass(componentTypographyTokens.progressStepper.marker),
        "absolute box-border inline-flex size-[var(--refineui-progress-stepper-pip)] shrink-0 overflow-hidden",
        "items-center justify-center rounded-refineui-circle border-0",
        "top-[calc((var(--refineui-progress-stepper-track)-var(--refineui-progress-stepper-pip))/2)]",
        "transition-colors duration-[var(--refineui-motion-duration-fast)]",
        "motion-reduce:transition-none",
    ),
    markerComplete: "bg-refineui-alias-foreground-on-brand",
    markerCurrent: "bg-refineui-alias-foreground-on-brand",
    markerUpcoming: "bg-refineui-alias-border-default",

    label: clsx(
        componentTextClass(componentTypographyTokens.progressStepper.label),
        /**
         * Truncates because steps split the track evenly (`flex-1`), so a narrow
         * container can hand a label less width than its text needs. Labels are
         * usually single words with no break opportunity, and the item is
         * `overflow-visible` for the absolute marker — without this the text
         * would paint over the neighbouring step instead of wrapping.
         */
        "m-0 w-full truncate text-center",
        "group-first/step:pl-[var(--refineui-progress-stepper-inset)] group-first/step:text-start",
        "group-last/step:pr-[var(--refineui-progress-stepper-inset)] group-last/step:text-end",
        "transition-colors duration-[var(--refineui-motion-duration-fast)]",
    ),
    labelComplete: "text-refineui-alias-foreground-primary",
    labelCurrent: "font-medium text-refineui-alias-foreground-brand",
    labelUpcoming: "text-refineui-alias-foreground-tertiary",
} as const;
