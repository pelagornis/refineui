import { clsx } from "clsx";
import { useAlertVariant } from "./context";
import { alertStyles, variantDescriptionClass } from "./style";
import type { AlertDescriptionProps } from "./types";

export function AlertDescription({ className, ...props }: AlertDescriptionProps) {
    const v = useAlertVariant();
    return <div className={clsx(alertStyles.descriptionBase, variantDescriptionClass[v], className)} {...props} />;
}

