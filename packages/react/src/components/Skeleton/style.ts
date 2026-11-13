export const skeletonStyles = {
    /** Line / block placeholder */
    rectangle: "block animate-pulse rounded-refineui-large bg-refineui-alias-background-surface-selected motion-reduce:animate-none motion-reduce:opacity-100 [animation-duration:var(--refineui-motion-duration-skeleton)] [animation-timing-function:var(--refineui-motion-easing-ease-in-out)]",
    /** Avatar-style placeholder */
    circle: "block shrink-0 animate-pulse rounded-refineui-circle bg-refineui-alias-background-surface-selected motion-reduce:animate-none motion-reduce:opacity-100 [animation-duration:var(--refineui-motion-duration-skeleton)] [animation-timing-function:var(--refineui-motion-easing-ease-in-out)]",
} as const;
