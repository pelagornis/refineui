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
    /** Render content without the default floating surface, beak, padding, or minimum width. */
    surface?: boolean;
    /** Let a surfaced popover shrink to the width of its content. */
    fitContent?: boolean;
}

export interface PopOverProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "content"> {
    trigger: ReactNode;
    content: ReactNode;
    placement?: PopoverPlacement;
    align?: PopoverAlign;
}

export type PopOverAlign = PopoverAlign;

