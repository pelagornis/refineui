import type { CSSProperties, HTMLAttributes } from "react";
import { colors, spacings, borderRadii, typographys, strokeWidths, sizes, iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";

const visuallyHidden: CSSProperties = {
    position: "absolute",
    width: sizes.accessibleClip,
    height: sizes.accessibleClip,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
};

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange, style, ...props }: PaginationProps) {
    const prevDisabled = page <= 1;
    const nextDisabled = page >= totalPages;

    const btnStyle: CSSProperties = {
        padding: `${spacings.sizeXSmall} ${spacings.sizeSmall}`,
        minWidth: sizes.paginationButtonMinWidth,
        border: `${strokeWidths.strokeWidthThin} solid ${colors.neutral300}`,
        borderRadius: borderRadii.roundedSmall,
        background: colors.neutralWhite,
        cursor: "pointer",
        ...typographys.body3,
        color: colors.primaryBlack,
    };

    return (
        <nav aria-label="Pagination" style={{ display: "flex", alignItems: "center", gap: spacings.sizeXSmall, ...style }} {...props}>
            <button
                type="button"
                data-refineui="pagination"
                aria-label="Previous page"
                disabled={prevDisabled}
                onClick={() => onPageChange(page - 1)}
                style={{
                    ...btnStyle,
                    opacity: prevDisabled ? 0.5 : 1,
                    cursor: prevDisabled ? "not-allowed" : "pointer",
                }}
            >
                <WebIcon name="chevron-left" size={iconSizes.md} color={colors.primaryBlack} fallback="‹" />
            </button>
            <span style={{ ...typographys.body3, color: colors.primaryBlack, position: "relative" }}>
                <span style={visuallyHidden}>
                    Page {page} of {totalPages}
                </span>
                <span aria-hidden="true">
                    {page} / {totalPages}
                </span>
            </span>
            <button
                type="button"
                data-refineui="pagination"
                aria-label="Next page"
                disabled={nextDisabled}
                onClick={() => onPageChange(page + 1)}
                style={{
                    ...btnStyle,
                    opacity: nextDisabled ? 0.5 : 1,
                    cursor: nextDisabled ? "not-allowed" : "pointer",
                }}
            >
                <WebIcon name="chevron-right" size={iconSizes.md} color={colors.primaryBlack} fallback="›" />
            </button>
        </nav>
    );
}
