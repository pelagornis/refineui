/**
 * Environment — user/OS context; not set on components as `data-state`.
 */
export type EnvironmentContext =
    | "prefers-reduced-motion"
    | "forced-colors"
    | "prefers-contrast"
    | "prefers-color-scheme"
    | "pointer"
    | "viewport"
    | "dir";

export type EnvironmentStateContract = Readonly<{
    contexts: readonly EnvironmentContext[];
    selectors: Readonly<Record<EnvironmentContext, string>>;
}>;

export const ENVIRONMENT_STATE_CONTRACT: EnvironmentStateContract = {
    contexts: [
        "prefers-reduced-motion",
        "forced-colors",
        "prefers-contrast",
        "prefers-color-scheme",
        "dir",
    ],
    selectors: {
        "prefers-reduced-motion": "@media (prefers-reduced-motion: reduce)",
        "forced-colors": "@media (forced-colors: active)",
        "prefers-contrast": "@media (prefers-contrast: more)",
        "prefers-color-scheme": "[data-theme=\"dark\"], .dark",
        pointer: "@media (pointer: coarse)",
        viewport: "@media",
        dir: "[dir=\"rtl\"]",
    },
} as const;
