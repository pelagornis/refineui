import type { FocusEvent, HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from "react";

/** Web Kit MCP Tooltip — `position` */
export type TooltipPosition = "Top" | "Left" | "Bottom" | "Right";

/** Web Kit MCP Tooltip — `align` */
export type TooltipAlign = "Start" | "Center" | "End";

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "content"> {
    trigger: ReactNode;
    content: ReactNode;
    position?: TooltipPosition;
    align?: TooltipAlign;
    delayMs?: number;
}

/** Expected event signatures when merging trigger children (`cloneElement`) */
export interface TooltipTriggerMergeProps {
    onMouseEnter?: (e: MouseEvent<HTMLElement>) => void;
    onMouseLeave?: (e: MouseEvent<HTMLElement>) => void;
    onFocus?: (e: FocusEvent<HTMLElement>) => void;
    onBlur?: (e: FocusEvent<HTMLElement>) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
    "aria-describedby"?: string;
}
