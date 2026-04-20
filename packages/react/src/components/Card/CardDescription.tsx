import { clsx } from "clsx";
import type { HTMLAttributes } from "react";
import { cardStyles } from "./style";

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
    return <p data-refineui="card-description" className={clsx(cardStyles.description, className)} {...props} />;
}
