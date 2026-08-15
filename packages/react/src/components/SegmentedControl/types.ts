import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export interface SegmentedControlProps extends HTMLAttributes<HTMLDivElement> {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
}

export interface SegmentedControlItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
    value: string;
    children: ReactNode;
}
