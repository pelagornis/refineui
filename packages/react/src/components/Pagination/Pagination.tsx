import { clsx } from "clsx";
import { iconSizes } from "@refineui/tokens";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { WebIcon } from "../../WebIcon";
import { Button } from "../Button";
import { paginationStyles } from "./style";
import type {
    PaginationContentProps,
    PaginationEllipsisProps,
    PaginationItemProps,
    PaginationLinkProps,
    PaginationNextProps,
    PaginationPreviousProps,
    PaginationProps,
    PaginationRootProps,
} from "./types";

export function PaginationRoot({ className, ...props }: PaginationRootProps) {
    return <nav aria-label="Pagination" className={clsx(paginationStyles.root, className)} {...props} />;
}

export function PaginationContent({ className, ...props }: PaginationContentProps) {
    return <ul className={clsx(paginationStyles.listWrap, className)} {...props} />;
}

export function PaginationItem({ className, ...props }: PaginationItemProps) {
    return <li className={className} {...props} />;
}

export function PaginationLink({ className, isActive, ...props }: PaginationLinkProps) {
    return (
        <a
            data-refineui="pagination"
            data-page="true"
            data-selected={isActive ? "true" : "false"}
            aria-current={isActive ? "page" : undefined}
            className={clsx(paginationStyles.itemBase, paginationStyles.page, className)}
            {...props}
        />
    );
}

function PaginationNavButton({
    direction,
    className,
    ...props
}: (PaginationPreviousProps | PaginationNextProps) & { direction: "prev" | "next" }) {
    const isPrev = direction === "prev";
    const iconColor = props.disabled
        ? resolveColorTokenValue(componentColorTokens.pagination.navIcon.disabled)
        : resolveColorTokenValue(componentColorTokens.pagination.navIcon.default);
    return (
        <Button
            variant="outline"
            size="md"
            layout="icon"
            data-refineui="pagination"
            aria-label={isPrev ? "Previous page" : "Next page"}
            className={clsx(
                paginationStyles.itemBase,
                paginationStyles.navBtn,
                props.disabled && paginationStyles.navBtnDisabled,
                className,
            )}
            {...props}
        >
            <WebIcon
                name={isPrev ? "chevron-left" : "chevron-right"}
                size={iconSizes.medium}
                color={iconColor}
                fallback={isPrev ? "‹" : "›"}
            />
        </Button>
    );
}

export function PaginationPrevious(props: PaginationPreviousProps) {
    return <PaginationNavButton direction="prev" {...props} />;
}

export function PaginationNext(props: PaginationNextProps) {
    return <PaginationNavButton direction="next" {...props} />;
}

export function PaginationEllipsis({ className, ...props }: PaginationEllipsisProps) {
    return (
        <span
            aria-hidden
            data-refineui="pagination"
            data-page="true"
            className={clsx(paginationStyles.itemBase, paginationStyles.ellipsis, className)}
            {...props}
        >
            <WebIcon
                name="more-horizontal"
                size={iconSizes.medium}
                color={resolveColorTokenValue(componentColorTokens.pagination.navIcon.default)}
                fallback="…"
            />
        </span>
    );
}

export function Pagination(props: PaginationProps) {
    return <PaginationRoot {...props} />;
}
