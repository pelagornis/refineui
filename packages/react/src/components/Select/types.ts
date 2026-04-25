import type { ChangeEvent, HTMLAttributes, ReactNode } from "react";
import type { MenuAlign } from "../Dropdown/types";

export type SelectSize = "sm" | "md" | "lg";

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
    children: ReactNode;
    placeholder?: string;
    fullWidth?: boolean;
    size?: SelectSize;
    disabled?: boolean;
    value?: string;
    defaultValue?: string;
    name?: string;
    required?: boolean;
    onValueChange?: (value: string) => void;
    onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export interface SelectTriggerProps extends Omit<HTMLAttributes<HTMLButtonElement>, "onChange"> {
    children?: ReactNode;
}

export interface SelectContentProps extends HTMLAttributes<HTMLDivElement> {
    align?: MenuAlign;
    side?: "auto" | "top" | "bottom";
    sideOffset?: number;
}

export interface SelectItemProps extends HTMLAttributes<HTMLButtonElement> {
    value: string;
    children: ReactNode;
    textValue?: string;
    disabled?: boolean;
}

export interface SelectSectionProps extends HTMLAttributes<HTMLDivElement> {
    disabled?: boolean;
}

export interface SelectSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

export interface SelectGroupProps extends HTMLAttributes<HTMLDivElement> {}

export interface SelectValueProps extends HTMLAttributes<HTMLSpanElement> {
    placeholder?: string;
}
