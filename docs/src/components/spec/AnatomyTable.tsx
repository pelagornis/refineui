import { SpecTable } from "../../docs-ui/page/SpecTable";

export function AnatomyTable({ anatomy }: { anatomy: Readonly<Record<string, string>> }) {
    const rows = Object.entries(anatomy).map(([part, slot]) => ({
        part,
        slot,
    }));

    return (
        <SpecTable
            aria-label="Anatomy"
            columns={[
                { key: "part", header: "Part", mono: true },
                { key: "slot", header: "data-refineui", mono: true },
            ]}
            rows={rows}
        />
    );
}
