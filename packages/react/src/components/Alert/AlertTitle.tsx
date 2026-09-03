import { clsx } from "clsx";
import { useAlertVariant } from "./context";
import { resolveAlertSlotClasses } from "./style";
import type { AlertTitleProps } from "./types";

export function AlertTitle({ className, ...props }: AlertTitleProps) {
    const variant = useAlertVariant();
    return (
        <h5
            data-refineui="alert-title"
            className={clsx(resolveAlertSlotClasses("title", variant), className)}
            {...props}
        />
    );
}
