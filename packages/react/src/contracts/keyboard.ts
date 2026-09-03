/**
 * Keyboard contracts — declared in Component Spec, validated by Doctor.
 * Doctor checks declared bindings only (not full interaction audit).
 */

export type KeyboardAction =
    | "activate"
    | "close"
    | "next-trigger"
    | "previous-trigger"
    | "first-trigger"
    | "last-trigger";

export type KeyboardBindingContract = Readonly<{
    action: KeyboardAction;
    /** When true, native element handles the key (e.g. `<button>` Enter/Space). */
    native?: boolean;
}>;

/** Key name → binding. Shorthand string values normalize to `{ action }`. */
export type KeyboardContract = Readonly<Record<string, KeyboardBindingContract | KeyboardAction>>;

export function normalizeKeyboardBinding(
    binding: KeyboardBindingContract | KeyboardAction,
): KeyboardBindingContract {
    if (typeof binding === "string") return { action: binding };
    return binding;
}
