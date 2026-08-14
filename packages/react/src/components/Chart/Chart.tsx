import { clsx } from "clsx";
import {
    Children,
    createContext,
    isValidElement,
    useContext,
    useId,
    useLayoutEffect,
    useMemo,
    useState,
    type ReactElement,
    type ReactNode,
} from "react";
import { opacities } from "@refineui/tokens";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { chartStyles } from "./style";
import type {
    ChartAxisLabelsProps,
    ChartBarsProps,
    ChartBodyProps,
    ChartContentProps,
    ChartGridProps,
    ChartItemState,
    ChartLegendItemProps,
    ChartLegendProps,
    ChartLineProps,
    ChartPlotProps,
    ChartProps,
    ChartSeriesColor,
    ChartTooltipProps,
    ChartYAxisLabelsProps,
} from "./types";
import {
    CHART_BAR_RADIUS,
    CHART_PLOT_PADDING_TOP,
    CHART_PLOT_PADDING_X,
    CHART_POINT_RADIUS,
    CHART_POINT_STROKE,
    CHART_TOOLTIP_FLIP_X,
    CHART_TOOLTIP_FLIP_Y,
    CHART_VIEWBOX_HEIGHT,
    CHART_VIEWBOX_WIDTH,
    barBandCenterRatio,
    barLayout,
    barPathTopRounded,
    barX,
    formatAxisTick,
    gridLineY,
    hoverIndexFromPlotX,
    linePointCenterRatio,
    linePointCoords,
    monotoneAreaPath,
    monotoneLinePath,
    plotBaselineY,
    plotHeight,
    plotWidth,
    pointerFromClient,
    resolveChartScale,
    valueToY,
    viewBoxXToPercent,
    viewBoxYToPercent,
    yAxisTicks,
} from "./utils";

type ChartSeriesSnapshot = {
    values: number[];
    seriesColor: ChartSeriesColor;
    max?: number;
    align: "bar" | "line";
};

type ChartPointer = {
    x: number;
    y: number;
};

type ChartContextValue = {
    hoverIndex: number | null;
    selectedIndex: number | null;
    pointer: ChartPointer | null;
    setHoverIndex: (index: number | null) => void;
    setSelectedIndex: (index: number | null) => void;
    setPointer: (pointer: ChartPointer | null) => void;
    labels: string[];
    setLabels: (labels: string[]) => void;
    series: ChartSeriesSnapshot | null;
    setSeries: (series: ChartSeriesSnapshot) => void;
};

const ChartContext = createContext<ChartContextValue | null>(null);

function useChartContext(component: string): ChartContextValue {
    const value = useContext(ChartContext);
    if (!value) throw new Error(`${component} must be used within Chart.`);
    return value;
}

function seriesColorToken(color: ChartSeriesColor) {
    return resolveColorTokenValue(componentColorTokens.chart.series[color]);
}

function seriesSubtleToken(color: ChartSeriesColor) {
    return resolveColorTokenValue(componentColorTokens.chart.seriesSubtle[color]);
}

function gridStroke() {
    return resolveColorTokenValue(componentColorTokens.chart.grid);
}

function gridBaselineStroke() {
    return resolveColorTokenValue(componentColorTokens.chart.gridBaseline);
}

function pointStrokeColor() {
    return resolveColorTokenValue(componentColorTokens.chart.pointStroke);
}

function resolveScale(values: number[] | undefined, max: number | undefined, fallbackMax = 100) {
    if (max !== undefined && max > 0) return max;
    if (values && values.length > 0) return resolveChartScale(values, max);
    return fallbackMax;
}

function itemState(
    index: number,
    hoverIndex: number | null,
    selectedIndex: number | null,
): ChartItemState {
    if (selectedIndex === index) return "selected";
    if (hoverIndex === index) return "hover";
    return "default";
}

function isChartTooltipElement(node: ReactNode): node is ReactElement<ChartTooltipProps> {
    return isValidElement(node) && node.type === ChartTooltip;
}

export function Chart({ className, children, ...props }: ChartProps) {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [pointer, setPointer] = useState<ChartPointer | null>(null);
    const [labels, setLabels] = useState<string[]>([]);
    const [series, setSeries] = useState<ChartSeriesSnapshot | null>(null);

    const context = useMemo<ChartContextValue>(
        () => ({
            hoverIndex,
            selectedIndex,
            pointer,
            setHoverIndex,
            setSelectedIndex,
            setPointer,
            labels,
            setLabels,
            series,
            setSeries,
        }),
        [hoverIndex, selectedIndex, pointer, labels, series],
    );

    return (
        <ChartContext.Provider value={context}>
            <div
                data-refineui="chart"
                className={clsx(chartStyles.root, className)}
                {...props}
            >
                {children}
            </div>
        </ChartContext.Provider>
    );
}

export function ChartBody({ className, ...props }: ChartBodyProps) {
    return (
        <div
            data-refineui="chart-body"
            className={clsx(chartStyles.body, className)}
            {...props}
        />
    );
}

export function ChartContent({ className, ...props }: ChartContentProps) {
    return (
        <div
            data-refineui="chart-content"
            className={clsx(chartStyles.plotColumn, className)}
            {...props}
        />
    );
}

function ChartHitArea() {
    const { series, selectedIndex, setHoverIndex, setPointer, setSelectedIndex } =
        useChartContext("ChartHitArea");
    const count = series?.values.length ?? 0;
    if (count === 0 || !series) return null;

    const pointerFromEvent = (event: { currentTarget: SVGRectElement; clientX: number; clientY: number }) => {
        const svg = event.currentTarget.ownerSVGElement;
        if (!svg) return null;
        return pointerFromClient(svg.getBoundingClientRect(), event.clientX, event.clientY);
    };

    const applyPointer = (event: { currentTarget: SVGRectElement; clientX: number; clientY: number }) => {
        const next = pointerFromEvent(event);
        if (!next) return null;
        setPointer(next);
        setHoverIndex(hoverIndexFromPlotX(next.x, count, series.align));
        return next;
    };

    return (
        <rect
            data-refineui="chart-hit-area"
            x={0}
            y={0}
            width={CHART_VIEWBOX_WIDTH}
            height={CHART_VIEWBOX_HEIGHT}
            fill="transparent"
            className="cursor-pointer"
            onPointerMove={applyPointer}
            onPointerLeave={() => {
                setPointer(null);
                setHoverIndex(null);
            }}
            onClick={(event) => {
                const next = applyPointer(event);
                if (!next) return;
                const index = hoverIndexFromPlotX(next.x, count, series.align);
                setSelectedIndex(selectedIndex === index ? null : index);
            }}
            aria-hidden
        />
    );
}

export function ChartPlot({
    className,
    children,
    "aria-label": ariaLabel,
    ...props
}: ChartPlotProps) {
    const { pointer, selectedIndex } = useChartContext("ChartPlot");
    const svgChildren: ReactNode[] = [];
    const tooltipNodes: ReactNode[] = [];

    Children.forEach(children, (child) => {
        if (isChartTooltipElement(child)) tooltipNodes.push(child);
        else svgChildren.push(child);
    });

    return (
        <div
            data-refineui="chart-plot-frame"
            data-hover={pointer != null ? "true" : undefined}
            data-selected={selectedIndex != null ? "true" : undefined}
            className={clsx(chartStyles.plotFrame, className)}
            {...props}
        >
            <svg
                data-refineui="chart-plot"
                viewBox={`0 0 ${CHART_VIEWBOX_WIDTH} ${CHART_VIEWBOX_HEIGHT}`}
                preserveAspectRatio="none"
                role="img"
                aria-label={ariaLabel}
                className={chartStyles.plot}
            >
                {svgChildren}
                <ChartHitArea />
            </svg>
            {tooltipNodes}
        </div>
    );
}

export function ChartTooltip({ className, children, style, ...props }: ChartTooltipProps) {
    const { hoverIndex, labels, pointer, series } = useChartContext("ChartTooltip");
    if (pointer == null || hoverIndex == null || !series) return null;

    const value = series.values[hoverIndex];
    const label = labels[hoverIndex];
    const flipX = pointer.x > CHART_PLOT_PADDING_X + plotWidth() * CHART_TOOLTIP_FLIP_X;
    const flipY = pointer.y < CHART_PLOT_PADDING_TOP + plotHeight() * CHART_TOOLTIP_FLIP_Y;
    const offsetX = flipX
        ? "calc(-100% - var(--refineui-spacing-size-small))"
        : "var(--refineui-spacing-size-small)";
    const offsetY = flipY
        ? "var(--refineui-spacing-size-small)"
        : "calc(-100% - var(--refineui-spacing-size-x-small))";

    return (
        <div
            data-refineui="chart-tooltip"
            role="tooltip"
            className={clsx(chartStyles.tooltip, className)}
            style={{
                left: `${viewBoxXToPercent(pointer.x)}%`,
                top: `${viewBoxYToPercent(pointer.y)}%`,
                transform: `translate(${offsetX}, ${offsetY})`,
                ...style,
            }}
            {...props}
        >
            {children ?? (
                <>
                    {label ? <span className={chartStyles.tooltipLabel}>{label}</span> : null}
                    <span className={chartStyles.tooltipValue}>{formatAxisTick(value)}</span>
                </>
            )}
        </div>
    );
}

export function ChartYAxisLabels({
    lines = 5,
    max,
    values,
    formatTick = formatAxisTick,
    className,
    ...props
}: ChartYAxisLabelsProps) {
    const scaleMax = resolveScale(values, max);
    const ticks = yAxisTicks(scaleMax, lines).slice().reverse();

    return (
        <div
            data-refineui="chart-y-axis"
            className={clsx(chartStyles.yAxis, className)}
            aria-hidden
            {...props}
        >
            {ticks.map((tick) => (
                <span
                    key={tick}
                    className={chartStyles.yAxisTick}
                    style={{ top: `${viewBoxYToPercent(valueToY(tick, scaleMax))}%` }}
                >
                    {formatTick(tick)}
                </span>
            ))}
        </div>
    );
}

export function ChartGrid({
    lines = 5,
    max,
    values,
    className,
    ...props
}: ChartGridProps) {
    const scaleMax = resolveScale(values, max);
    const ticks = yAxisTicks(scaleMax, lines);
    const gridColor = gridStroke();
    const baselineColor = gridBaselineStroke();

    return (
        <g data-refineui="chart-grid" className={className} {...props}>
            {ticks.map((tick, index) => {
                const y = gridLineY(scaleMax, tick);
                const isBaseline = index === 0;
                const isTop = index === ticks.length - 1;
                if (isTop) return null;
                return (
                    <line
                        key={tick}
                        x1={CHART_PLOT_PADDING_X}
                        x2={CHART_VIEWBOX_WIDTH - CHART_PLOT_PADDING_X}
                        y1={y}
                        y2={y}
                        stroke={isBaseline ? baselineColor : gridColor}
                        strokeWidth="var(--refineui-stroke-width-thin)"
                        strokeOpacity={isBaseline ? opacities.opacityFull : opacities.opacityDisabled}
                        vectorEffect="non-scaling-stroke"
                    />
                );
            })}
        </g>
    );
}

export function ChartBars({
    values,
    max,
    seriesColor = "brand",
    showTrack = false,
    className,
    ...props
}: ChartBarsProps) {
    const { hoverIndex, selectedIndex, setSeries } = useChartContext("ChartBars");
    const scaleMax = resolveChartScale(values, max);
    const fill = seriesColorToken(seriesColor);
    const track = seriesSubtleToken(seriesColor);
    const { barWidth } = barLayout(values.length);
    const barRadius = Math.min(CHART_BAR_RADIUS, barWidth / 2);
    const baselineY = plotBaselineY();
    const trackHeight = plotHeight();

    useLayoutEffect(() => {
        setSeries({ values, seriesColor, max, align: "bar" });
    }, [values, seriesColor, max, setSeries]);

    return (
        <g data-refineui="chart-bars" data-series-color={seriesColor} className={className} {...props}>
            {showTrack
                ? values.map((_, index) => {
                    const x = barX(index, values.length);
                    return (
                        <path
                            key={`track-${index}`}
                            data-refineui="chart-bar-track"
                            d={barPathTopRounded(
                                x,
                                CHART_PLOT_PADDING_TOP,
                                barWidth,
                                trackHeight,
                                barRadius,
                            )}
                            fill={track}
                        />
                    );
                })
                : null}
            {values.map((value, index) => {
                const x = barX(index, values.length);
                const y = valueToY(value, scaleMax);
                const height = baselineY - y;
                if (height <= 0) return null;
                const state = itemState(index, hoverIndex, selectedIndex);
                return (
                    <path
                        key={index}
                        data-refineui="chart-bar"
                        data-state={state}
                        d={barPathTopRounded(x, y, barWidth, height, barRadius)}
                        fill={fill}
                    />
                );
            })}
        </g>
    );
}

export function ChartLine({
    values,
    max,
    seriesColor = "brand",
    showArea = false,
    showPoints = false,
    className,
    ...props
}: ChartLineProps) {
    const { hoverIndex, selectedIndex, setSeries } = useChartContext("ChartLine");
    const gradientId = useId().replace(/:/g, "");
    const scaleMax = resolveChartScale(values, max);
    const stroke = seriesColorToken(seriesColor);
    const coords = linePointCoords(values, scaleMax);
    const baselineY = plotBaselineY();
    const pointRing = pointStrokeColor();
    const linePath = monotoneLinePath(coords);

    useLayoutEffect(() => {
        setSeries({ values, seriesColor, max, align: "line" });
    }, [values, seriesColor, max, setSeries]);

    return (
        <g data-refineui="chart-line" data-series-color={seriesColor} className={className} {...props}>
            {showArea && coords.length > 1 ? (
                <>
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop
                                offset="0%"
                                stopColor={stroke}
                                stopOpacity={opacities.opacityDisabled}
                            />
                            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path
                        data-refineui="chart-line-area"
                        d={monotoneAreaPath(coords, baselineY)}
                        fill={`url(#${gradientId})`}
                    />
                </>
            ) : null}
            <path
                data-refineui="chart-line-stroke"
                d={linePath}
                fill="none"
                pathLength={1}
                stroke={stroke}
                strokeWidth="var(--refineui-stroke-width-thick)"
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
            {coords.map(({ x, y }, index) => {
                const state = itemState(index, hoverIndex, selectedIndex);
                const visible = showPoints || state !== "default";
                if (!visible) return null;
                return (
                    <circle
                        key={index}
                        data-refineui="chart-point"
                        data-state={state}
                        cx={x}
                        cy={y}
                        r={CHART_POINT_RADIUS}
                        fill={stroke}
                        stroke={pointRing}
                        strokeWidth={CHART_POINT_STROKE}
                    />
                );
            })}
        </g>
    );
}

export function ChartAxisLabels({
    labels,
    align = "bar",
    className,
    ...props
}: ChartAxisLabelsProps) {
    const { hoverIndex, selectedIndex, setLabels } = useChartContext("ChartAxisLabels");
    const count = labels.length;
    const centerAt = align === "line" ? linePointCenterRatio : barBandCenterRatio;

    useLayoutEffect(() => {
        setLabels(labels);
    }, [labels, setLabels]);

    return (
        <div
            data-refineui="chart-axis-labels"
            data-align={align}
            className={clsx(chartStyles.xAxis, className)}
            {...props}
        >
            {labels.map((label, index) => {
                const state = itemState(index, hoverIndex, selectedIndex);
                return (
                    <span
                        key={`${label}-${index}`}
                        data-state={state}
                        className={clsx(
                            chartStyles.xAxisLabel,
                            state !== "default" && chartStyles.xAxisLabelActive,
                        )}
                        style={{ left: `${centerAt(index, count)}%` }}
                    >
                        {label}
                    </span>
                );
            })}
        </div>
    );
}

export function ChartLegend({ className, ...props }: ChartLegendProps) {
    return (
        <ul
            data-refineui="chart-legend"
            className={clsx(chartStyles.legend, className)}
            {...props}
        />
    );
}

export function ChartLegendItem({
    seriesColor,
    className,
    children,
    style,
    ...props
}: ChartLegendItemProps) {
    return (
        <li
            data-refineui="chart-legend-item"
            data-series-color={seriesColor}
            className={clsx(chartStyles.legendItem, className)}
            {...props}
        >
            <span
                aria-hidden
                className={chartStyles.legendSwatch}
                style={{ backgroundColor: seriesColorToken(seriesColor), ...style }}
            />
            {children}
        </li>
    );
}
