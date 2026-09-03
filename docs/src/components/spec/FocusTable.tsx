import { SpecTable } from "../../docs-ui/page/SpecTable";

type FocusContract = Readonly<{
    visual?: Readonly<{ required: boolean; selector: string }>;
    behavior?: Readonly<{
        trap?: boolean;
        initial?: string;
        return?: string;
        roving?: boolean;
    }>;
}>;

export function FocusTable({ focus }: { focus: FocusContract }) {
    const rows: Array<{ section: string; property: string; value: string }> = [];

    if (focus.visual) {
        rows.push(
            {
                section: "visual",
                property: "required",
                value: String(focus.visual.required),
            },
            {
                section: "visual",
                property: "selector",
                value: focus.visual.selector,
            },
        );
    }

    if (focus.behavior) {
        for (const [property, value] of Object.entries(focus.behavior)) {
            if (value === undefined) continue;
            rows.push({
                section: "behavior",
                property,
                value: String(value),
            });
        }
    }

    if (rows.length === 0) return null;

    return (
        <SpecTable
            aria-label="Focus"
            columns={[
                { key: "section", header: "Section", mono: true },
                { key: "property", header: "Property", mono: true },
                { key: "value", header: "Value", mono: true },
            ]}
            rows={rows}
        />
    );
}
