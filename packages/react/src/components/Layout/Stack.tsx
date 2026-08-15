import { clsx } from "clsx";
import {
    layoutAlignClass,
    layoutDirectionClass,
    layoutGapClass,
    layoutJustifyClass,
    layoutStyles,
    layoutWrapClass,
} from "./style";
import type { LayoutWrap, StackProps } from "./types";

function resolveWrap(wrap: StackProps["wrap"]): LayoutWrap | undefined {
    if (wrap === true) return "wrap";
    if (wrap === false) return "nowrap";
    return wrap;
}

/** One-axis flex layout with Foundation `gap`. */
export function Stack({
    as: Component = "div",
    direction = "column",
    gap = "sizeNone",
    align,
    justify,
    wrap,
    inline = false,
    className,
    ...props
}: StackProps) {
    const resolvedWrap = resolveWrap(wrap);

    return (
        <Component
            data-refineui="stack"
            data-direction={direction}
            className={clsx(
                layoutStyles.stack,
                inline ? "inline-flex" : "flex",
                layoutDirectionClass[direction],
                layoutGapClass[gap],
                align && layoutAlignClass[align],
                justify && layoutJustifyClass[justify],
                resolvedWrap && layoutWrapClass[resolvedWrap],
                className,
            )}
            {...props}
        />
    );
}
