import type { HTMLAttributes, LiHTMLAttributes, OlHTMLAttributes } from "react";

export type ProgressStepperState = "complete" | "current" | "upcoming";

export interface ProgressStepperProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    /** Controlled active step value. */
    value?: number;
    /** Uncontrolled initial step. */
    defaultValue?: number;
    onValueChange?: (value: number) => void;
}

export interface ProgressStepperListProps extends OlHTMLAttributes<HTMLOListElement> {}

export interface ProgressStepperItemProps extends LiHTMLAttributes<HTMLLIElement> {
    /** Step identity used with `ProgressStepper` value. */
    value: number;
    disabled?: boolean;
}

export interface ProgressStepperMarkerProps extends HTMLAttributes<HTMLSpanElement> {}

export interface ProgressStepperLabelProps extends HTMLAttributes<HTMLSpanElement> {}
