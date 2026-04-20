import { clsx } from "clsx";
import { iconSizes } from "@refineui/tokens";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { WebIcon } from "../../WebIcon";
import { paginationStyles } from "./style";
import type { PaginationProps } from "./types";

export function getPaginationItems(current: number, total: number): (number | "ellipsis")[] {
    if (total <= 0) return [];
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }
    const set = new Set<number>();
    set.add(1);
    set.add(total);
    set.add(current);
    if (current > 1) set.add(current - 1);
    if (current < total) set.add(current + 1);
    const sorted = [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
    const items: (number | "ellipsis")[] = [];
    for (let i = 0; i < sorted.length; i++) {
        const p = sorted[i]!;
        if (i > 0 && p - sorted[i - 1]! > 1) {
            items.push("ellipsis");
        }
        items.push(p);
    }
    return items;
}

export function Pagination({ page, totalPages, onPageChange, className, ...props }: PaginationProps) {
    const prevDisabled = page <= 1;
    const nextDisabled = page >= totalPages;
    const items = getPaginationItems(page, totalPages);

    return (
        <nav
            aria-label="Pagination"
            className={clsx(paginationStyles.root, className)}
            {...props}
        >
            <button
                type="button"
                data-refineui="pagination"
                aria-label="Previous page"
                disabled={prevDisabled}
                className={clsx(paginationStyles.navBtn, prevDisabled && paginationStyles.navBtnDisabled)}
                onClick={() => onPageChange(page - 1)}
            >
                <WebIcon
                    name="chevron-left"
                    size={iconSizes.xlarge}
                    color={
                        prevDisabled
                            ? resolveColorTokenValue(componentColorTokens.pagination.navIcon.disabled)
                            : resolveColorTokenValue(componentColorTokens.pagination.navIcon.default)
                    }
                    fallback="‹"
                />
            </button>

            <div className={paginationStyles.listWrap}>
                <span className="sr-only">
                    Page {page} of {totalPages}
                </span>
                {items.map((item, idx) =>
                    item === "ellipsis" ? (
                        <span
                            key={`e-${idx}`}
                            aria-hidden
                            className={paginationStyles.ellipsis}
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={item}
                            type="button"
                            data-refineui="pagination-page"
                            data-selected={item === page ? "true" : "false"}
                            aria-label={`Page ${item}`}
                            aria-current={item === page ? "page" : undefined}
                            className={paginationStyles.page}
                            onClick={() => onPageChange(item)}
                        >
                            {item}
                        </button>
                    ),
                )}
            </div>

            <button
                type="button"
                data-refineui="pagination"
                aria-label="Next page"
                disabled={nextDisabled}
                className={clsx(paginationStyles.navBtn, nextDisabled && paginationStyles.navBtnDisabled)}
                onClick={() => onPageChange(page + 1)}
            >
                <WebIcon
                    name="chevron-right"
                    size={iconSizes.xlarge}
                    color={
                        nextDisabled
                            ? resolveColorTokenValue(componentColorTokens.pagination.navIcon.disabled)
                            : resolveColorTokenValue(componentColorTokens.pagination.navIcon.default)
                    }
                    fallback="›"
                />
            </button>
        </nav>
    );
}
