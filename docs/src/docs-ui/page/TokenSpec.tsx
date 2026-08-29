import { SpecTable } from "./SpecTable";

export type TokenRowData = {
    token: string;
    role: string;
    value?: string;
};

/** Component / foundation token map — RefineUI Table. */
export function TokenSpec({
    rows,
    columns = "full",
    "aria-label": ariaLabel = "Tokens",
}: {
    rows: TokenRowData[];
    /** `full` = Token · Role · Value; `pair` = Token · Typical use (role column). */
    columns?: "full" | "pair";
    "aria-label"?: string;
}) {
    if (columns === "pair") {
        return (
            <SpecTable
                aria-label={ariaLabel}
                columns={[
                    { key: "token", header: "Token", mono: true },
                    { key: "role", header: "Typical use" },
                ]}
                rows={rows.map((row) => ({ token: row.token, role: row.role }))}
            />
        );
    }

    return (
        <SpecTable
            aria-label={ariaLabel}
            columns={[
                { key: "token", header: "Token", mono: true },
                { key: "role", header: "Role" },
                { key: "value", header: "Value", mono: true },
            ]}
            rows={rows.map((row) => ({
                token: row.token,
                role: row.role,
                value: row.value ?? "—",
            }))}
        />
    );
}
