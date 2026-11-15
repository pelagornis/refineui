import type { ToolbarSize } from "./types";

export const toolbarStyles = {
    root: "box-border inline-flex w-fit max-w-full min-w-0 items-center gap-refineui-size-small",
    vertical: "flex-col items-center",
    /** Raised surface with full rounding — a floating action bar. */
    attached:
        "border-refineui-hairline border-refineui-alias-border-subtle bg-refineui-alias-background-surface p-refineui-size-xx-small shadow-refineui-4",
    /** Outer radius = Button radius + padding, so corners stay concentric. */
    attachedRadius: {
        sm: "rounded-refineui-x-large",
        md: "rounded-refineui-xx-large",
        lg: "rounded-[20px]",
    } satisfies Record<ToolbarSize, string>,
    /** Tube styling comes from ButtonGroup so both components look identical. */
    group: "inline-flex items-center",
    groupVertical: "flex-col items-stretch",

    divider: "shrink-0 self-center bg-refineui-alias-border-default",
    dividerHorizontal: "h-refineui-size-large w-(--refineui-stroke-width-thin)",
    dividerVertical: "h-(--refineui-stroke-width-thin) w-refineui-size-large",

} as const;
