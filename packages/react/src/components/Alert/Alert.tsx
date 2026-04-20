import { clsx } from "clsx";
import { Children, isValidElement } from "react";
import type { ReactNode } from "react";
import { iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";
import { Button } from "../Button";
import { AlertContext } from "./context";
import { AlertDescription } from "./AlertDescription";
import { AlertTitle } from "./AlertTitle";
import { alertStyles, variantIconNames, variantTitleClass } from "./style";
import type { AlertProps } from "./types";

function AlertIconSlot({ toneClass, children }: { toneClass: string; children: ReactNode }) {
    return (
        <div
            data-refineui="alert-icon-slot"
            className={clsx(
                alertStyles.iconSlot,
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
            <div className={alertStyles.bodyCol}>
                {title && <AlertTitle>{title}</AlertTitle>}
                {description && <AlertDescription>{description}</AlertDescription>}
            </div>
        ) : (
            <div className={alertStyles.bodyCol}>
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
            <div className={alertStyles.actionRow}>
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
                    alertStyles.root,
                    className,
                )}
                {...props}
            >
                <div className={alertStyles.contentCol}>
                    <div className={alertStyles.row}>
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
