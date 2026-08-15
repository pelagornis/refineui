import type { ElementType, HTMLAttributes } from "react";
import type {
    BorderRadiusTokens,
    FoundationSizeName,
    SemanticColorName,
    SpacingTokens,
    StrokeWidthTokens,
} from "@refineui/tokens";

export type LayoutGap = keyof SpacingTokens;

export type LayoutDirection = "row" | "column" | "row-reverse" | "column-reverse";

export type LayoutAlign = "start" | "center" | "end" | "stretch" | "baseline";

export type LayoutJustify = "start" | "center" | "end" | "between" | "around" | "evenly";

export type LayoutWrap = "nowrap" | "wrap" | "wrap-reverse";

export type LayoutAs = ElementType;

export type LayoutRadius = keyof BorderRadiusTokens;

export type LayoutStroke = keyof StrokeWidthTokens;

export type LayoutBackground = Extract<SemanticColorName, `background${string}` | `surface${string}`>;

export type LayoutBorderColor = Extract<SemanticColorName, `border${string}`>;

type DivProps = HTMLAttributes<HTMLDivElement>;
type DivPropsNoAlign = Omit<DivProps, "align">;

export interface StackProps extends DivPropsNoAlign {
    as?: LayoutAs;
    direction?: LayoutDirection;
    gap?: LayoutGap;
    align?: LayoutAlign;
    justify?: LayoutJustify;
    wrap?: LayoutWrap | boolean;
    inline?: boolean;
}

export interface GridProps extends DivPropsNoAlign {
    as?: LayoutAs;
    columns?: number;
    minItem?: FoundationSizeName;
    gap?: LayoutGap;
    columnGap?: LayoutGap;
    rowGap?: LayoutGap;
    align?: LayoutAlign;
    justify?: LayoutJustify;
}

export interface GridItemProps extends DivProps {
    as?: LayoutAs;
    span?: number;
    rowSpan?: number;
}

export interface ContainerProps extends DivProps {
    as?: LayoutAs;
    padding?: LayoutGap;
}

export type SpacerProps = DivProps;

export interface BoxProps extends DivProps {
    as?: LayoutAs;
    padding?: LayoutGap;
    paddingX?: LayoutGap;
    paddingY?: LayoutGap;
    background?: LayoutBackground;
    radius?: LayoutRadius;
    border?: LayoutStroke;
    borderColor?: LayoutBorderColor;
}
