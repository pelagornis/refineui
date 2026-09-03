import { SpecTable } from "../../docs-ui/page/SpecTable";
import type { ComponentSpecStates } from "../../lib/component-spec";

type StateRow = {
    scope: string;
    category: string;
    detail: string;
};

function collectStateRows(scope: string, states: ComponentSpecStates | undefined): StateRow[] {
    if (!states) return [];

    const rows: StateRow[] = [];

    if (states.pseudo?.length) {
        rows.push({
            scope,
            category: "pseudo",
            detail: states.pseudo.join(", "),
        });
    }

    if (states.component) {
        for (const [attribute, values] of Object.entries(states.component)) {
            rows.push({
                scope,
                category: "component",
                detail: `${attribute}: ${values.join(", ")}`,
            });
        }
    }

    if (states.availability?.length) {
        rows.push({
            scope,
            category: "availability",
            detail: states.availability.join(", "),
        });
    }

    if (states.environment?.length) {
        rows.push({
            scope,
            category: "environment",
            detail: states.environment.join(", "),
        });
    }

    return rows;
}

export function StateTable({
    states,
    dom,
}: {
    states?: ComponentSpecStates;
    dom?: Readonly<Record<string, Readonly<{ states?: ComponentSpecStates }>>>;
}) {
    const rows: StateRow[] = collectStateRows("component", states);

    if (dom) {
        for (const [slot, contract] of Object.entries(dom)) {
            rows.push(...collectStateRows(slot, contract.states));
        }
    }

    if (rows.length === 0) return null;

    return (
        <SpecTable
            aria-label="States"
            columns={[
                { key: "scope", header: "Scope", mono: true },
                { key: "category", header: "Category", mono: true },
                { key: "detail", header: "Values", mono: true },
            ]}
            rows={rows}
        />
    );
}
