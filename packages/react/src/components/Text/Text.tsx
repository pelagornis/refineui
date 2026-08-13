import { clsx } from "clsx";
import type { ElementType, HTMLAttributes } from "react";
import type { SemanticTextName } from "@refineui/tokens";
import { semanticTextClass } from "../../typography";

export interface TextProps extends HTMLAttributes<HTMLElement> {
    /** Semantic text role — maps to Foundation typography via `SEMANTIC_TEXT`. */
    variant: SemanticTextName;
    /** Root element. Default `span`. */
    as?: ElementType;
}

/** Semantic typography primitive — Polaris `Text` / M3 typescale consumer. */
export function Text({ variant, as: Component = "span", className, ...props }: TextProps) {
    return (
        <Component
            data-refineui="text"
            data-variant={variant}
            className={clsx(semanticTextClass(variant), className)}
            {...props}
        />
    );
}
