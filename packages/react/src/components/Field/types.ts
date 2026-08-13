import type { HTMLAttributes, ReactNode } from "react";
import type { LabelProps, LabelRequiredProps } from "../Label/types";

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg";
}

/** Same surface as `Label`; `size` defaults from nearest `Field`. */
export type FieldLabelProps = LabelProps;

/** Alias of `LabelRequired` for Field composition. */
export type FieldRequiredProps = LabelRequiredProps;

export interface FieldHintProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}
export interface FieldErrorProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}
