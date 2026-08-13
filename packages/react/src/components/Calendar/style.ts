import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

export const calendarStyles = {
    grid7: "[grid-template-columns:repeat(7,var(--refineui-size-calendar-day-size))]",
    dayBase: clsx(
        componentTextClass(componentTypographyTokens.calendar.day),
        "box-border inline-flex size-refineui-calendar-day-size min-h-refineui-calendar-day-size min-w-refineui-calendar-day-size cursor-pointer items-center justify-center border-none p-0",
    ),
    daySelected: "rounded-refineui-large bg-refineui-alias-background-brand text-refineui-alias-foreground-inversed",
    dayRangeMiddle:
        "rounded-refineui-none bg-refineui-alias-background-primary-hover text-refineui-alias-foreground-primary",
    dayDefault: "rounded-refineui-large bg-transparent text-refineui-alias-foreground-primary",
    dayOtherMonthDefault: "rounded-refineui-large bg-transparent text-refineui-alias-foreground-disabled",
    dayWrapEndpoint: "box-border flex size-refineui-calendar-day-size items-center justify-center bg-refineui-alias-background-primary-hover",
    dayWrapEndpointStart: "rounded-l-refineui-large",
    dayWrapEndpointEnd: "rounded-r-refineui-large",
    root:
        "box-border flex w-fit min-w-refineui-calendar-min-width flex-col gap-refineui-size-none rounded-refineui-large bg-refineui-alias-background-primary p-refineui-size-x-large",
    header: "flex w-full min-w-0 items-center justify-between pb-refineui-size-large",
    navButton: "shrink-0 text-refineui-alias-foreground-primary",
    captionButton: "shrink-0",
    body: "flex flex-col gap-refineui-size-small",
    weekday: clsx(
        componentTextClass(componentTypographyTokens.calendar.weekday),
        "box-border flex w-refineui-calendar-day-size items-center justify-center py-refineui-size-x-small text-center text-refineui-alias-foreground-primary",
    ),
} as const;
