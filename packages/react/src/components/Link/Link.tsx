import type { AnchorHTMLAttributes } from "react";
import { colors, spacings, typographys, iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    variant?: "default" | "subtle";
    /**
     * `true`면 `open` 아이콘 표시. 미지정 시 `target="_blank"`이면 자동 표시.
     * `false`로 명시하면 새 창이어도 아이콘 숨김.
     */
    showExternalIcon?: boolean;
}

export function Link({ variant = "default", showExternalIcon, target, children, style, ...props }: LinkProps) {
    const autoExternal = target === "_blank";
    const showOpen =
        showExternalIcon === true || (showExternalIcon !== false && autoExternal);

    const textColor = variant === "default" ? colors.blue600 : colors.neutral600;

    return (
        <a
            data-refineui="link"
            target={target}
            style={{
                ...typographys.body3,
                color: textColor,
                textDecoration: "underline",
                cursor: "pointer",
                display: showOpen ? "inline-flex" : "inline",
                alignItems: showOpen ? "center" : undefined,
                gap: showOpen ? spacings.sizeXXSmall : undefined,
                ...style,
            }}
            {...props}
        >
            {children}
            {showOpen && <WebIcon name="open" size={iconSizes.md} color="currentColor" />}
        </a>
    );
}
