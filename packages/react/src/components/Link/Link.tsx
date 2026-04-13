import { clsx } from "clsx";
import type { AnchorHTMLAttributes } from "react";
import { iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    /**
     * `true`면 `open` 아이콘 표시. 미지정 시 `target="_blank"`이면 자동 표시.
     * `false`로 명시하면 새 창이어도 아이콘 숨김.
     */
    showExternalIcon?: boolean;
    /** 비활성 — `aria-disabled`·포인터 차단 (`<a>`는 네이티브 `disabled` 없음) */
    disabled?: boolean;
}

/** Web Kit COMPONENT_SET `Link` `226:158` — 색·밑줄은 `refineui.css` `[data-refineui="link"]`. */
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
