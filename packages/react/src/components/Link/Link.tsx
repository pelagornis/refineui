import { clsx } from "clsx";
import type { AnchorHTMLAttributes } from "react";
import { iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    /**
     * When true, show the external-link icon. When omitted, shown automatically for `target="_blank"`.
     * Set false to hide the icon even for new windows.
     */
    showExternalIcon?: boolean;
    /** Disabled — sets `aria-disabled` and blocks pointer events (anchors have no native `disabled`). */
    disabled?: boolean;
}

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
                "refineui-typo-body-1",
                showOpen ? "inline-flex items-center gap-refineui-size-xsmall" : "inline",
                disabled && "cursor-not-allowed",
                className,
            )}
            {...props}
        >
            {children}
            {showOpen && <WebIcon name="open" size={iconSizes.large} color="currentColor" />}
        </a>
    );
}
