import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass, semanticTextClass } from "../../typography";

export const calendarStyles = {
    grid7: "[grid-template-columns:repeat(7,var(--refineui-size-calendar-day-size))]",
    dayBase: clsx(
        componentTextClass(componentTypographyTokens.calendar.day),
        "box-border inline-flex size-refineui-calendar-day-size min-h-refineui-calendar-day-size min-w-refineui-calendar-day-size cursor-pointer items-center justify-center border-none p-0 transition-[background-color,color,transform] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)] motion-reduce:transition-none hover:bg-refineui-alias-background-primary-hover hover:text-refineui-alias-foreground-primary-hover active:bg-refineui-alias-background-primary-active active:text-refineui-alias-foreground-primary active:scale-[var(--refineui-motion-scale-press)] disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-refineui-alias-foreground-disabled data-[inactive=true]:cursor-default data-[inactive=true]:hover:bg-transparent data-[inactive=true]:hover:text-refineui-alias-foreground-disabled",
    ),
    daySelected: "rounded-refineui-large bg-refineui-alias-background-brand text-refineui-alias-foreground-inversed",
    dayRangeMiddle:
        "rounded-refineui-none bg-refineui-alias-background-primary-hover text-refineui-alias-foreground-primary",
    dayDefault: "rounded-refineui-large bg-transparent text-refineui-alias-foreground-primary",
    dayOtherMonthDefault: "rounded-refineui-large bg-transparent text-refineui-alias-foreground-disabled",
    dayWrapEndpoint: "box-border flex size-refineui-calendar-day-size items-center justify-center bg-refineui-alias-background-primary-hover",
    dayWrapEndpointStart: "rounded-s-refineui-large",
    dayWrapEndpointEnd: "rounded-e-refineui-large",
    root:
        "box-border flex w-fit min-w-refineui-calendar-min-width flex-col gap-refineui-size-none rounded-refineui-xx-large border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-primary p-refineui-size-medium",
    /** Two months side by side: drop the single-month min width. */
    rootRange: "min-w-0",
    header: "flex w-full min-w-0 items-center justify-between pb-refineui-size-small",
    navButton: "shrink-0 text-refineui-alias-foreground-primary",
    captionButton: "shrink-0",
    body: "flex flex-col gap-refineui-size-xxx-small",
    months: "flex items-start gap-refineui-size-xx-large",
    monthPanel: "flex flex-col",
    monthHeader: "flex w-full min-w-0 items-center justify-between pb-refineui-size-small",
    /** Range-mode month caption: subtitleMd (16px, semibold) so it clearly reads as the header above the day grid. */
    monthCaption: clsx(
        semanticTextClass("subtitleMd"),
        "min-w-0 flex-1 truncate text-center text-refineui-alias-foreground-primary",
    ),
    /** Keeps the caption centered where the other panel has its arrow. */
    navSpacer: "inline-block size-refineui-control-height-sm shrink-0",
    dayPlaceholder: "size-refineui-calendar-day-size",
    weekday: clsx(
        componentTextClass(componentTypographyTokens.calendar.weekday),
        "box-border flex w-refineui-calendar-day-size items-center justify-center py-refineui-size-xx-small text-center text-refineui-alias-foreground-primary",
    ),
} as const;
