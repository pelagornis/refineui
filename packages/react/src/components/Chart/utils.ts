import { borderRadii, foundationSizes, spacings } from "@refineui/tokens";

/**
 * Reference plot space — 5:2 dashboard cartesian (shadcn chart height, not 16:9).
 * CSS `aspect-[5/2]` + matching viewBox keeps radii circular.
 */
export const CHART_VIEWBOX_WIDTH = 800;
export const CHART_VIEWBOX_HEIGHT = 320;

export const CHART_PLOT_PADDING_TOP = parseFloat(spacings.sizeMedium);
export const CHART_PLOT_PADDING_BOTTOM = parseFloat(spacings.sizeXXSmall);
export const CHART_PLOT_PADDING_X = parseFloat(spacings.sizeMedium);

export const CHART_BAR_RADIUS = parseFloat(borderRadii.roundedMedium);
/** Slim bars with gutter — no px cap; band fill is the only width rule. */
export const CHART_BAR_BAND_FILL = 0.5;

export const CHART_POINT_RADIUS = parseFloat(foundationSizes.foundationSize40);
export const CHART_POINT_STROKE = parseFloat(foundationSizes.foundationSize20);

/** Tooltip flips to the left / below when the pointer is past these plot ratios. */
export const CHART_TOOLTIP_FLIP_X = 0.75;
export const CHART_TOOLTIP_FLIP_Y = 0.25;

export type ChartPoint = { x: number; y: number };

export function clampValue(n: number) {
    if (Number.isNaN(n)) return 0;
    return Math.max(0, n);
}

/** Round scale maximum to readable ticks (MUI / Recharts-style). */
export function niceMax(rawMax: number) {
    if (rawMax <= 0) return 1;
    const magnitude = 10 ** Math.floor(Math.log10(rawMax));
    const normalized = rawMax / magnitude;
    let niceUnit: number;
    if (normalized <= 1) niceUnit = 1;
    else if (normalized <= 2) niceUnit = 2;
    else if (normalized <= 5) niceUnit = 5;
    else niceUnit = 10;
    return niceUnit * magnitude;
}

export function resolveChartScale(values: number[], max?: number) {
    const peak = values.reduce((acc, v) => Math.max(acc, clampValue(v)), 0);
    const scaleMax = max !== undefined && max > 0 ? max : niceMax(peak);
    return scaleMax > 0 ? scaleMax : 1;
}

export function yAxisTicks(scaleMax: number, lines: number) {
    const count = Math.max(2, lines);
    return Array.from({ length: count }, (_, index) => (scaleMax / (count - 1)) * index);
}

export function plotHeight() {
    return CHART_VIEWBOX_HEIGHT - CHART_PLOT_PADDING_TOP - CHART_PLOT_PADDING_BOTTOM;
}

export function plotWidth() {
    return CHART_VIEWBOX_WIDTH - CHART_PLOT_PADDING_X * 2;
}

export function plotBaselineY() {
    return CHART_PLOT_PADDING_TOP + plotHeight();
}

export function viewBoxYToPercent(y: number) {
    return (y / CHART_VIEWBOX_HEIGHT) * 100;
}

export function viewBoxXToPercent(x: number) {
    return (x / CHART_VIEWBOX_WIDTH) * 100;
}

export function clampPlotX(x: number) {
    return Math.min(CHART_VIEWBOX_WIDTH - CHART_PLOT_PADDING_X, Math.max(CHART_PLOT_PADDING_X, x));
}

export function clampPlotY(y: number) {
    return Math.min(plotBaselineY(), Math.max(CHART_PLOT_PADDING_TOP, y));
}

export function pointerFromClient(
    bounds: { left: number; top: number; width: number; height: number },
    clientX: number,
    clientY: number,
) {
    const xRatio = bounds.width === 0 ? 0 : (clientX - bounds.left) / bounds.width;
    const yRatio = bounds.height === 0 ? 0 : (clientY - bounds.top) / bounds.height;
    return {
        x: clampPlotX(xRatio * CHART_VIEWBOX_WIDTH),
        y: clampPlotY(yRatio * CHART_VIEWBOX_HEIGHT),
    };
}

export function indexFromPlotX(x: number, count: number) {
    const band = barBandWidth(count);
    if (count <= 0 || band <= 0) return 0;
    const inner = x - CHART_PLOT_PADDING_X;
    return Math.min(count - 1, Math.max(0, Math.floor(inner / band)));
}

export function nearestLineIndex(x: number, count: number) {
    if (count <= 0) return 0;
    if (count === 1) return 0;
    const step = plotWidth() / (count - 1);
    const raw = (x - CHART_PLOT_PADDING_X) / step;
    return Math.min(count - 1, Math.max(0, Math.round(raw)));
}

export function hoverIndexFromPlotX(x: number, count: number, align: "bar" | "line") {
    return align === "line" ? nearestLineIndex(x, count) : indexFromPlotX(x, count);
}

export function barBandWidth(count: number) {
    return count > 0 ? plotWidth() / count : 0;
}

export function barLayout(count: number) {
    const band = barBandWidth(count);
    const barWidth = band * CHART_BAR_BAND_FILL;
    return { band, barWidth };
}

export function barX(index: number, count: number) {
    const { band, barWidth } = barLayout(count);
    return CHART_PLOT_PADDING_X + index * band + (band - barWidth) / 2;
}

export function barBandCenterRatio(index: number, count: number) {
    const { band } = barLayout(count);
    const center = CHART_PLOT_PADDING_X + index * band + band / 2;
    return viewBoxXToPercent(center);
}

export function linePointCenterRatio(index: number, count: number) {
    const width = plotWidth();
    const step = count === 1 ? 0 : width / (count - 1);
    const x = CHART_PLOT_PADDING_X + step * index;
    return viewBoxXToPercent(x);
}

export function valueToY(value: number, scaleMax: number) {
    const ratio = clampValue(value) / scaleMax;
    const height = plotHeight();
    return CHART_PLOT_PADDING_TOP + height - ratio * height;
}

export function gridLineY(scaleMax: number, tick: number) {
    return valueToY(tick, scaleMax);
}

export function linePointCoords(values: number[], scaleMax: number): ChartPoint[] {
    const count = values.length;
    if (count === 0) return [];
    const width = plotWidth();
    const step = count === 1 ? 0 : width / (count - 1);
    return values.map((value, index) => ({
        x: CHART_PLOT_PADDING_X + step * index,
        y: valueToY(value, scaleMax),
    }));
}

/** Fritsch–Carlson monotone cubic — Recharts `type="monotone"`. */
export function monotoneLinePath(coords: ChartPoint[]) {
    if (coords.length === 0) return "";
    if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`;

    const n = coords.length;
    const dx: number[] = [];
    const m: number[] = [];
    for (let i = 0; i < n - 1; i += 1) {
        dx[i] = coords[i + 1].x - coords[i].x;
        const dy = coords[i + 1].y - coords[i].y;
        m[i] = dx[i] !== 0 ? dy / dx[i] : 0;
    }

    const d: number[] = [m[0]];
    for (let i = 1; i < n - 1; i += 1) {
        if (m[i - 1] * m[i] <= 0) {
            d[i] = 0;
        } else {
            const span = dx[i - 1] + dx[i];
            d[i] =
                span !== 0
                    ? (3 * span) / ((span + dx[i]) / m[i - 1] + (span + dx[i - 1]) / m[i])
                    : 0;
        }
    }
    d[n - 1] = m[n - 2];

    let path = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < n - 1; i += 1) {
        const x1 = coords[i].x;
        const y1 = coords[i].y;
        const x2 = coords[i + 1].x;
        const y2 = coords[i + 1].y;
        const h = dx[i];
        path += ` C ${x1 + h / 3} ${y1 + (d[i] * h) / 3} ${x2 - h / 3} ${y2 - (d[i + 1] * h) / 3} ${x2} ${y2}`;
    }
    return path;
}

export function monotoneAreaPath(coords: ChartPoint[], baselineY: number) {
    if (coords.length === 0) return "";
    const first = coords[0];
    const last = coords[coords.length - 1];
    return `${monotoneLinePath(coords)} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
}

/** Bar path with rounded top corners only — shadcn `radius={[4,4,0,0]}`. */
export function barPathTopRounded(x: number, y: number, width: number, height: number, radius: number) {
    const r = Math.min(radius, width / 2, height);
    if (r <= 0 || height <= 0) {
        return `M ${x} ${y + height} L ${x} ${y} L ${x + width} ${y} L ${x + width} ${y + height} Z`;
    }
    return [
        `M ${x} ${y + height}`,
        `L ${x} ${y + r}`,
        `Q ${x} ${y} ${x + r} ${y}`,
        `L ${x + width - r} ${y}`,
        `Q ${x + width} ${y} ${x + width} ${y + r}`,
        `L ${x + width} ${y + height}`,
        "Z",
    ].join(" ");
}

export function formatAxisTick(value: number) {
    if (Number.isInteger(value)) return String(value);
    return value.toFixed(1);
}
