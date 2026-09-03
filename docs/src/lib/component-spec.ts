/**
 * Component Spec loader — canonical source: packages/react/spec/
 * Docs renders spec JSON only; no inferred contract content.
 */

export type ComponentSpecAnatomy = Readonly<Record<string, string>>;

export type ComponentSpecVariants = Readonly<Record<string, readonly string[]>>;

export type ComponentSpecStates = Readonly<{
    pseudo?: readonly string[];
    component?: Readonly<Record<string, readonly string[]>>;
    availability?: readonly string[];
    environment?: readonly string[];
}>;

export type AccessibilityAttributeContract = Readonly<{
    required: boolean;
    type?: string;
}>;

export type AccessibilitySlotContract = Readonly<{
    element?: string;
    role?: string;
    native?: boolean;
    requiredAttributes?: Readonly<Record<string, AccessibilityAttributeContract>>;
    relationships?: readonly Readonly<{
        attribute: string;
        target: string;
        targetAttribute?: string;
        required: boolean;
    }>[];
    labeling?: Readonly<Record<string, string>>;
}>;

export type KeyboardBinding =
    | string
    | Readonly<{
          action: string;
          native?: boolean;
      }>;

export type ComponentSpec = Readonly<{
    component: string;
    version: number;
    export?: string;
    anatomy?: ComponentSpecAnatomy;
    variants?: ComponentSpecVariants;
    states?: ComponentSpecStates;
    attributes?: Readonly<Record<string, string>>;
    dom?: Readonly<
        Record<
            string,
            Readonly<{
                states?: ComponentSpecStates;
            }>
        >
    >;
    accessibility?: Readonly<Record<string, AccessibilitySlotContract>>;
    keyboard?: Readonly<Record<string, KeyboardBinding>>;
    focus?: Readonly<{
        visual?: Readonly<{ required: boolean; selector: string }>;
        behavior?: Readonly<{
            trap?: boolean;
            initial?: string;
            return?: string;
            roving?: boolean;
        }>;
    }>;
    layout?: Readonly<{
        direction?: string;
        rtl?: boolean;
    }>;
    tokens?: Readonly<{ visual?: string }>;
    recipe?: string;
}>;

const specModules = import.meta.glob<ComponentSpec>("../../../packages/react/spec/components/*.json", {
    eager: true,
    import: "default",
});

const specById = new Map<string, ComponentSpec>(
    Object.entries(specModules).map(([path, spec]) => {
        const id = path.split("/").pop()?.replace(".json", "") ?? spec.component;
        return [id, spec];
    }),
);

/** All components with a JSON spec under packages/react/spec/components/. */
export const SUPPORTED_SPEC_RENDERER_COMPONENTS = [...specById.keys()].sort() as readonly string[];

export type SpecRendererComponentId = string;

export function isSpecRendererSupported(component: string): component is SpecRendererComponentId {
    return specById.has(component);
}

export function loadComponentSpec(componentId: string): ComponentSpec | null {
    return specById.get(componentId) ?? null;
}

export function normalizeKeyboardBinding(binding: KeyboardBinding): { action: string; native?: boolean } {
    if (typeof binding === "string") return { action: binding };
    return binding;
}
