/**
 * Layout contracts — directionality (LTR/RTL) declared in Component Spec.
 * Doctor validates logical properties / absence of physical left-right utilities.
 */

export type LayoutDirection = "logical" | "physical";

export type LayoutContract = Readonly<{
    /** Prefer CSS logical properties / Tailwind logical utilities. */
    direction?: LayoutDirection;
    /** Component must remain usable under `[dir="rtl"]`. */
    rtl?: boolean;
}>;
