import { clsx } from "clsx";
import { layoutPaddingXClass, layoutStyles } from "./style";
import type { ContainerProps } from "./types";

/** Full-width column with Foundation horizontal padding. */
export function Container({
    as: Component = "div",
    padding = "sizeXXLarge",
    className,
    ...props
}: ContainerProps) {
    return (
        <Component
            data-refineui="container"
            className={clsx(layoutStyles.container, layoutPaddingXClass[padding], className)}
            {...props}
        />
    );
}
