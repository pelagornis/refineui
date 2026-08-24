import { SpecTable } from "./SpecTable";

export type PropRow = {
    prop: string;
    default?: string;
    type: string;
    description: string;
};

/** Component API prop table — RefineUI Table. */
export function PropSpec({
    rows,
    "aria-label": ariaLabel = "API props",
}: {
    rows: PropRow[];
    "aria-label"?: string;
}) {
    return (
        <SpecTable
            aria-label={ariaLabel}
            columns={[
                { key: "prop", header: "Prop", mono: true },
                { key: "default", header: "Default", mono: true },
                { key: "type", header: "Type", mono: true },
                { key: "description", header: "Description" },
            ]}
            rows={rows.map((row) => ({
                prop: row.prop,
                default: row.default ?? "—",
                type: row.type,
                description: row.description,
            }))}
        />
    );
}
