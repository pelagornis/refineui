import type { HTMLAttributes, ReactNode } from "react";

export type SpinnerSize = "xSmall" | "small" | "medium" | "large" | "xLarge" | "xxLarge";
export type SpinnerLabelPosition = "left" | "right" | "top" | "bottom";

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    size?: SpinnerSize;
    label?: ReactNode;
    labelPosition?: SpinnerLabelPosition;
}

