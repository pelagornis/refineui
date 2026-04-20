import { clsx } from "clsx";
import type { HTMLAttributes } from "react";
import { cardStyles } from "./style";

export function CardAction({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div data-refineui="card-action" className={clsx(cardStyles.action, className)} {...props} />;
}
