import type { HTMLAttributes, ReactNode } from "react";

export type PopoverPlacement = "top" | "bottom" | "left" | "right";
export type PopoverAlign = "start" | "center" | "end";

export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    children?: ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export interface PopoverTriggerProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
    children: ReactNode;
}

export interface PopoverContentProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    children: ReactNode;
    placement?: PopoverPlacement;
    align?: PopoverAlign;
    variant?: "default" | "inverted";
}

export interface PopOverProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "content"> {
    trigger: ReactNode;
    content: ReactNode;
    placement?: PopoverPlacement;
    align?: PopoverAlign;
    variant?: "default" | "inverted";
}

export type PopOverAlign = PopoverAlign;

