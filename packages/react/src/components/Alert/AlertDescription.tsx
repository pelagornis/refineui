import { clsx } from "clsx";
import { useAlertVariant } from "./context";
import { resolveAlertSlotClasses } from "./style";
import type { AlertDescriptionProps } from "./types";

export function AlertDescription({ className, ...props }: AlertDescriptionProps) {
    const variant = useAlertVariant();
    return (
        <div
            data-refineui="alert-description"
            className={clsx(resolveAlertSlotClasses("description", variant), className)}
            {...props}
        />
    );
}
