import type { HTMLAttributes } from "react";

export type ResizableOrientation = "horizontal" | "vertical";

export interface ResizablePanelGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "onResize"> {
    orientation?: ResizableOrientation;
    /** Fires after a resize settles with panel sizes in order (percentages summing to ~100). */
    onLayout?: (sizes: number[]) => void;
}

export interface ResizablePanelProps extends HTMLAttributes<HTMLDivElement> {
    /** Initial size as a percentage of the group (default 50). */
    defaultSize?: number;
    /** Minimum size percentage (default 10). */
    minSize?: number;
    /** Maximum size percentage (default 100). */
    maxSize?: number;
    /** Controlled size percentage. */
    size?: number;
    onResize?: (size: number) => void;
}

export interface ResizableHandleProps extends HTMLAttributes<HTMLDivElement> {
    /** Show a small grip affordance on the separator. */
    withHandle?: boolean;
    disabled?: boolean;
}
