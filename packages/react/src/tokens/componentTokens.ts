/**
 * Component token registry.
 *
 * This is the single component-facing entry point for visual decisions. The
 * individual maps remain separately exported for compatibility, but new
 * component work should add its color, type, size, elevation, and motion role
 * here before implementing a recipe or stylesheet.
 *
 * Layering: Foundation → Semantic → Component token (here) → Recipe / CSS.
 */
import { componentSizes, semanticElevations, semanticInteraction } from "@refineui/tokens";
import { componentColorTokens } from "./componentColorTokens";
import { componentTypographyTokens } from "./componentTypographyTokens";

const motion = {
    fast: {
        duration: semanticInteraction.duration.fast,
        easing: semanticInteraction.easing.easeOut,
    },
    indicator: {
        duration: semanticInteraction.duration.medium,
        easing: semanticInteraction.easing.emphasized,
    },
    panel: {
        duration: semanticInteraction.duration.panel,
        easing: semanticInteraction.easing.panel,
    },
} as const;

export const componentTokens = {
    color: componentColorTokens,
    typography: componentTypographyTokens,
    motion,
    elevation: semanticElevations,

    toast: {
        color: componentColorTokens.toast,
        typography: componentTypographyTokens.toast,
        size: {
            minWidth: componentSizes.toastMinWidth,
            maxWidth: componentSizes.toastMaxWidth,
        },
        elevation: {
            role: "toast" as const,
            foundation: semanticElevations.toast,
        },
        motion: {
            enter: semanticInteraction.duration.toastEnter,
            leave: semanticInteraction.duration.toastLeave,
            easing: semanticInteraction.easing.emphasized,
        },
    },

    segmentedControl: {
        color: componentColorTokens.segmentedControl,
        typography: componentTypographyTokens.segmentedControl,
        elevation: {
            /** Selected thumb — recipe `shadow-refineui-2` / surface */
            role: "surface" as const,
            foundation: semanticElevations.surface,
        },
        motion: {
            /**
             * Indicator slide after first layout.
             * CSS applies transform=`medium` / width=`slow` so edges arrive apart.
             */
            indicator: motion.indicator,
            /** Item label color fade */
            itemColor: motion.fast,
        },
    },

    button: {
        color: componentColorTokens.button,
        typography: componentTypographyTokens.button,
        motion: {
            pressScale: semanticInteraction.scale.press,
            color: motion.fast,
        },
    },

    chip: {
        color: componentColorTokens.chip,
        typography: componentTypographyTokens.chip,
    },

    badge: {
        color: componentColorTokens.badge,
    },

    alert: {
        color: componentColorTokens.alert,
        typography: componentTypographyTokens.alert,
    },

    dialog: {
        color: componentColorTokens.dialog,
        typography: componentTypographyTokens.dialog,
        elevation: {
            role: "modal" as const,
            foundation: semanticElevations.modal,
        },
        motion: {
            enterScale: semanticInteraction.scale.dialogEnter,
            panel: motion.panel,
        },
    },

    drawer: {
        color: componentColorTokens.drawer,
        typography: componentTypographyTokens.drawer,
        motion: {
            panel: motion.panel,
        },
    },

    accordion: {
        color: componentColorTokens.accordion,
        typography: componentTypographyTokens.accordion,
        motion: {
            panel: semanticInteraction.duration.accordionPanel,
            content: semanticInteraction.duration.accordionContent,
        },
    },

    tabs: {
        // underline indicator shares the same mount/slide motion contract
        motion: {
            indicator: motion.indicator,
        },
    },

    input: {
        color: componentColorTokens.input,
        typography: componentTypographyTokens.formControl,
    },

    checkbox: {
        color: componentColorTokens.checkbox,
    },

    radio: {
        color: componentColorTokens.radio,
    },

    switch: {
        color: componentColorTokens.switch,
    },

    toggle: {
        color: componentColorTokens.toggle,
    },
} as const;

export type ComponentTokens = typeof componentTokens;
