/**
 * Recipe model — explicit layer between component tokens and component implementation.
 * Inspired by Panda CSS recipes; `style.ts` may re-export recipe output during migration.
 *
 * SlotRecipe v1 is visual-only. Contracts (states, a11y, keyboard, focus) live in Component Spec.
 */

/** CSS pseudo-class interaction states — documented on single-part recipes only. */
export type CssInteractionState = "hover" | "active" | "focus-visible" | "disabled";

/** Component-owned states exposed via `data-state`. */
export type ComponentDataState =
    | "default"
    | "open"
    | "closed"
    | "selected"
    | "checked"
    | "expanded"
    | "collapsed"
    | "pressed"
    | "loading"
    | "active";

export type RecipeVariantMap = Readonly<Record<string, Readonly<Record<string, string>>>>;

export type RecipeCompoundVariant = Readonly<{
    /** Variant keys that must all match (e.g. variant + disabled). */
    match: Readonly<Record<string, string | boolean>>;
    className: string;
}>;

/** Single-part component recipe (Button, Input, Badge, …). */
export type ComponentRecipe = Readonly<{
    name: string;
    base: string;
    variants?: RecipeVariantMap;
    compoundVariants?: readonly RecipeCompoundVariant[];
    defaultVariants?: Readonly<Record<string, string>>;
    /** CSS pseudo states owned by refineui.css — documented for Doctor/MCP. */
    cssStates?: readonly CssInteractionState[];
    /** Component states via data-state — documented for Doctor/MCP. */
    dataStates?: readonly ComponentDataState[];
}>;

/** Per-slot class strings keyed by slot name. */
export type SlotClassMap = Readonly<Record<string, string>>;

/** Variant axis → value → partial slot class overrides. */
export type SlotVariantMap = Readonly<Record<string, Readonly<Record<string, SlotClassMap>>>>;

export type SlotCompoundVariant = Readonly<{
    match: Readonly<Record<string, string | boolean>>;
    slots: SlotClassMap;
}>;

/**
 * Multi-part slot recipe v1 — visual composition only.
 * Canonical shape: slots → base → variants → compoundVariants → defaultVariants
 */
export type SlotRecipe = Readonly<{
    name: string;
    slots: readonly string[];
    base: SlotClassMap;
    variants?: SlotVariantMap;
    compoundVariants?: readonly SlotCompoundVariant[];
    defaultVariants?: Readonly<Record<string, string>>;
}>;

export function defineRecipe<T extends ComponentRecipe>(recipe: T): T {
    return recipe;
}

function assertSlotRecipe(recipe: SlotRecipe): void {
    for (const key of Object.keys(recipe.base)) {
        if (!recipe.slots.includes(key)) {
            throw new Error(
                `Slot recipe "${recipe.name}": base key "${key}" is not listed in slots`,
            );
        }
    }

    if (!recipe.variants) return;

    for (const [axis, values] of Object.entries(recipe.variants)) {
        for (const slotMap of Object.values(values)) {
            for (const slot of Object.keys(slotMap)) {
                if (!recipe.slots.includes(slot)) {
                    throw new Error(
                        `Slot recipe "${recipe.name}": variants.${axis} references unknown slot "${slot}"`,
                    );
                }
            }
        }
    }

    for (const compound of recipe.compoundVariants ?? []) {
        for (const slot of Object.keys(compound.slots)) {
            if (!recipe.slots.includes(slot)) {
                throw new Error(
                    `Slot recipe "${recipe.name}": compoundVariants references unknown slot "${slot}"`,
                );
            }
        }
    }
}

export function defineSlotRecipe<T extends SlotRecipe>(recipe: T): T {
    assertSlotRecipe(recipe);
    return recipe;
}

/** Merge base + variant + compound slot classes for runtime consumption. */
export function resolveSlotClasses(
    recipe: SlotRecipe,
    slot: string,
    variants: Readonly<Record<string, string | undefined>> = {},
): string {
    if (!recipe.slots.includes(slot)) return "";

    const merged: Record<string, string> = { ...recipe.defaultVariants };
    for (const [key, value] of Object.entries(variants)) {
        if (value !== undefined) merged[key] = value;
    }

    const parts: string[] = [];
    const baseClass = recipe.base[slot];
    if (baseClass) parts.push(baseClass);

    if (recipe.variants) {
        for (const [axis, value] of Object.entries(merged)) {
            const slotMap = recipe.variants[axis]?.[value];
            const variantClass = slotMap?.[slot];
            if (variantClass) parts.push(variantClass);
        }
    }

    for (const compound of recipe.compoundVariants ?? []) {
        const matches = Object.entries(compound.match).every(
            ([key, expected]) => merged[key] === String(expected),
        );
        if (matches) {
            const compoundClass = compound.slots[slot];
            if (compoundClass) parts.push(compoundClass);
        }
    }

    return parts.join(" ");
}
