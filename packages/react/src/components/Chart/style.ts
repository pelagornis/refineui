import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

export const chartStyles = {
    root: "flex w-full min-w-0 flex-col gap-refineui-size-medium",
    body: "grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)] grid-rows-[minmax(0,1fr)_auto_auto] items-stretch gap-x-refineui-size-medium",
    plotColumn: "contents",
    plotFrame: "relative col-start-2 row-start-1 min-w-0",
    plot: "block h-auto w-full min-w-0 aspect-[5/2] overflow-visible",
    yAxis: "relative col-start-1 row-start-1 min-w-refineui-foundation-size-400 pe-refineui-size-x-small",
    yAxisTick: clsx(
        componentTextClass(componentTypographyTokens.chart.axisLabel),
        "absolute end-0 -translate-y-1/2 whitespace-nowrap text-end tabular-nums text-refineui-alias-foreground-tertiary",
    ),
    xAxis: "relative col-start-2 row-start-2 mt-refineui-size-small h-refineui-foundation-size-240",
    xAxisLabel: clsx(
        componentTextClass(componentTypographyTokens.chart.axisLabel),
        "absolute top-0 -translate-x-1/2 truncate text-refineui-alias-foreground-tertiary",
        "transition-colors duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
    ),
    xAxisLabelActive: "text-refineui-alias-foreground-primary",
    tooltip: clsx(
        "pointer-events-none absolute z-refineui-popup flex flex-col gap-refineui-size-xxx-small",
        "rounded-refineui-medium border-refineui-thin border-refineui-alias-border-default",
        "bg-refineui-alias-surface-popover px-refineui-size-medium py-refineui-size-small shadow-refineui-8light",
    ),
    tooltipLabel: clsx(
        componentTextClass(componentTypographyTokens.chart.tooltipLabel),
        "text-refineui-alias-foreground-secondary",
    ),
    tooltipValue: clsx(
        componentTextClass(componentTypographyTokens.chart.tooltipValue),
        "tabular-nums text-refineui-alias-foreground-primary",
    ),
    legend: "col-start-2 row-start-3 mt-refineui-size-medium flex flex-wrap items-center justify-start gap-x-refineui-size-x-large gap-y-refineui-size-x-small",
    legendItem: clsx(
        componentTextClass(componentTypographyTokens.chart.legendLabel),
        "flex items-center gap-refineui-size-x-small text-refineui-alias-foreground-secondary",
    ),
    legendSwatch: "size-refineui-foundation-size-80 shrink-0 rounded-refineui-small",
} as const;
