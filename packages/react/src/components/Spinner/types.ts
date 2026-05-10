import type { HTMLAttributes, ReactNode } from "react";

/** Web Kit `550:3669` — short tier ids (`xs` … `xxl`) */
export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export type SpinnerLabelPosition = "left" | "right" | "top" | "bottom";

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    size?: SpinnerSize;
    label?: ReactNode;
    labelPosition?: SpinnerLabelPosition;
}

