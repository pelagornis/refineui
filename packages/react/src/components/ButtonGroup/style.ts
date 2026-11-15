import type { ButtonSize } from "../Button/types";

export const buttonGroupStyles = {
    root: "box-border inline-flex w-fit max-w-full min-w-0 items-center",
    vertical: "flex-col items-stretch",
    separate: "gap-refineui-size-xx-small",
    /** Tube: one outline holding the buttons — same track as SegmentedControl. */
    attached:
        "gap-refineui-size-xxx-small border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-brand-subtle p-refineui-size-xxx-small",
    /** Outer radius = Button radius + padding, so corners stay concentric. Buttons keep their own radius. */
    attachedRadius: {
        sm: "rounded-[10px]",
        md: "rounded-[14px]",
        lg: "rounded-[18px]",
    } satisfies Record<ButtonSize, string>,
} as const;
