import { clsx } from "clsx";
import { useAlertVariant } from "./context";
import { alertStyles, variantTitleClass } from "./style";
import type { AlertTitleProps } from "./types";

export function AlertTitle({ className, ...props }: AlertTitleProps) {
    const v = useAlertVariant();
    return <h5 className={clsx(alertStyles.titleBase, variantTitleClass[v], className)} {...props} />;
}

