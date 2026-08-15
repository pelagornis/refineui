import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
}

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {}

export interface TabsTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
    value: string;
    children: ReactNode;
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
    value: string;
}
