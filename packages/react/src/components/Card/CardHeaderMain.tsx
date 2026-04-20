import { clsx } from "clsx";
import type { HTMLAttributes } from "react";
import { cardStyles } from "./style";

export function CardHeaderMain({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div data-refineui="card-header-main" className={clsx(cardStyles.headerMain, className)} {...props} />;
}
