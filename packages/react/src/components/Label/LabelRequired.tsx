import { clsx } from "clsx";
import { labelStyles } from "./style";
import type { LabelRequiredProps } from "./types";

/** Required asterisk — Web Kit `red700` / alias `foregroundError`. Decorative (`aria-hidden`). */
export function LabelRequired({ className, children = "*", ...props }: LabelRequiredProps) {
    return (
        <span
            data-refineui="label-required"
            className={clsx(labelStyles.required, className)}
            aria-hidden
            {...props}
        >
            {children}
        </span>
    );
}
