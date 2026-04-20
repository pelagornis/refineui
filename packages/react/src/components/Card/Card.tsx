import { clsx } from "clsx";
import type { HTMLAttributes } from "react";
import { cardStyles } from "./style";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "elevated" | "outlined";
    interactive?: boolean;
}

export function Card({ variant = "elevated", interactive = false, className, ...props }: CardProps) {
    return (
        <div
            data-refineui="card"
            data-interactive={interactive ? "true" : undefined}
            className={clsx(cardStyles.root, variant === "elevated" && cardStyles.elevated, className)}
            {...props}
        />
    );
}
