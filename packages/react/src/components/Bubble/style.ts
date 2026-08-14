import { clsx } from "clsx";
import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";
import type { BubbleAlign, BubbleReactionsSide, BubbleVariant } from "./types";

/**
 * Conversation column share for framed bubbles (ghost uses full width).
 * Relative layout ratio — not a Foundation size step.
 */
export const BUBBLE_MAX_WIDTH = "80%";

export const bubbleStyles = {
    group: clsx(
        "flex min-w-0 flex-col gap-refineui-size-xx-small",
        // Connected corners for consecutive bubbles
        "[&>[data-refineui=bubble]:first-child:not(:only-child)_[data-refineui=bubble-content]]:rounded-b-[var(--refineui-radius-rounded-medium)]",
        "[&>[data-refineui=bubble]:last-child:not(:only-child)_[data-refineui=bubble-content]]:rounded-t-[var(--refineui-radius-rounded-medium)]",
        "[&>[data-refineui=bubble]:not(:first-child):not(:last-child)_[data-refineui=bubble-content]]:rounded-[var(--refineui-radius-rounded-medium)]",
        // Room for overlapping reactions on the last bubble in a group
        "[&>[data-refineui=bubble][data-has-reactions-bottom]:not(:last-child)]:mb-refineui-size-xx-large",
    ),
    root: clsx(
        "relative box-border flex w-fit min-w-0 flex-col",
        "data-[align=end]:self-end",
        "data-[variant=ghost]:max-w-full",
        // Margin (not padding) so absolute reactions still sit on the content edge
        "data-[has-reactions-bottom]:mb-refineui-size-xx-large",
        "data-[has-reactions-top]:mt-refineui-size-xx-large",
    ),
    /** Positions reactions against the message surface (not outer margin). */
    surface: "relative box-border w-fit max-w-full min-w-0",
    content: clsx(
        componentTextClass(componentTypographyTokens.bubble),
        "box-border w-fit max-w-full min-w-0 overflow-hidden break-words",
        "rounded-refineui-x-large border-refineui-thin border-transparent",
        "px-refineui-size-large py-refineui-size-medium",
        "outline-none",
    ),
    reactions: clsx(
        "absolute z-refineui-content flex w-fit shrink-0 items-center justify-center",
        "gap-refineui-size-xx-small rounded-refineui-circle",
        "border-refineui-thin border-refineui-alias-border-default",
        "bg-refineui-alias-background-primary px-refineui-size-x-small py-refineui-size-xx-small",
        "shadow-refineui-2",
        "has-[button]:p-0",
        "pointer-events-auto",
    ),
} as const;

export const bubbleRootItemsClass: Record<BubbleAlign, string> = {
    start: "items-start",
    end: "items-end",
};

/** Vertical edge overlap only (shadcn BubbleReactions). */
export const bubbleReactionsSideClass: Record<BubbleReactionsSide, string> = {
    top: "top-0 -translate-y-3/4",
    bottom: "bottom-0 translate-y-3/4",
};

/** Inset from the inline edge — not the corner vertex. */
export const bubbleReactionsAlignClass: Record<BubbleAlign, string> = {
    start: "left-refineui-size-medium",
    end: "right-refineui-size-medium",
};

export const bubbleContentVariantClass: Record<BubbleVariant, string> = {
    default: "bg-refineui-alias-background-brand text-refineui-alias-foreground-inversed",
    secondary:
        "bg-refineui-alias-background-surface-selected text-refineui-alias-foreground-primary",
    muted: "bg-refineui-alias-background-surface-selected text-refineui-alias-foreground-primary",
    tinted:
        "border-refineui-alias-border-strong bg-refineui-alias-background-brand-subtle text-refineui-alias-foreground-brand",
    outline:
        "border-refineui-alias-border-strong bg-refineui-alias-background-surface text-refineui-alias-foreground-primary",
    ghost: "rounded-none border-none bg-transparent p-0 text-refineui-alias-foreground-primary",
    destructive: "bg-refineui-alias-background-error text-refineui-alias-foreground-on-error",
};
