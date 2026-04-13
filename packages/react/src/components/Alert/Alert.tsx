import { clsx } from "clsx";
import { Children, createContext, isValidElement, useContext } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";
import { Button } from "../Button";

export type AlertVariant = "default" | "info" | "success" | "warning" | "danger" | "custom";

const AlertContext = createContext<AlertVariant | null>(null);

export interface AlertAction {
    label: string;
    onClick?: () => void;
}

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    variant?: AlertVariant;
    icon?: string | ReactNode;
    title?: ReactNode;
    description?: ReactNode;
    onClose?: () => void;
    actions?: AlertAction[];
    children?: ReactNode;
}

export type AlertTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type AlertDescriptionProps = HTMLAttributes<HTMLDivElement>;

/**
 * Web Kit Alert — MCP `384:885` (Foundation Alias)
 * - 컨테이너: backgroundPrimary, borderDefault, px sizeLarge, py sizeMedium, roundedLarge
 * - 타이포: 제목·설명 Caption1 Medium
 * - 색: Default → foregroundPrimary / foregroundSecondary; state → foreground* / background* (MCP와 동일)
 * - 아이콘: MCP Default Shape는 제목과 동일하게 foregroundPrimary 바인딩 — 슬롯에 variantTitleClass + currentColor로 제목과 동일 톤 유지
 */
const variantTitleClass: Record<AlertVariant, string> = {
    default: "text-refineui-alias-foreground-primary",
    info: "text-refineui-alias-foreground-info",
    success: "text-refineui-alias-foreground-success",
    warning: "text-refineui-alias-foreground-warning",
    danger: "text-refineui-alias-foreground-error",
    custom: "text-refineui-alias-foreground-discovery",
};

const variantDescriptionClass: Record<AlertVariant, string> = {
    default: "text-refineui-alias-foreground-secondary",
    info: "text-refineui-alias-background-info",
    success: "text-refineui-alias-background-success",
    warning: "text-refineui-alias-background-warning",
    danger: "text-refineui-alias-background-error",
    custom: "text-refineui-alias-background-discovery",
};

const variantIconNames: Record<AlertVariant, string> = {
    default: "circle",
    info: "info",
    success: "checkmark",
    warning: "warning",
    danger: "error-circle",
    custom: "star",
};

/** 24×24 — Web Kit: 아이콘 색은 제목과 동일 Alias(`toneClass` + currentColor). */
function AlertIconSlot({ toneClass, children }: { toneClass: string; children: ReactNode }) {
    return (
        <div
            data-refineui="alert-icon-slot"
            className={clsx(
                "relative box-border flex size-refineui-size-xxlarge min-w-refineui-size-xxlarge shrink-0 items-center justify-center overflow-hidden rounded-refineui-circle",
                toneClass,
            )}
        >
            {children}
        </div>
    );
}

function AlertSystemGlyph({ name }: { name: string }) {
    return (
        <WebIcon name={name} size={iconSizes.medium} color="currentColor" fallback="●" aria-hidden />
    );
}

export function Alert({
    variant = "info",
    icon,
    title,
    description,
    onClose,
    actions,
    children,
    className,
    ...props
}: AlertProps) {
    const defaultIconName = variantIconNames[variant];
    const iconToneClass = variantTitleClass[variant];

    const leading =
        icon === undefined || icon === null ? (
            <AlertIconSlot toneClass={iconToneClass}>
                <AlertSystemGlyph name={defaultIconName} />
            </AlertIconSlot>
        ) : typeof icon === "string" ? (
            <AlertIconSlot toneClass={iconToneClass}>
                <AlertSystemGlyph name={icon.length > 0 ? icon : defaultIconName} />
            </AlertIconSlot>
        ) : (
            <AlertIconSlot toneClass={iconToneClass}>{icon}</AlertIconSlot>
        );

    const composedChildren = Children.toArray(children);
    let composedLeading: ReactNode | null = null;
    const composedBody: ReactNode[] = [];
    if (title == null && description == null && composedChildren.length > 0) {
        for (const child of composedChildren) {
            if (
                composedLeading == null &&
                (!isValidElement(child) ||
                    (child.type !== AlertTitle && child.type !== AlertDescription))
            ) {
                composedLeading = child;
                continue;
            }
            composedBody.push(child);
        }
    }

    const body =
        title != null || description != null ? (
            <div className="flex min-w-0 flex-1 flex-col gap-refineui-size-xsmall">
                {title && <AlertTitle>{title}</AlertTitle>}
                {description && <AlertDescription>{description}</AlertDescription>}
            </div>
        ) : (
            <div className="flex min-w-0 flex-1 flex-col gap-refineui-size-xsmall">
                {composedBody.length > 0 ? composedBody : composedChildren}
            </div>
        );

    const closeBtn =
        onClose != null ? (
            <Button type="button" variant="ghost" size="sm" layout="icon" aria-label="닫기" onClick={onClose}>
                <WebIcon
                    name="dismiss"
                    size={iconSizes.small}
                    color="currentColor"
                    iconStyle="regular"
                    fallback="×"
                    aria-hidden
                />
            </Button>
        ) : null;

    const actionRow =
        actions && actions.length > 0 ? (
            <div className="flex w-full flex-row flex-wrap items-center justify-end gap-refineui-size-medium">
                {actions.slice(0, 2).map((actionItem, i) => (
                    <Button key={i} variant="primary" size="sm" onClick={actionItem.onClick}>
                        {actionItem.label}
                    </Button>
                ))}
            </div>
        ) : null;

    return (
        <AlertContext.Provider value={variant}>
            <div
                data-refineui="alert"
                role="alert"
                className={clsx(
                    "box-border flex items-start rounded-refineui-large border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-primary px-refineui-size-large py-refineui-size-medium",
                    className,
                )}
                {...props}
            >
                <div className="flex min-w-0 flex-1 flex-col gap-refineui-size-medium">
                    <div className="flex w-full flex-row items-start gap-refineui-size-medium">
                        {title != null || description != null ? leading : composedLeading ?? leading}
                        {body}
                        {closeBtn}
                    </div>
                    {actionRow}
                </div>
            </div>
        </AlertContext.Provider>
    );
}

function useAlertVariant(): AlertVariant {
    return useContext(AlertContext) ?? "info";
}

export function AlertTitle({ className, ...props }: AlertTitleProps) {
    const v = useAlertVariant();
    return (
        <h5
            className={clsx("m-0 w-full min-w-0 refineui-typo-caption-1 font-medium", variantTitleClass[v], className)}
            {...props}
        />
    );
}

export function AlertDescription({ className, ...props }: AlertDescriptionProps) {
    const v = useAlertVariant();
    return (
        <div
            className={clsx("w-full min-w-0 refineui-typo-caption-1 font-medium", variantDescriptionClass[v], className)}
            {...props}
        />
    );
}
