import type { HTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { Fragment } from "react";
import { colors, spacings, typographys, iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";

export interface BreadcrumbItem {
    id: string;
    /** `ellipsis`일 때 스크린리더용 (예: `"중간 경로 생략"`) */
    label?: ReactNode;
    href?: string;
    /** Figma `Ellipsis` — 중간 경로 축약 (⋯ / more-horizontal) */
    ellipsis?: boolean;
    /** `ellipsis: true`일 때: 클릭 시(pressed/hover/focus는 `data-refineui="breadcrumb-ellipsis"` + CSS) */
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
    items: BreadcrumbItem[];
    /** Figma Web Kit 기본: `/` (Caption1 · tertiary). MCP `283:688`와 동일 */
    separator?: ReactNode;
}

const textBase = {
    ...typographys.caption1,
    whiteSpace: "nowrap" as const,
};

const sepOuter = {
    display: "inline-flex" as const,
    alignItems: "center" as const,
    flexShrink: 0 as const,
};

export function Breadcrumb({ items, separator, style, ...props }: BreadcrumbProps) {
    const resolvedSeparator =
        separator !== undefined ? (
            separator
        ) : (
            <span style={{ ...textBase, color: colors.neutral500 }} aria-hidden>
                /
            </span>
        );

    return (
        <nav
            data-refineui="breadcrumb"
            aria-label="Breadcrumb"
            style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: spacings.sizeMedium,
                padding: `${spacings.sizeSmall} 0`,
                ...style,
            }}
            {...props}
        >
            {items.map((item, i) => {
                const isLast = i === items.length - 1;
                const currentColor = isLast ? colors.primaryBlack : colors.neutral500;

                const ellipsisAriaLabel =
                    typeof item.label === "string" ? item.label : "생략된 경로";
                const ellipsisBox = {
                    display: "inline-flex" as const,
                    width: spacings.sizeXLarge,
                    height: spacings.sizeXLarge,
                    alignItems: "center" as const,
                    justifyContent: "center" as const,
                    flexShrink: 0 as const,
                };

                const content =
                    item.ellipsis === true ? (
                        item.onClick != null ? (
                            <button
                                type="button"
                                data-refineui="breadcrumb-ellipsis"
                                aria-label={ellipsisAriaLabel}
                                onClick={item.onClick}
                                style={{ ...ellipsisBox, cursor: "pointer" }}
                            >
                                <WebIcon
                                    name="more-horizontal"
                                    size={iconSizes.sm}
                                    color={colors.neutral500}
                                    fallback="⋯"
                                />
                            </button>
                        ) : (
                            <span
                                data-refineui="breadcrumb-ellipsis"
                                role="img"
                                aria-label={ellipsisAriaLabel}
                                style={ellipsisBox}
                            >
                                <WebIcon
                                    name="more-horizontal"
                                    size={iconSizes.sm}
                                    color={colors.neutral500}
                                    fallback="⋯"
                                />
                            </span>
                        )
                    ) : item.href ? (
                        <a
                            href={item.href}
                            data-refineui="breadcrumb-link"
                            {...(isLast ? { "data-current": "" as const } : {})}
                            style={{
                                ...textBase,
                                color: isLast ? colors.primaryBlack : colors.neutral500,
                                textDecoration: "none",
                            }}
                        >
                            {item.label}
                        </a>
                    ) : (
                        <span style={{ ...textBase, color: currentColor }}>{item.label}</span>
                    );

                return (
                    <Fragment key={item.id}>
                        {i > 0 ? (
                            <span style={sepOuter} aria-hidden>
                                {resolvedSeparator}
                            </span>
                        ) : null}
                        <span style={{ display: "inline-flex", alignItems: "center" }}>{content}</span>
                    </Fragment>
                );
            })}
        </nav>
    );
}
