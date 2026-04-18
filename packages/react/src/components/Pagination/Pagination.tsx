import { clsx } from "clsx";
import type { HTMLAttributes } from "react";
import { iconSizes } from "@refineui/tokens";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { WebIcon } from "../../WebIcon";

/** Web Kit `Pagination / Item` `570:2332` — 생략(ellipsis) 포함 페이지 나열 */
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

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const navBtnClass =
    "box-border inline-flex min-h-refineui-pagination-button-min-width min-w-refineui-pagination-button-min-width cursor-pointer items-center justify-center rounded-refineui-large border-refineui-thin border-refineui-neutral-300 bg-refineui-neutral-white p-refineui-size-small";

/** Web Kit `Pagination` `558:1989` · `Pagination / Item` `570:2332` — 이전/다음 + 페이지 번호(ellipsis). */
export function Pagination({ page, totalPages, onPageChange, className, ...props }: PaginationProps) {
    const prevDisabled = page <= 1;
    const nextDisabled = page >= totalPages;
    const items = getPaginationItems(page, totalPages);

    return (
        <nav
            aria-label="Pagination"
            className={clsx("flex flex-wrap items-center gap-refineui-size-medium", className)}
            {...props}
        >
            <button
                type="button"
                data-refineui="pagination"
                aria-label="Previous page"
                disabled={prevDisabled}
                className={clsx(navBtnClass, prevDisabled && "cursor-not-allowed")}
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

            <div className="relative flex items-center gap-refineui-size-small">
                <span className="sr-only">
                    Page {page} of {totalPages}
                </span>
                {items.map((item, idx) =>
                    item === "ellipsis" ? (
                        <span
                            key={`e-${idx}`}
                            aria-hidden
                            className="refineui-typo-body-1 inline-flex min-h-refineui-pagination-button-min-width min-w-refineui-pagination-button-min-width items-center justify-center text-refineui-primary-black"
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
                            className="refineui-typo-body-1"
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
                className={clsx(navBtnClass, nextDisabled && "cursor-not-allowed")}
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
