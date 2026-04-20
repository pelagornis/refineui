import { clsx } from "clsx";
import type { HTMLAttributes } from "react";
import { cardStyles } from "./style";

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div data-refineui="card-content" className={clsx(cardStyles.content, className)} {...props} />;
}
