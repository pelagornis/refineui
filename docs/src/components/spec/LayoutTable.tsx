import { SpecTable } from "../../docs-ui/page/SpecTable";

type LayoutContract = Readonly<{
    direction?: string;
    rtl?: boolean;
}>;

export function LayoutTable({ layout }: { layout: LayoutContract }) {
    const rows: Array<{ property: string; value: string }> = [];

    if (layout.direction !== undefined) {
        rows.push({ property: "direction", value: layout.direction });
    }
    if (layout.rtl !== undefined) {
        rows.push({ property: "rtl", value: String(layout.rtl) });
    }

    if (rows.length === 0) return null;

    return (
        <SpecTable
            aria-label="Layout"
            columns={[
                { key: "property", header: "Property", mono: true },
                { key: "value", header: "Value", mono: true },
            ]}
            rows={rows}
        />
    );
}
