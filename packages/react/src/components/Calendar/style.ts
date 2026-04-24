export const calendarStyles = {
    grid7: "[grid-template-columns:repeat(7,var(--refineui-size-calendar-day-size))]",
    dayBase:
        "refineui-typo-caption-1 box-border inline-flex size-refineui-calendar-day-size min-h-refineui-calendar-day-size min-w-refineui-calendar-day-size cursor-pointer items-center justify-center border-none p-0",
    daySelected: "rounded-refineui-large bg-refineui-alias-background-brand text-refineui-alias-foreground-inversed",
    dayRangeMiddle:
        "rounded-refineui-none bg-refineui-alias-background-primary-hover text-refineui-alias-foreground-primary",
    dayDefault: "rounded-refineui-large bg-transparent text-refineui-alias-foreground-primary",
    dayOtherMonthDefault: "rounded-refineui-large bg-transparent text-refineui-alias-foreground-disabled",
    dayWrapEndpoint: "box-border flex size-refineui-calendar-day-size items-center justify-center bg-refineui-alias-background-primary-hover",
    dayWrapEndpointStart: "rounded-l-refineui-large",
    dayWrapEndpointEnd: "rounded-r-refineui-large",
    root:
        "box-border flex w-fit min-w-refineui-calendar-min-width flex-col gap-refineui-size-none rounded-refineui-large border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-primary p-refineui-size-large",
    header: "flex w-full min-w-0 items-start justify-between px-refineui-size-small pb-refineui-size-medium",
    navButton: "shrink-0 text-refineui-alias-foreground-primary",
    captionButton: "shrink-0",
    body: "flex flex-col gap-refineui-size-small",
    weekday:
        "refineui-typo-caption-1 box-border w-refineui-calendar-day-size py-refineui-size-small text-center text-refineui-alias-foreground-primary",
} as const;

