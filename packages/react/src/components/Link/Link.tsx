import { clsx } from "clsx";
import { iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";
import { linkStyles } from "./style";
import type { LinkProps } from "./types";

/** Web Kit `Link` `226:158` — colors and underline via `refineui.css` `[data-refineui="link"]`. */
export function Link({
    showExternalIcon,
    target,
    disabled = false,
    children,
    className,
    ...props
}: LinkProps) {
    const autoExternal = target === "_blank";
    const showOpen =
        showExternalIcon === true || (showExternalIcon !== false && autoExternal);

    return (
        <a
            data-refineui="link"
            target={target}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : undefined}
            className={clsx(
                linkStyles.base,
                showOpen ? linkStyles.withIcon : linkStyles.inline,
                disabled && linkStyles.disabled,
                className,
            )}
            {...props}
        >
            {children}
            {showOpen && <WebIcon name="open" size={iconSizes.large} color="currentColor" />}
        </a>
    );
}
