import { clsx } from "clsx";
import type { CSSProperties } from "react";
import {
    layoutAliasColorVar,
    layoutRadiusVar,
    layoutSpacingVar,
    layoutStrokeVar,
    layoutStyles,
} from "./style";
import type { BoxProps } from "./types";

/** Padding, semantic fill, radius, and border. */
export function Box({
    as: Component = "div",
    padding,
    paddingX,
    paddingY,
    background,
    radius,
    border,
    borderColor,
    className,
    style,
    ...props
}: BoxProps) {
    const boxStyle: CSSProperties = {};
    if (padding) boxStyle.padding = layoutSpacingVar[padding];
    if (paddingX) boxStyle.paddingInline = layoutSpacingVar[paddingX];
    if (paddingY) boxStyle.paddingBlock = layoutSpacingVar[paddingY];
    if (background) boxStyle.backgroundColor = layoutAliasColorVar(background);
    if (radius) boxStyle.borderRadius = layoutRadiusVar(radius);
    if (border) {
        boxStyle.borderWidth = layoutStrokeVar(border);
        boxStyle.borderStyle = border === "strokeWidthNone" ? "none" : "solid";
        boxStyle.borderColor = layoutAliasColorVar(borderColor ?? "borderDefault");
    } else if (borderColor) {
        boxStyle.borderWidth = layoutStrokeVar("strokeWidthThin");
        boxStyle.borderStyle = "solid";
        boxStyle.borderColor = layoutAliasColorVar(borderColor);
    }

    return (
        <Component
            data-refineui="box"
            className={clsx(layoutStyles.box, className)}
            style={{ ...boxStyle, ...style }}
            {...props}
        />
    );
}
