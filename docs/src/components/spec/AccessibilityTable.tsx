import { SpecTable } from "../../docs-ui/page/SpecTable";
import type { AccessibilitySlotContract } from "../../lib/component-spec";

function formatRequiredAttributes(
    attrs: AccessibilitySlotContract["requiredAttributes"],
): string | undefined {
    if (!attrs) return undefined;

    return Object.entries(attrs)
        .map(([name, contract]) => {
            const type = contract.type ? `, type: ${contract.type}` : "";
            return `${name}: required=${contract.required}${type}`;
        })
        .join("; ");
}

function formatRelationships(
    relationships: AccessibilitySlotContract["relationships"],
): string | undefined {
    if (!relationships?.length) return undefined;

    return relationships
        .map((rel) => {
            const targetAttr = rel.targetAttribute ? `.${rel.targetAttribute}` : "";
            return `${rel.attribute} → ${rel.target}${targetAttr} (required=${rel.required})`;
        })
        .join("; ");
}

function formatLabeling(labeling: AccessibilitySlotContract["labeling"]): string | undefined {
    if (!labeling) return undefined;
    return Object.entries(labeling)
        .map(([key, value]) => `${key}: ${value}`)
        .join("; ");
}

export function AccessibilityTable({
    accessibility,
}: {
    accessibility: Readonly<Record<string, AccessibilitySlotContract>>;
}) {
    const rows = Object.entries(accessibility).map(([slot, contract]) => ({
        slot,
        element: contract.element,
        role: contract.role,
        native: contract.native,
        requiredAttributes: formatRequiredAttributes(contract.requiredAttributes),
        relationships: formatRelationships(contract.relationships),
        labeling: formatLabeling(contract.labeling),
    }));

    const columns = [
        { key: "slot", header: "Slot", mono: true as const },
        { key: "element", header: "Element", mono: true as const },
        { key: "role", header: "Role", mono: true as const },
        { key: "native", header: "Native", mono: true as const },
        { key: "requiredAttributes", header: "Required attributes" },
        { key: "relationships", header: "Relationships" },
        { key: "labeling", header: "Labeling" },
    ].filter((col) => rows.some((row) => row[col.key as keyof typeof row] !== undefined));

    return (
        <SpecTable
            aria-label="Accessibility"
            columns={columns}
            rows={rows.map((row) =>
                Object.fromEntries(
                    columns.map((col) => [
                        col.key,
                        row[col.key as keyof typeof row] === undefined
                            ? "—"
                            : String(row[col.key as keyof typeof row]),
                    ]),
                ),
            )}
        />
    );
}
