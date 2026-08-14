import type { HTMLAttributes, SVGAttributes } from "react";
import type { componentColorTokens } from "../../tokens/componentColorTokens";

export type ChartSeriesColor = keyof typeof componentColorTokens.chart.series;

/** Interaction state on a bar / point — same vocabulary as Card / Table. */
export type ChartItemState = "default" | "hover" | "selected";

export interface ChartProps extends HTMLAttributes<HTMLDivElement> {}

export interface ChartBodyProps extends HTMLAttributes<HTMLDivElement> {}

export interface ChartContentProps extends HTMLAttributes<HTMLDivElement> {}

export interface ChartPlotProps extends HTMLAttributes<HTMLDivElement> {
    /** Accessible name for the chart graphic. */
    "aria-label"?: string;
}

export interface ChartGridProps extends Omit<SVGAttributes<SVGGElement>, "values"> {
    /** Horizontal grid line count (includes baseline). Default `5`. */
    lines?: number;
    /** Y scale maximum — auto-derived from `values` when omitted. */
    max?: number;
    /** Source values used to derive a nice scale when `max` is omitted. */
    values?: number[];
}

export interface ChartBarsProps extends Omit<SVGAttributes<SVGGElement>, "color" | "values"> {
    values: number[];
    max?: number;
    seriesColor?: ChartSeriesColor;
    /** Full-height track behind each bar. Default `false`. */
    showTrack?: boolean;
}

export interface ChartLineProps extends Omit<SVGAttributes<SVGGElement>, "color" | "values"> {
    values: number[];
    max?: number;
    seriesColor?: ChartSeriesColor;
    /** Area fill under the line. Default `false`. */
    showArea?: boolean;
    /** Point markers on each value. Default `false` (hover still shows the active point). */
    showPoints?: boolean;
}

export interface ChartYAxisLabelsProps extends HTMLAttributes<HTMLDivElement> {
    lines?: number;
    max?: number;
    values?: number[];
    formatTick?: (value: number) => string;
}

export interface ChartAxisLabelsProps extends HTMLAttributes<HTMLDivElement> {
    labels: string[];
    /** `bar` centers on band slots; `line` centers on point positions. Default `bar`. */
    align?: "bar" | "line";
}

export interface ChartTooltipProps extends HTMLAttributes<HTMLDivElement> {}

export interface ChartLegendProps extends HTMLAttributes<HTMLUListElement> {}

export interface ChartLegendItemProps extends HTMLAttributes<HTMLLIElement> {
    seriesColor: ChartSeriesColor;
}
