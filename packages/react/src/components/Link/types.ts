import type { AnchorHTMLAttributes } from "react";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    /**
     * When true, show the external-link icon. When omitted, shown automatically for `target="_blank"`.
     * Set false to hide the icon even for new windows.
     */
    showExternalIcon?: boolean;
    /** Disabled — sets `aria-disabled` and blocks pointer events (anchors have no native `disabled`). */
    disabled?: boolean;
}

