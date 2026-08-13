import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

/** Field shell + feedback only — label/required styles live on `Label` */
export const fieldStyles = {
    root: "mb-refineui-size-medium flex w-full flex-col gap-refineui-size-xx-small",
    /** Overrides standalone `Label` bottom margin — stack gap comes from `root` */
    label: "!mb-0",
    feedback: componentTextClass(componentTypographyTokens.fieldFeedback),
} as const;
