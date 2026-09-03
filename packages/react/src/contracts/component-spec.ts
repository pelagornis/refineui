/**
 * Component Spec — behavior/visual contract (Contract Layer).
 *
 * Source of truth: `packages/react/spec/components/*.json`
 * Consumed by: Doctor (validate), MCP (explain), Docs (render)
 */
import type { AccessibilityContractMap } from "./accessibility";
import type { FocusContract } from "./focus";
import type { KeyboardContract } from "./keyboard";
import type { LayoutContract } from "./layout";
import type { ComponentStateAttribute } from "./state/component";

export type ComponentSpecVersion = 1;

export type ComponentSpecAnatomy = Readonly<Record<string, string>>;

export type ComponentSpecVariants = Readonly<Record<string, readonly string[]>>;

export type ComponentSpecStates = Readonly<{
    pseudo?: readonly string[];
    component?: Readonly<Record<ComponentStateAttribute, readonly string[]>>;
    availability?: readonly string[];
    /** Environment contexts — e.g. forced-colors (not data-state). */
    environment?: readonly string[];
}>;

/** Machine-readable component contract — not implementation documentation. */
export type ComponentSpec = Readonly<{
    $schema?: string;
    component: string;
    version: ComponentSpecVersion;
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
    /** Slot-keyed accessibility contracts (`data-refineui` → contract). */
    accessibility?: AccessibilityContractMap;
    keyboard?: KeyboardContract;
    focus?: FocusContract;
    layout?: LayoutContract;
    tokens?: Readonly<{ visual?: string }>;
    recipe?: string;
    export?: string;
}>;

export type ComponentManifestEntry = Readonly<{
    name: string;
    id: string;
    spec: string;
    recipe?: string;
    export: string;
    dataRefineui: readonly string[];
}>;

export type ComponentManifest = Readonly<{
    schemaVersion: number;
    contractLayer: "component-spec";
    components: readonly ComponentManifestEntry[];
}>;

export type {
    AccessibilityAttributeContract,
    AccessibilityAttributeType,
    AccessibilityContractMap,
    AccessibilityRelationshipAttribute,
    AccessibilityRelationshipContract,
    AccessibilitySlotContract,
    LabelingContract,
} from "./accessibility";
export type {
    FocusBehaviorContract,
    FocusContract,
    FocusInitialTarget,
    FocusReturnTarget,
    FocusVisualContract,
    FocusVisualSelector,
} from "./focus";
export type {
    KeyboardAction,
    KeyboardBindingContract,
    KeyboardContract,
} from "./keyboard";
export { normalizeKeyboardBinding } from "./keyboard";
export type { LayoutContract, LayoutDirection } from "./layout";
