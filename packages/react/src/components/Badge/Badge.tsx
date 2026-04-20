import { clsx } from "clsx";
import { badgeStyles, badgeVariantClass } from "./style";
import type { BadgeProps } from "./types";

export function Badge({ variant = "default", layout = "label", className, ...props }: BadgeProps) {
    return (
        <span
            data-refineui="badge"
            data-variant={variant}
            data-layout={layout}
            className={clsx(
                badgeStyles.base,
                layout === "number" ? badgeStyles.number : badgeStyles.label,
                badgeVariantClass[variant],
                className,
            )}
            {...props}
        />
    );
}
