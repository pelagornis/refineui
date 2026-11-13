/**
 * Toast recipe — visual mapping only.
 * Contract: packages/react/spec/components/toast.json
 * Tokens: componentTokens.toast (color ↔ Menu surface)
 */
import { clsx } from "clsx";
import { componentTypographyTokens } from "../tokens/componentTypographyTokens";
import { componentTextClass } from "../typography";
import { defineRecipe } from "./types";

export const toastRecipe = defineRecipe({
    name: "toast",
    base: "relative isolate box-border flex w-fit max-w-refineui-toast-max-width cursor-grab items-center gap-refineui-size-small rounded-refineui-x-large border-refineui-hairline border-refineui-alias-border-default bg-refineui-alias-background-primary py-refineui-size-medium ps-refineui-size-medium pe-refineui-size-large select-none",
    variants: {
        variant: {
            default: "",
            success: "",
            error: "",
            warning: "",
        },
    },
    defaultVariants: {
        variant: "default",
    },
    dataStates: ["default"],
});

export const toastStyles = {
    card: `${toastRecipe.base} touch-none [--refineui-toast-swipe-x:0] [--refineui-toast-swipe-y:0] [--refineui-toast-motion-duration:var(--refineui-motion-duration-toast-enter)] [--refineui-toast-motion-easing:var(--refineui-motion-easing-emphasized)] [transform:translate3d(var(--refineui-toast-swipe-x),var(--refineui-toast-swipe-y),0)] transition-[opacity,transform] duration-[var(--refineui-toast-motion-duration)] ease-[var(--refineui-toast-motion-easing)] shadow-refineui-toast will-change-[transform,opacity] motion-reduce:duration-[var(--refineui-motion-duration-instant)] motion-reduce:data-[stack-state=entering]:transform-none motion-reduce:[&[data-stack-state=leaving]:not([data-swipe-out])]:transform-none data-[swiping=true]:cursor-grabbing data-[swiping=true]:transition-none data-[swipe-out=left]:[--refineui-toast-swipe-x:-120%] data-[swipe-out=left]:opacity-0 data-[swipe-out=right]:[--refineui-toast-swipe-x:120%] data-[swipe-out=right]:opacity-0 data-[swipe-out=top]:[--refineui-toast-swipe-y:-120%] data-[swipe-out=top]:opacity-0 data-[swipe-out=bottom]:[--refineui-toast-swipe-y:120%] data-[swipe-out=bottom]:opacity-0 data-[stack-state=entering]:opacity-0 data-[stack-state=entering]:[transform:translate3d(var(--refineui-toast-swipe-x),var(--refineui-toast-slide-in-y,-100%),0)] data-[stack-state=leaving]:[--refineui-toast-motion-duration:var(--refineui-motion-duration-toast-leave)] data-[stack-state=leaving]:[--refineui-toast-motion-easing:var(--refineui-motion-easing-standard)] [&[data-stack-state=leaving]:not([data-swipe-out])]:opacity-0 [&[data-stack-state=leaving]:not([data-swipe-out])]:[transform:translate3d(var(--refineui-toast-swipe-x),var(--refineui-toast-slide-out-y,-100%),0)]`,
    iconWrap: "flex shrink-0 items-center justify-center self-center",
    contentWrap: "flex min-h-px min-w-0 flex-1 items-center",
    message: clsx(
        componentTextClass(componentTypographyTokens.toast.message),
        "text-refineui-alias-foreground-primary",
    ),
    actionButton: "shrink-0 whitespace-nowrap",
    toasterRoot: "group/toaster fixed start-1/2 top-[calc(var(--refineui-spacing-size-xxx-large)+var(--refineui-spacing-size-large)+env(safe-area-inset-top,0px))] z-refineui-messages box-border min-h-[var(--refineui-toast-collapsed-stack-height,var(--refineui-toast-front-height,0))] w-[min(calc(100%-env(safe-area-inset-left,0px)-env(safe-area-inset-right,0px)-2*var(--refineui-spacing-size-large)),var(--refineui-size-toast-max-width))] max-w-refineui-toast-max-width -translate-x-1/2 list-none p-0 pointer-events-none transition-[min-height] duration-[var(--refineui-motion-duration-panel)] ease-[var(--refineui-motion-easing-emphasized)] motion-reduce:duration-[var(--refineui-motion-duration-instant)] before:absolute before:inset-0 before:z-0 before:content-[''] before:pointer-events-auto group-hover/toaster:min-h-[var(--refineui-toast-expanded-stack-height,var(--refineui-toast-collapsed-stack-height,0))] max-[480px]:top-[calc(var(--refineui-spacing-size-xxx-large)+env(safe-area-inset-top,0px))] max-[480px]:w-[min(calc(100%-env(safe-area-inset-left,0px)-env(safe-area-inset-right,0px)-2*var(--refineui-spacing-size-medium)),var(--refineui-size-toast-max-width))]",
    stackItem: "absolute inset-x-0 top-0 z-[var(--refineui-toast-z-index,100)] flex justify-center overflow-visible pointer-events-auto translate-y-[var(--refineui-toast-offset-collapsed,0)] transition-[transform,height] duration-[var(--refineui-motion-duration-panel)] ease-[var(--refineui-motion-easing-emphasized)] group-hover/toaster:translate-y-[var(--refineui-toast-offset-expanded,0)]",
    scaleLayer: "relative box-border w-fit max-w-full origin-top scale-[calc(1-(var(--refineui-toast-stack-index,0)*0.018))] opacity-[calc(1-(var(--refineui-toast-stack-index,0)*0.12))] transition-[transform,opacity] duration-[var(--refineui-motion-duration-panel)] ease-[var(--refineui-motion-easing-emphasized)] group-hover/toaster:scale-100 group-hover/toaster:opacity-100",
} as const;
