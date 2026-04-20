import { clsx } from "clsx";
import type { HTMLAttributes } from "react";
import { cardStyles } from "./style";

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div data-refineui="card-header" className={clsx(cardStyles.header, className)} {...props} />;
}
