import type { HTMLAttributes } from "react";

export type ScrollAreaOrientation = "vertical" | "horizontal";

/** When the custom scrollbar is visible. */
export type ScrollAreaType = "hover" | "scroll" | "always";

/**
 * Rows marked `data-scroll-edge-item` always blur as they cross an edge that hides more content
 * (picker-style); see the ScrollArea docs. Elements between the viewport and those rows must
 * not be scroll containers (`overflow: hidden`) — use `overflow: clip`.
 */
export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
    type?: ScrollAreaType;
}

export type ScrollAreaViewportProps = HTMLAttributes<HTMLDivElement>;

export interface ScrollAreaScrollbarProps extends HTMLAttributes<HTMLDivElement> {
    orientation?: ScrollAreaOrientation;
}

export type ScrollAreaThumbProps = HTMLAttributes<HTMLDivElement>;
