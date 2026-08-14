import type { HTMLAttributes, LiHTMLAttributes, OlHTMLAttributes } from "react";

export type StepperOrientation = "horizontal" | "vertical";

export type StepperState = "complete" | "current" | "upcoming";

export interface StepperProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    /** Controlled active step value. */
    value?: number;
    /** Uncontrolled initial step. */
    defaultValue?: number;
    onValueChange?: (value: number) => void;
    orientation?: StepperOrientation;
}

export interface StepperListProps extends OlHTMLAttributes<HTMLOListElement> {}

export interface StepperItemProps extends LiHTMLAttributes<HTMLLIElement> {
    /** Step identity used with `Stepper` value. */
    value: number;
    disabled?: boolean;
}

export interface StepperIndicatorProps extends HTMLAttributes<HTMLSpanElement> {}

export interface StepperContentProps extends HTMLAttributes<HTMLDivElement> {}

export interface StepperTitleProps extends HTMLAttributes<HTMLSpanElement> {}

export interface StepperDescriptionProps extends HTMLAttributes<HTMLSpanElement> {}

export interface StepperSeparatorProps extends LiHTMLAttributes<HTMLLIElement> {}
