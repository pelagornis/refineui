import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

export const linkStyles = {
    base: componentTextClass(componentTypographyTokens.link),
    withIcon: "inline-flex items-center gap-refineui-size-xx-small",
    inline: "inline",
    disabled: "cursor-not-allowed",
} as const;
