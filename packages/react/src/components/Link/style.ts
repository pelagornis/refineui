import { componentTypographyTokens } from "../../tokens/componentTypographyTokens";
import { componentTextClass } from "../../typography";

export const linkStyles = {
    base: `${componentTextClass(componentTypographyTokens.link)} text-refineui-alias-foreground-link no-underline transition-[color,text-decoration-color] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)] visited:text-refineui-alias-foreground-link-visited hover:text-refineui-alias-foreground-link-hover hover:underline hover:decoration-current hover:underline-offset-refineui-size-xx-small focus-visible:text-refineui-alias-foreground-link-active focus-visible:underline focus-visible:decoration-current focus-visible:underline-offset-refineui-size-xx-small active:text-refineui-alias-foreground-link-visited active:underline active:decoration-current active:underline-offset-refineui-size-xx-small focus-visible:outline-[length:var(--refineui-stroke-width-thick)] focus-visible:[outline-color:var(--refineui-focus-color)] focus-visible:[outline-offset:var(--refineui-focus-offset)]`,
    withIcon: "inline-flex items-center gap-refineui-size-xx-small",
    inline: "inline",
    disabled: "pointer-events-none cursor-not-allowed !text-refineui-alias-foreground-disabled !no-underline",
} as const;
