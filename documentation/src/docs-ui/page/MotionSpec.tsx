import { SpecTable } from "./SpecTable";

export type MotionRow = {
    property: string;
    duration: string;
    easing: string;
    notes?: string;
};

/** Motion as a first-class primitive — token names only, no raw ms. */
export function MotionSpec({ rows }: { rows: MotionRow[] }) {
    return (
        <SpecTable
            aria-label="Motion specification"
            columns={[
                { key: "property", header: "Property" },
                { key: "duration", header: "Duration", mono: true },
                { key: "easing", header: "Easing", mono: true },
                { key: "notes", header: "Notes" },
            ]}
            rows={rows.map((row) => ({
                property: row.property,
                duration: row.duration,
                easing: row.easing,
                notes: row.notes ?? "—",
            }))}
        />
    );
}
