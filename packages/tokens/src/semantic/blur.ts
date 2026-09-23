/**
 * Semantic blur roles — meaning layer over Foundation `blurs`.
 *
 * UI and `refineui.css` should prefer these role names (`overlayScrim`,
 * `surfaceFrost`), not raw Foundation steps.
 *
 * Flow: Foundation `blurs` → `semanticBlur` → CSS `--refineui-blur-*`
 */
import { blurs } from "../global/blurs";
import type { FoundationBlurName, SemanticBlurTokens } from "../types";

/**
 * Maps each semantic blur role → Foundation blur key for CSS
 * `--refineui-blur-*` → `var(--refineui-foundation-blur-*)`.
 */
export const semanticBlurFoundationKeys = {
    /** Dialog / Drawer scrim — light frosted dim behind modal chrome */
    overlayScrim: "blur2",
    /** Frosted glass surfaces (menus, toast plate, …) */
    surfaceFrost: "blur16",
} as const satisfies Record<keyof SemanticBlurTokens, FoundationBlurName>;

export type SemanticBlurName = keyof typeof semanticBlurFoundationKeys;

function fromFoundation<K extends SemanticBlurName>(
    key: K,
): (typeof blurs)[(typeof semanticBlurFoundationKeys)[K]] {
    return blurs[semanticBlurFoundationKeys[key]];
}

/** Resolved blur strings for JS layout math. Source of truth is Foundation. */
export const semanticBlur = {
    overlayScrim: fromFoundation("overlayScrim"),
    surfaceFrost: fromFoundation("surfaceFrost"),
} as const satisfies SemanticBlurTokens;
