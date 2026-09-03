/**
 * Button recipe — visual mapping only.
 * Contract (states, a11y, keyboard): packages/react/spec/components/button.json
 */
import { componentTypographyTokens } from "../tokens/componentTypographyTokens";
import { sizedComponentTextClass } from "../typography";
import { defineRecipe } from "./types";
import type { ButtonSize, ButtonVariant } from "../components/Button/types";

const buttonVariantClass: Record<ButtonVariant, string> = {
    primary:
        "border-refineui-none border border-transparent bg-refineui-alias-background-brand text-refineui-alias-foreground-inversed",
    secondary:
        "border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-surface text-refineui-alias-foreground-primary",
    outline:
        "border-refineui-thin border-refineui-alias-border-default bg-transparent text-refineui-alias-foreground-primary",
    ghost: "border-refineui-none border border-transparent bg-transparent text-refineui-alias-foreground-primary",
};

const buttonLabelSizeClass: Record<ButtonSize, string> = {
    sm: `min-h-refineui-button-min-height-sm gap-refineui-size-xx-small rounded-refineui-large px-refineui-size-medium py-refineui-size-xx-small ${sizedComponentTextClass(componentTypographyTokens.button, "sm")}`,
    md: `min-h-refineui-button-min-height-md gap-refineui-size-xx-small rounded-refineui-x-large px-refineui-size-medium py-refineui-size-x-small ${sizedComponentTextClass(componentTypographyTokens.button, "md")}`,
    lg: `min-h-refineui-button-min-height-lg gap-refineui-size-xx-small rounded-refineui-xx-large px-refineui-size-large py-refineui-size-medium ${sizedComponentTextClass(componentTypographyTokens.button, "lg")}`,
};

const buttonIconSizeClass: Record<ButtonSize, string> = {
    sm: "min-h-refineui-button-min-height-sm min-w-refineui-button-min-height-sm shrink-0 gap-0 rounded-refineui-large p-refineui-size-xx-small leading-none",
    md: "min-h-refineui-button-min-height-md min-w-refineui-button-min-height-md shrink-0 gap-0 rounded-refineui-x-large p-refineui-size-x-small leading-none",
    lg: "min-h-refineui-button-min-height-lg min-w-refineui-button-min-height-lg shrink-0 gap-0 rounded-refineui-xx-large p-refineui-size-medium leading-none",
};

export const buttonRecipe = defineRecipe({
    name: "button",
    base: "box-border inline-flex cursor-pointer items-center justify-center border transition-[opacity,background-color,border-color,color,transform] duration-[var(--refineui-motion-duration-fast)] ease-[var(--refineui-motion-easing-ease-out)]",
    variants: {
        variant: buttonVariantClass,
        layout: {
            label: "",
            icon: "",
        },
        size: {
            sm: "",
            md: "",
            lg: "",
        },
    },
    compoundVariants: [
        {
            match: { variant: "ghost", layout: "icon" },
            className:
                "border-refineui-none border border-transparent bg-transparent text-refineui-alias-foreground-secondary hover:text-refineui-alias-foreground-primary-hover",
        },
        {
            match: { layout: "icon", variant: "primary" },
            className: "border-0",
        },
        {
            match: { layout: "icon", variant: "ghost" },
            className: "border-0",
        },
    ],
    defaultVariants: {
        variant: "primary",
        layout: "label",
        size: "md",
    },
    cssStates: ["hover", "active", "focus-visible", "disabled"],
    dataStates: ["default", "loading"],
});

/** Resolved class maps consumed by Button/style.ts and component spec. */
export const buttonStyles = {
    base: buttonRecipe.base,
    iconGhost: buttonRecipe.compoundVariants?.[0]?.className ?? "",
} as const;

export { buttonVariantClass, buttonLabelSizeClass, buttonIconSizeClass };
