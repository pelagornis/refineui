import type { HTMLAttributes } from "react";

export type BubbleVariant =
    | "default"
    | "secondary"
    | "muted"
    | "tinted"
    | "outline"
    | "ghost"
    | "destructive";

export type BubbleAlign = "start" | "end";

export type BubbleReactionsSide = "top" | "bottom";

export interface BubbleProps extends HTMLAttributes<HTMLDivElement> {
    variant?: BubbleVariant;
    align?: BubbleAlign;
}

export type BubbleContentProps = HTMLAttributes<HTMLDivElement>;

export interface BubbleReactionsProps extends HTMLAttributes<HTMLDivElement> {
    side?: BubbleReactionsSide;
    align?: BubbleAlign;
}

export type BubbleGroupProps = HTMLAttributes<HTMLDivElement>;
