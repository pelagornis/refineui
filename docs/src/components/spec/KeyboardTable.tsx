import { SpecTable } from "../../docs-ui/page/SpecTable";
import { normalizeKeyboardBinding, type KeyboardBinding } from "../../lib/component-spec";

export function KeyboardTable({ keyboard }: { keyboard: Readonly<Record<string, KeyboardBinding>> }) {
    const rows = Object.entries(keyboard).map(([key, binding]) => {
        const normalized = normalizeKeyboardBinding(binding);
        return {
            key,
            action: normalized.action,
            native: normalized.native === true ? "true" : normalized.native === false ? "false" : "—",
        };
    });

    return (
        <SpecTable
            aria-label="Keyboard"
            columns={[
                { key: "key", header: "Key", mono: true },
                { key: "action", header: "Action", mono: true },
                { key: "native", header: "Native", mono: true },
            ]}
            rows={rows}
        />
    );
}
