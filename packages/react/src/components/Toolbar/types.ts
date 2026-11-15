import type { ButtonProps } from "../Button";
import type { HTMLAttributes } from "react";

export type ToolbarOrientation = "horizontal" | "vertical";
export type ToolbarSize = "sm" | "md" | "lg";

export interface ToolbarProps extends Omit<HTMLAttributes<HTMLDivElement>, "role" | "aria-orientation"> {
    /** Accessible name for the toolbar, applied as `aria-label`. */
    label?: string;
    /** Puts the toolbar on a raised surface with full rounding (a floating action bar). */
    attached?: boolean;
    /** Arrow-key axis and layout direction. Inherited by groups and dividers. */
    orientation?: ToolbarOrientation;
    /** Control size; cascades to Button, ToolbarButton, Input, Select, DateInput and other Field controls inside. */
    size?: ToolbarSize;
    /** Wrap focus from the last item to the first (and back) with the arrow keys. */
    loop?: boolean;
}

export interface ToolbarGroupProps extends HTMLAttributes<HTMLDivElement> {
    /** Overrides the direction inherited from Toolbar. */
    orientation?: ToolbarOrientation;
}

export interface ToolbarDividerProps extends Omit<HTMLAttributes<HTMLDivElement>, "role"> {
    orientation?: ToolbarOrientation;
}

export type ToolbarButtonProps = ButtonProps;

export interface ToolbarToggleButtonProps extends Omit<ButtonProps, "onChange"> {
    /** Controlled pressed state. */
    pressed?: boolean;
    /** Initial pressed state when uncontrolled. */
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
}
