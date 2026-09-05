import {
    ScrollArea,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@refineui/react";

export type SpecColumn = {
    key: string;
    header: string;
    /** Monospace cell content (token / type / CSS names). */
    mono?: boolean;
    /** When set, cell text becomes a link using this row field as href. */
    hrefKey?: string;
};

export type SpecRow = Record<string, string | undefined>;

const cellBase = "whitespace-nowrap";
const cellMono = "font-mono whitespace-nowrap";
const cellMuted = "text-refineui-alias-foreground-secondary whitespace-nowrap";

/** Docs reference table — horizontal overflow owned by ScrollArea; height follows content. */
export function SpecTable({
    columns,
    rows,
    "aria-label": ariaLabel = "Specification",
}: {
    columns: SpecColumn[];
    rows: SpecRow[];
    "aria-label"?: string;
}) {
    return (
        <div data-docs-ui="spec-table">
            <ScrollArea type="hover" className="w-full min-w-0">
                <ScrollAreaViewport>
                    <Table aria-label={ariaLabel}>
                        <TableHeader>
                            <TableRow>
                                {columns.map((col) => (
                                    <TableHead key={col.key}>{col.header}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={rowKey(row, columns, index)}>
                                    {columns.map((col, colIndex) => {
                                        const raw = row[col.key] ?? "—";
                                        const href = col.hrefKey ? row[col.hrefKey] : undefined;
                                        const className = cellClass(col, colIndex === 0);
                                        return (
                                            <TableCell key={col.key} className={className}>
                                                {href ? (
                                                    <a
                                                        href={href}
                                                        className="text-inherit no-underline hover:underline"
                                                    >
                                                        {raw}
                                                    </a>
                                                ) : (
                                                    raw
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollAreaViewport>
                <ScrollAreaScrollbar orientation="horizontal">
                    <ScrollAreaThumb />
                </ScrollAreaScrollbar>
            </ScrollArea>
        </div>
    );
}

function cellClass(col: SpecColumn, primary: boolean): string {
    if (col.mono) return cellMono;
    if (primary) return cellBase;
    return cellMuted;
}

function rowKey(row: SpecRow, columns: SpecColumn[], index: number): string {
    const first = columns[0]?.key;
    const value = first ? row[first] : undefined;
    return value ? `${value}-${index}` : String(index);
}
