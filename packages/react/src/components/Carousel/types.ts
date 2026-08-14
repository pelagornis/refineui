import type { ButtonHTMLAttributes, HTMLAttributes } from "react";

export interface CarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    /** Controlled slide index (0-based). */
    index?: number;
    /** Uncontrolled initial index. */
    defaultIndex?: number;
    onIndexChange?: (index: number) => void;
    /** Wrap from last → first / first → last. */
    loop?: boolean;
}

export interface CarouselContentProps extends HTMLAttributes<HTMLDivElement> {}

export interface CarouselItemProps extends HTMLAttributes<HTMLDivElement> {}

export interface CarouselControlsProps extends HTMLAttributes<HTMLDivElement> {}

export interface CarouselPreviousProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export interface CarouselNextProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export interface CarouselIndicatorsProps extends HTMLAttributes<HTMLDivElement> {}
