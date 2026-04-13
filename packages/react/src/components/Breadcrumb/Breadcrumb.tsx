import { clsx } from "clsx";
import type {
    AnchorHTMLAttributes,
    ButtonHTMLAttributes,
    HTMLAttributes,
    LiHTMLAttributes,
    OlHTMLAttributes,
    ReactElement,
} from "react";
import { cloneElement, forwardRef, isValidElement } from "react";
import { iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";

/**
 * Web Kit (MCP `get_design_context`):
 * - 행 **Breadcrumb** COMPONENT_SET `283:688` — gap sizeMedium, py sizeSmall, flex items-start
 * - 셀 **Breadcrumb/BreadcrumbItem** — Link `279:2539`, Link Current `289:41`, Ellipsis `289:44` (래퍼: flex items-center justify-center overflow-clip)
 */
const textRow = "refineui-typo-caption-1 whitespace-nowrap";

/** Web Kit 루트 — `nav[data-refineui="breadcrumb"]` */
export type BreadcrumbProps = HTMLAttributes<HTMLElement>;

export function Breadcrumb({ className, ...props }: BreadcrumbProps) {
    return (
        <nav
            data-refineui="breadcrumb"
            aria-label="Breadcrumb"
            className={clsx("py-refineui-size-small", className)}
            {...props}
        />
    );
}

/** 경로 세그먼트 목록 — 시맨틱 `ol` */
export type BreadcrumbListProps = OlHTMLAttributes<HTMLOListElement>;

export function BreadcrumbList({ className, ...props }: BreadcrumbListProps) {
    return (
        <ol
            className={clsx(
                "m-0 flex flex-wrap list-none items-start gap-refineui-size-medium p-0",
                className,
            )}
            {...props}
        />
    );
}

export type BreadcrumbItemProps = LiHTMLAttributes<HTMLLIElement>;

export function BreadcrumbItem({ className, ...props }: BreadcrumbItemProps) {
    return (
        <li
            className={clsx("inline-flex items-center justify-center overflow-clip", className)}
            {...props}
        />
    );
}

export interface BreadcrumbLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    /** `true`면 자식 단일 엘리먼트(예: Next.js `Link`)에 스타일·`data-refineui`를 합성 */
    asChild?: boolean;
}

export function BreadcrumbLink({ asChild, className, children, ...props }: BreadcrumbLinkProps) {
    const classes = clsx(
        textRow,
        "inline-flex items-center justify-center px-refineui-size-medium py-refineui-size-xsmall text-refineui-alias-foreground-tertiary no-underline",
        className,
    );

    if (asChild) {
        if (!isValidElement(children)) {
            throw new Error("BreadcrumbLink: asChild일 때 자식은 단일 React 엘리먼트여야 합니다.");
        }
        const child = children as ReactElement<{ className?: string }>;
        return cloneElement(child, {
            ...(child.props as Record<string, unknown>),
            ...props,
            className: clsx(classes, child.props.className),
            "data-refineui": "breadcrumb-link",
        } as never);
    }

    return (
        <a data-refineui="breadcrumb-link" className={classes} {...props}>
            {children}
        </a>
    );
}

/** 현재 페이지 — Web Kit `Link Current` (primary foreground) */
export type BreadcrumbPageProps = HTMLAttributes<HTMLSpanElement>;

export function BreadcrumbPage({ className, ...props }: BreadcrumbPageProps) {
    return (
        <span
            role="link"
            aria-disabled="true"
            aria-current="page"
            className={clsx(
                textRow,
                "inline-flex items-center justify-center px-refineui-size-medium py-refineui-size-xsmall text-refineui-alias-foreground-primary",
                className,
            )}
            {...props}
        />
    );
}

/** 구분자 — 기본 `/` (Caption1 · tertiary) */
export type BreadcrumbSeparatorProps = LiHTMLAttributes<HTMLLIElement>;

export function BreadcrumbSeparator({ children, className, ...props }: BreadcrumbSeparatorProps) {
    return (
        <li
            role="presentation"
            aria-hidden
            className={clsx("inline-flex shrink-0 items-center py-refineui-size-xsmall", className)}
            {...props}
        >
            {children ?? (
                <span className={clsx(textRow, "inline-flex items-center text-refineui-alias-foreground-tertiary")}>/</span>
            )}
        </li>
    );
}

/** ⋯ 아이콘만 — 정적 표시·레이아웃용 (인터랙션은 `BreadcrumbEllipsisTrigger`) */
export type BreadcrumbEllipsisProps = HTMLAttributes<HTMLSpanElement>;

export function BreadcrumbEllipsis({ className, ...props }: BreadcrumbEllipsisProps) {
    return (
        <span
            data-refineui="breadcrumb-ellipsis"
            className={clsx(
                "inline-flex size-refineui-size-xlarge shrink-0 items-center justify-center text-refineui-alias-foreground-tertiary",
                className,
            )}
            {...props}
        >
            <WebIcon name="more-horizontal" size={iconSizes.small} color="currentColor" fallback="⋯" />
        </span>
    );
}

export type BreadcrumbEllipsisTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Web Kit BreadcrumbItem `Ellipsis` — `button[data-refineui="breadcrumb-ellipsis"]`, 20×20 슬롯.
 * `Dropdown` 등에 `trigger`로 넘길 때 `ref` 전달을 위해 `forwardRef`.
 */
export const BreadcrumbEllipsisTrigger = forwardRef<HTMLButtonElement, BreadcrumbEllipsisTriggerProps>(
    function BreadcrumbEllipsisTrigger({ className, type = "button", children, ...props }, ref) {
        return (
            <button
                ref={ref}
                type={type}
                data-refineui="breadcrumb-ellipsis"
                className={clsx(
                    "box-border inline-flex size-refineui-size-xlarge shrink-0 cursor-pointer items-center justify-center border-none bg-transparent p-0 text-refineui-alias-foreground-tertiary",
                    className,
                )}
                {...props}
            >
                {children ?? (
                    <WebIcon name="more-horizontal" size={iconSizes.small} color="currentColor" fallback="⋯" />
                )}
            </button>
        );
    },
);
