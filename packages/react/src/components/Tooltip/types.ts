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

/** 트리거 자식 병합(`cloneElement`) 시 기대하는 이벤트 시그니처 */
export interface TooltipTriggerMergeProps {
    onMouseEnter?: (e: MouseEvent<HTMLElement>) => void;
    onMouseLeave?: (e: MouseEvent<HTMLElement>) => void;
    onFocus?: (e: FocusEvent<HTMLElement>) => void;
    onBlur?: (e: FocusEvent<HTMLElement>) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
    "aria-describedby"?: string;
}
