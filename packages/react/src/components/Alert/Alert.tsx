import { clsx } from "clsx";
import { iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";
import { Button } from "../Button";
import { AlertContext, useAlertVariant } from "./context";
import { alertVariantIcons, resolveAlertSlotClasses } from "./style";
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
    const iconName = name ?? alertVariantIcons[variant];
    return (
        <div
            data-refineui="alert-icon"
            className={clsx(resolveAlertSlotClasses("icon", variant), className)}
            {...props}
        >
            {children ?? (
                <WebIcon name={iconName} size={iconSizes.medium} color="currentColor" fallback="●" aria-hidden />
            )}
        </div>
    );
}

export function AlertContent({ className, ...props }: AlertContentProps) {
    const variant = useAlertVariant();
    return (
        <div
            data-refineui="alert-content"
            className={clsx(resolveAlertSlotClasses("content", variant), className)}
            {...props}
        />
    );
}

export function AlertRow({ className, ...props }: AlertRowProps) {
    const variant = useAlertVariant();
    return (
        <div
            data-refineui="alert-row"
            className={clsx(resolveAlertSlotClasses("row", variant), className)}
            {...props}
        />
    );
}

export function AlertBody({ className, ...props }: AlertBodyProps) {
    const variant = useAlertVariant();
    return (
        <div
            data-refineui="alert-body"
            className={clsx(resolveAlertSlotClasses("body", variant), className)}
            {...props}
        />
    );
}

export function AlertActions({ className, ...props }: AlertActionsProps) {
    const variant = useAlertVariant();
    return (
        <div
            data-refineui="alert-actions"
            className={clsx(resolveAlertSlotClasses("actions", variant), className)}
            {...props}
        />
    );
}

export function AlertAction({ className, type = "button", ...props }: AlertActionProps) {
    const variant = useAlertVariant();
    return (
        <Button
            type={type}
            className={clsx(resolveAlertSlotClasses("action", variant), className)}
            {...props}
            variant="primary"
            size="sm"
        />
    );
}

export function AlertClose({ className, type = "button", children, ...props }: AlertCloseProps) {
    const variant = useAlertVariant();
    return (
        <Button
            type={type}
            variant="ghost"
            size="sm"
            layout="icon"
            aria-label="Close"
            className={clsx(resolveAlertSlotClasses("close", variant), className)}
            {...props}
        >
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

export function Alert({ variant = "info", className, children, ...props }: AlertProps) {
    return (
        <AlertContext.Provider value={variant}>
            <div
                data-refineui="alert"
                data-variant={variant}
                role="alert"
                className={clsx(resolveAlertSlotClasses("root", variant), className)}
                {...props}
            >
                <AlertContent>{children}</AlertContent>
            </div>
        </AlertContext.Provider>
    );
}
