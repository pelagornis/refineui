import type { HTMLAttributes, ReactNode } from "react";
import { colors, spacings, borderRadii, typographys, shadows, toBoxShadow, strokeWidths, sizes, iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";
import { Button } from "../Button";

export type ToastVariant = "default" | "success" | "error" | "warning";

export type ToastAction =
    | ReactNode
    | {
          label: string;
          onClick?: () => void;
          variant?: "primary" | "secondary";
      };

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    variant?: ToastVariant;
    title?: ReactNode;
    message?: ReactNode;
    /** RefineUI System Icons 이름 — 없으면 variant별 기본 아이콘 */
    iconName?: string;
    /** 왼쪽 아이콘 (ReactNode) — iconName보다 우선 */
    icon?: ReactNode;
    /** 오른쪽 액션 버튼 */
    action?: ToastAction;
}

const variantAccents: Record<ToastVariant, string> = {
    default: colors.primaryBlack,
    success: colors.green600,
    error: colors.red600,
    warning: colors.yellow600,
};

const variantIconNames: Record<ToastVariant, string> = {
    default: "info",
    success: "checkmark",
    error: "error-circle",
    warning: "warning",
};

export function Toast(props: ToastProps) {
    const { variant = "default", title, message, iconName, icon, action, style, ...rest } = props;
    const domProps = { ...rest };
    delete (domProps as Record<string, unknown>).iconName;
    delete (domProps as Record<string, unknown>).icon;
    delete (domProps as Record<string, unknown>).action;

    const liveRole = variant === "error" ? "alert" : "status";
    const ariaLive = variant === "error" ? undefined : variant === "warning" ? ("assertive" as const) : ("polite" as const);

    const accent = variantAccents[variant];
    const resolvedIconName = iconName ?? variantIconNames[variant];

    const iconContent =
        icon != null ? (
            icon
        ) : (
            <WebIcon name={resolvedIconName} size={iconSizes.md} color={accent} />
        );

    const isPrimaryAction =
        !action || typeof action !== "object" || !("variant" in action) || action.variant === "primary";
    const actionEl =
        typeof action === "object" && action !== null && "label" in action ? (
            <Button
                variant={isPrimaryAction ? "primary" : "outline"}
                size="sm"
                onClick={action.onClick}
                style={{ flexShrink: 0 }}
            >
                {action.label}
            </Button>
        ) : (
            action
        );

    return (
        <div
            data-refineui="toast"
            role={liveRole}
            aria-live={ariaLive}
            {...domProps}
            style={{
                display: "flex",
                alignItems: "flex-start",
                gap: spacings.sizeMedium,
                padding: spacings.sizeLarge,
                borderRadius: borderRadii.roundedLarge,
                boxShadow: toBoxShadow(shadows.shadow4Light),
                backgroundColor: `var(--refineui-bg, ${colors.neutralWhite})`,
                border: `${strokeWidths.strokeWidthThin} solid var(--refineui-border, ${colors.neutral300})`,
                minWidth: sizes.toastMinWidth,
                maxWidth: sizes.toastMaxWidth,
                ...style,
            }}
        >
            <div
                style={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    width: spacings.sizeXXLarge,
                    height: spacings.sizeXXLarge,
                }}
            >
                {iconContent}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                {title && (
                    <div
                        style={{
                            ...typographys.body2,
                            color: `var(--refineui-text, ${colors.primaryBlack})`,
                            marginBottom: message ? spacings.sizeXSmall : 0,
                        }}
                    >
                        {title}
                    </div>
                )}
                {message && (
                    <div
                        style={{
                            ...typographys.body4,
                            color: colors.neutral500,
                        }}
                    >
                        {message}
                    </div>
                )}
            </div>
            {action != null && actionEl}
        </div>
    );
}
