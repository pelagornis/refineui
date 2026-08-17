import { clsx } from "clsx";
import { iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";
import { Button } from "../Button";
import { AlertContext, useAlertVariant } from "./context";
import { alertStyles, variantIconNames, variantTitleClass } from "./style";
import type {
    AlertActionProps,
    AlertActionsProps,
    AlertBodyProps,
    AlertCloseProps,
    AlertContentProps,
    AlertIconProps,
    AlertProps,
    AlertRowProps,
} from "./types";

export function AlertIcon({ className, name, children, ...props }: AlertIconProps) {
    const variant = useAlertVariant();
    const iconToneClass = variantTitleClass[variant];
    const iconName = name ?? variantIconNames[variant];
    return (
        <div
            data-refineui="alert-icon-slot"
            className={clsx(
                alertStyles.iconSlot,
                iconToneClass,
                className,
            )}
            {...props}
        >
            {children ?? (
                <WebIcon name={iconName} size={iconSizes.medium} color="currentColor" fallback="●" aria-hidden />
            )}
        </div>
    );
}

export function AlertContent({ className, ...props }: AlertContentProps) {
    return <div className={clsx(alertStyles.contentCol, className)} {...props} />;
}

export function AlertRow({ className, ...props }: AlertRowProps) {
    return <div className={clsx(alertStyles.row, className)} {...props} />;
}

export function AlertBody({ className, ...props }: AlertBodyProps) {
    return <div className={clsx(alertStyles.bodyCol, className)} {...props} />;
}

export function AlertActions({ className, ...props }: AlertActionsProps) {
    return <div className={clsx(alertStyles.actionRow, className)} {...props} />;
}

export function AlertAction({ className, type = "button", ...props }: AlertActionProps) {
    return <Button type={type} className={className} {...props} variant="primary" size="sm" />;
}

export function AlertClose({ className, type = "button", children, ...props }: AlertCloseProps) {
    return (
        <Button type={type} variant="ghost" size="sm" layout="icon" aria-label="Close" className={className} {...props}>
            {children ?? (
                <WebIcon
                    name="dismiss"
                    size={iconSizes.small}
                    color="currentColor"
                    iconStyle="regular"
                    fallback="×"
                    aria-hidden
                />
            )}
        </Button>
    );
}

export function Alert({ variant = "info", className, ...props }: AlertProps) {
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
                <AlertContent>{props.children}</AlertContent>
            </div>
        </AlertContext.Provider>
    );
}
