import type { HTMLAttributes, ReactNode } from "react";

export type SelectSize = "sm" | "md" | "lg";

/**
 * `filled` — standalone field chrome (border + surface).
 * `ghost` — compact chrome without field border (Calendar caption, Button-like ghost).
 * `plain` — flush trigger; consumer / parent owns padding, radius, surface.
 */
export type SelectTriggerAppearance = "filled" | "ghost" | "plain";

export interface SelectOption {
    value: string;
    label: ReactNode;
    disabled?: boolean;
    textValue?: string;
}

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
    value?: string;
    defaultValue?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    size?: SelectSize;
    fullWidth?: boolean;
    disabled?: boolean;
    children?: ReactNode;
}

export interface SelectTriggerProps extends HTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    /**
     * `filled` — default field chrome.
     * `ghost` — no field border; gap + radius + ghost hover plate.
     * `plain` — no chrome; compose visuals via `className` / parent recipe.
     * @default "filled"
     */
    appearance?: SelectTriggerAppearance;
}

export interface SelectValueProps extends HTMLAttributes<HTMLSpanElement> {
    placeholder?: string;
}

export interface SelectIconProps extends HTMLAttributes<HTMLSpanElement> {
    children?: ReactNode;
}

export interface SelectContentProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    /** Default `item-aligned`. `popper`: compact panel below/above trigger */
    position?: "item-aligned" | "popper";
    /** Portal target when set (else nearest `SelectPortal` or `document.body`) */
    container?: HTMLElement | null;
}

export interface SelectViewportProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

export interface SelectGroupProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

export interface SelectLabelProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

export interface SelectSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

export interface SelectItemProps extends HTMLAttributes<HTMLDivElement> {
    value: string;
    disabled?: boolean;
    children?: ReactNode;
    textValue?: string;
}

export interface SelectItemTextProps extends HTMLAttributes<HTMLSpanElement> {
    children?: ReactNode;
}

export interface SelectItemIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
    children?: ReactNode;
}

export type SelectArrowProps = HTMLAttributes<HTMLSpanElement>;
export type SelectScrollUpButtonProps = HTMLAttributes<HTMLDivElement>;
export type SelectScrollDownButtonProps = HTMLAttributes<HTMLDivElement>;
export type SelectPortalProps = { children?: ReactNode; container?: HTMLElement | null };
export interface SelectItemRegistration {
    value: string;
    disabled: boolean;
    label: string;
    textValue?: string;
    nodeId?: string;
}
