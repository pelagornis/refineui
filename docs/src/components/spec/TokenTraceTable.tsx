import { SpecTable } from "../../docs-ui/page/SpecTable";
import type { ResolvedTokenTrace } from "../../lib/token-trace";

export function TokenTraceTable({
    rows,
    "aria-label": ariaLabel = "Token trace",
}: {
    rows: readonly ResolvedTokenTrace[];
    "aria-label"?: string;
}) {
    if (rows.length === 0) {
        return null;
    }

    return (
        <SpecTable
            aria-label={ariaLabel}
            columns={[
                { key: "traceKey", header: "Trace", mono: true },
                { key: "semantic", header: "Semantic", mono: true },
                { key: "lightFoundation", header: "Light foundation", mono: true },
                { key: "darkFoundation", header: "Dark foundation", mono: true },
                { key: "lightValue", header: "Light", mono: true },
                { key: "darkValue", header: "Dark", mono: true },
            ]}
            rows={rows.map((row) => ({
                traceKey: row.traceKey,
                semantic: row.semantic,
                lightFoundation: row.lightFoundation,
                darkFoundation: row.darkFoundation,
                lightValue: row.lightValue,
                darkValue: row.darkValue,
            }))}
        />
    );
}

export function RecipeTokenTable({
    rows,
}: {
    rows: ReadonlyArray<{
        slot: string;
        variant: string;
        property: string;
        traceKey: string;
        semantic: string;
        lightFoundation: string;
        darkFoundation: string;
        recipeClass: string;
    }>;
}) {
    if (rows.length === 0) return null;

    return (
        <SpecTable
            aria-label="Recipe token trace"
            columns={[
                { key: "slot", header: "Slot", mono: true },
                { key: "variant", header: "Variant", mono: true },
                { key: "property", header: "Property", mono: true },
                { key: "traceKey", header: "Trace", mono: true },
                { key: "semantic", header: "Semantic", mono: true },
                { key: "lightFoundation", header: "Light → foundation", mono: true },
                { key: "darkFoundation", header: "Dark → foundation", mono: true },
                { key: "recipeClass", header: "Recipe class", mono: true },
            ]}
            rows={rows.map((row) => ({
                slot: row.slot,
                variant: row.variant,
                property: row.property,
                traceKey: row.traceKey,
                semantic: row.semantic,
                lightFoundation: row.lightFoundation,
                darkFoundation: row.darkFoundation,
                recipeClass: row.recipeClass,
            }))}
        />
    );
}
