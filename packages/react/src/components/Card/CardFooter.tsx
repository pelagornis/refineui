import { clsx } from "clsx";
import type { HTMLAttributes } from "react";
import { cardStyles } from "./style";

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div data-refineui="card-footer" className={clsx(cardStyles.footer, className)} {...props} />;
}
