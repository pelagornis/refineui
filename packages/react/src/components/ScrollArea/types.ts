import type { HTMLAttributes } from "react";

export type ScrollAreaOrientation = "vertical" | "horizontal";

/** When the custom scrollbar is visible. */
export type ScrollAreaType = "hover" | "always";

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
    type?: ScrollAreaType;
}

export type ScrollAreaViewportProps = HTMLAttributes<HTMLDivElement>;

export interface ScrollAreaScrollbarProps extends HTMLAttributes<HTMLDivElement> {
    orientation?: ScrollAreaOrientation;
}

export type ScrollAreaThumbProps = HTMLAttributes<HTMLDivElement>;
