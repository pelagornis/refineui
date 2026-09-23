/**
 * Foundation blur primitives — raw `backdrop-filter` / filter blur steps.
 * Semantic roles live in `semantic/blur.ts` and must reference these values
 * (do not invent px at the semantic or component layer).
 *
 * Naming: value-based keys (`blur2`, `blur8`), same idea as `foundationSize160`.
 */
import type { FoundationBlurTokens } from "../types";

export const blurs: FoundationBlurTokens = {
    blurNone: "0",
    blur2: "2px",
    blur4: "4px",
    blur8: "8px",
    blur12: "12px",
    blur16: "16px",
};
