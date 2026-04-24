import type { HTMLAttributes, ReactNode } from "react";

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg";
}

export type FieldLabelProps = HTMLAttributes<HTMLLabelElement>;
export type FieldRequiredProps = HTMLAttributes<HTMLSpanElement>;
export interface FieldHintProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}
export interface FieldErrorProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

