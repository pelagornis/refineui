import { clsx } from "clsx";
import {
    layoutAlignClass,
    layoutColumnGapClass,
    layoutFoundationSizeVar,
    layoutGapClass,
    layoutJustifyClass,
    layoutRowGapClass,
    layoutStyles,
    resolveGridSpan,
} from "./style";
import type { GridItemProps, GridProps } from "./types";

/** CSS grid with equal columns or Foundation `minItem` auto-fit. */
export function Grid({
    as: Component = "div",
    columns = 1,
    minItem,
    gap = "sizeNone",
    columnGap,
    rowGap,
    align,
    justify,
    className,
    style,
    ...props
}: GridProps) {
    const count = resolveGridSpan(columns);
    const template = minItem
        ? `repeat(auto-fit, minmax(${layoutFoundationSizeVar(minItem)}, 1fr))`
        : `repeat(${count}, minmax(0, 1fr))`;

    return (
        <Component
            data-refineui="grid"
            data-columns={minItem ? undefined : count}
            className={clsx(
                layoutStyles.grid,
                layoutGapClass[gap],
                columnGap && layoutColumnGapClass[columnGap],
                rowGap && layoutRowGapClass[rowGap],
                align && layoutAlignClass[align],
                justify && layoutJustifyClass[justify],
                className,
            )}
            style={{ gridTemplateColumns: template, ...style }}
            {...props}
        />
    );
}

/** Column / row span inside `Grid`. */
export function GridItem({
    as: Component = "div",
    span = 1,
    rowSpan,
    className,
    style,
    ...props
}: GridItemProps) {
    const col = resolveGridSpan(span);
    const row = rowSpan != null ? resolveGridSpan(rowSpan) : undefined;

    return (
        <Component
            data-refineui="grid-item"
            data-span={col}
            data-row-span={row}
            className={clsx(layoutStyles.gridItem, className)}
            style={{
                gridColumn: `span ${col} / span ${col}`,
                ...(row != null ? { gridRow: `span ${row} / span ${row}` } : {}),
                ...style,
            }}
            {...props}
        />
    );
}
