import { clsx } from "clsx";
import { forwardRef } from "react";
import { tableStyles } from "./style";
import type {
    TableBodyProps,
    TableCaptionProps,
    TableCellProps,
    TableFooterProps,
    TableHeadProps,
    TableHeaderProps,
    TableProps,
    TableRowProps,
} from "./types";

/** Dense semantic table — hover / selected via `refineui.css`. Overflow via composed `ScrollArea`. */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
    { className, ...props },
    ref,
) {
    return (
        <div data-refineui="table" className={tableStyles.wrapper}>
            <table ref={ref} className={clsx(tableStyles.table, className)} {...props} />
        </div>
    );
});

export function TableHeader({ className, ...props }: TableHeaderProps) {
    return <thead className={clsx(tableStyles.header, className)} {...props} />;
}

export function TableBody({ className, ...props }: TableBodyProps) {
    return <tbody className={clsx(tableStyles.body, className)} {...props} />;
}

export function TableFooter({ className, ...props }: TableFooterProps) {
    return <tfoot className={clsx(tableStyles.footer, className)} {...props} />;
}

export function TableRow({ className, ...props }: TableRowProps) {
    return <tr data-refineui="table-row" className={clsx(tableStyles.row, className)} {...props} />;
}

export function TableHead({ className, scope = "col", ...props }: TableHeadProps) {
    return <th className={clsx(tableStyles.head, className)} scope={scope} {...props} />;
}

export function TableCell({ className, ...props }: TableCellProps) {
    return <td className={clsx(tableStyles.cell, className)} {...props} />;
}

export function TableCaption({ className, ...props }: TableCaptionProps) {
    return <caption className={clsx(tableStyles.caption, className)} {...props} />;
}
