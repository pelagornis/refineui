import { clsx } from "clsx";
import type { HTMLAttributes } from "react";
import { cardStyles } from "./style";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "elevated" | "outlined";
    interactive?: boolean;
    state?: "default" | "hover" | "pressed" | "disabled";
}

export function Card({
    variant = "elevated",
    interactive = false,
    state = "default",
    className,
    ...props
}: CardProps) {
    const isDisabled = state === "disabled";

    return (
        <div
            data-refineui="card"
            data-interactive={interactive ? "true" : undefined}
            data-state={state}
            aria-disabled={isDisabled || undefined}
            className={clsx(
                cardStyles.root,
                variant === "elevated" ? cardStyles.elevated : cardStyles.outlined,
                state === "default" && cardStyles.stateDefault,
                state === "hover" && cardStyles.stateHover,
                state === "pressed" && cardStyles.statePressed,
                state === "disabled" && cardStyles.stateDisabled,
                interactive && !isDisabled && cardStyles.interactive,
                className,
            )}
            {...props}
        />
    );
}
