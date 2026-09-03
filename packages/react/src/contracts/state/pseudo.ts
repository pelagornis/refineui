/**
 * Pseudo states — browser-managed via CSS pseudo-classes.
 * Implemented in `refineui.css`, not set from TSX as `data-state`.
 */
export type PseudoState =
    | "hover"
    | "active"
    | "focus"
    | "focus-visible"
    | "focus-within"
    | "visited"
    | "target";

export type PseudoStateContract = Readonly<{
    /** CSS pseudo-class names (without colon). */
    states: readonly PseudoState[];
    /** Where pseudo interaction styles live. */
    implementation: "refineui.css";
}>;

export const PSEUDO_STATE_CONTRACT: PseudoStateContract = {
    states: ["hover", "active", "focus-visible", "focus-within"],
    implementation: "refineui.css",
} as const;
