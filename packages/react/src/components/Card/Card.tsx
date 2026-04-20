/**
 * Web Kit Card — design-specs-web-kit.md §7 (`elevated` | `outlined`).
 */
import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "elevated" | "outlined";
    interactive?: boolean;
}

export function Card({ variant = "elevated", interactive = false, className, ...props }: CardProps) {
    return (
        <div
            data-refineui="card"
            data-interactive={interactive ? "true" : undefined}
            className={clsx(
                "box-border flex flex-col gap-refineui-size-large rounded-refineui-xxlarge border-refineui-thin border-refineui-alias-border-default bg-refineui-alias-background-primary",
                variant === "elevated" && "shadow-refineui-4light",
                className,
            )}
            {...props}
        />
    );
}

export function CardHeaderMain({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            data-refineui="card-header-main"
            className={clsx("flex min-w-0 flex-1 flex-col gap-refineui-size-x-small", className)}
            {...props}
        />
    );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            data-refineui="card-header"
            className={clsx(
                "flex flex-row flex-wrap items-start justify-between gap-refineui-size-medium px-refineui-size-large pt-refineui-size-large",
                className,
            )}
            {...props}
        />
    );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            data-refineui="card-title"
            className={clsx("refineui-typo-body-1 text-refineui-alias-foreground-primary", className)}
            {...props}
        />
    );
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            data-refineui="card-description"
            className={clsx("refineui-typo-caption-1 text-refineui-alias-foreground-secondary", className)}
            {...props}
        />
    );
}

export function CardAction({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            data-refineui="card-action"
            className={clsx("flex shrink-0 items-center justify-end", className)}
            {...props}
        />
    );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            data-refineui="card-content"
            className={clsx("px-refineui-size-large pb-refineui-size-medium", className)}
            {...props}
        />
    );
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            data-refineui="card-footer"
            className={clsx(
                "flex flex-col gap-refineui-size-small px-refineui-size-large pb-refineui-size-large",
                className,
            )}
            {...props}
        />
    );
}
