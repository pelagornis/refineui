/**
 * Component states — semantic UI state owned by the component (not CSS pseudo).
 * Exposed via `data-state`, `aria-expanded`, `aria-selected`, etc.
 */
export type ComponentStateAttribute = "data-state" | "aria-expanded" | "aria-selected" | "aria-checked";

export type ComponentStateDefinition = Readonly<{
    name: string;
    values: readonly string[];
    attribute: ComponentStateAttribute;
}>;

export type ComponentStateContract = Readonly<{
    definitions: readonly ComponentStateDefinition[];
}>;

/** Per `data-refineui` identity → allowed component state definitions. */
export type ComponentStateSchema = Readonly<
    Record<string, readonly ComponentStateDefinition[]>
>;

export function defineComponentState<T extends ComponentStateDefinition>(def: T): T {
    return def;
}

export function isAllowedComponentState(
    schema: ComponentStateSchema,
    dataRefineui: string,
    attribute: ComponentStateAttribute,
    value: string,
): boolean {
    const defs = schema[dataRefineui];
    if (!defs?.length) return true;
    const match = defs.find((d) => d.attribute === attribute);
    if (!match) return true;
    return match.values.includes(value);
}

export function expectedComponentStateValues(
    schema: ComponentStateSchema,
    dataRefineui: string,
    attribute: ComponentStateAttribute,
): readonly string[] | undefined {
    return schema[dataRefineui]?.find((d) => d.attribute === attribute)?.values;
}
