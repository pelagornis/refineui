/**
 * Accessibility contracts — declared in Component Spec, validated by Doctor.
 * Doctor checks declared contracts only (not full WCAG audit).
 */

export type AccessibilityAttributeType = "boolean" | "string" | "token";

export type AccessibilityAttributeContract = Readonly<{
    required: boolean;
    type?: AccessibilityAttributeType;
}>;

export type AccessibilityRelationshipAttribute =
    | "aria-controls"
    | "aria-labelledby"
    | "aria-describedby";

export type AccessibilityRelationshipContract = Readonly<{
    attribute: AccessibilityRelationshipAttribute;
    /** Target slot — `data-refineui` identity on the related element. */
    target: string;
    targetAttribute?: "id";
    required: boolean;
}>;

export type LabelingContract = Readonly<{
    accessibleName?: "required" | "optional";
    labelledBy?: string;
    describedBy?: string;
}>;

/** Per-slot a11y contract keyed by `data-refineui` (e.g. accordion-trigger). */
export type AccessibilitySlotContract = Readonly<{
    /** Required native element when `native: true` (Button → `<button>`). */
    element?: "button" | "div" | "input";
    role?: string;
    native?: boolean;
    requiredAttributes?: Readonly<Record<string, AccessibilityAttributeContract>>;
    relationships?: readonly AccessibilityRelationshipContract[];
    labeling?: LabelingContract;
}>;

/** Map `data-refineui` slot id → accessibility contract. */
export type AccessibilityContractMap = Readonly<Record<string, AccessibilitySlotContract>>;
