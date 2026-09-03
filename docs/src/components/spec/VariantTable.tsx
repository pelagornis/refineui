import { SpecTable } from "../../docs-ui/page/SpecTable";

export function VariantTable({ variants }: { variants: Readonly<Record<string, readonly string[]>> }) {
    const rows = Object.entries(variants).map(([axis, values]) => ({
        axis,
        values: values.join(", "),
    }));

    return (
        <SpecTable
            aria-label="Variants"
            columns={[
                { key: "axis", header: "Axis", mono: true },
                { key: "values", header: "Values", mono: true },
            ]}
            rows={rows}
        />
    );
}
