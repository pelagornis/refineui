import { SpecTable } from "./SpecTable";

export type A11yRow = {
    concern: string;
    implementation: string;
};

export function A11ySpec({ rows }: { rows: A11yRow[] }) {
    return (
        <SpecTable
            aria-label="Accessibility"
            columns={[
                { key: "concern", header: "Concern" },
                { key: "implementation", header: "Implementation" },
            ]}
            rows={rows.map((row) => ({
                concern: row.concern,
                implementation: row.implementation,
            }))}
        />
    );
}
