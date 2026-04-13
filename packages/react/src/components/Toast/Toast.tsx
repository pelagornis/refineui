import { clsx } from "clsx";
import type { HTMLAttributes, ReactNode } from "react";
import { colors, iconSizes } from "@refineui/tokens";
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
    const { variant = "default", title, message, iconName, icon, action, className, ...rest } = props;
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
            <WebIcon name={resolvedIconName} size={iconSizes.medium} color={accent} />
        );

    const isPrimaryAction =
        !action || typeof action !== "object" || !("variant" in action) || action.variant === "primary";
    const actionEl =
        typeof action === "object" && action !== null && "label" in action ? (
            <Button variant={isPrimaryAction ? "primary" : "outline"} size="sm" onClick={action.onClick} className="shrink-0">
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
            className={clsx(
                "flex min-w-refineui-toast-min-width max-w-refineui-toast-max-width items-start gap-refineui-size-medium rounded-refineui-large border-refineui-thin p-refineui-size-large shadow-refineui-4light",
                "border-[var(--refineui-border,var(--refineui-color-neutral-300))] bg-[var(--refineui-bg,var(--refineui-color-neutral-white))]",
                className,
            )}
        >
            <div className="flex size-refineui-size-xxlarge shrink-0 items-center">{iconContent}</div>
            <div className="min-w-0 flex-1">
                {title && (
                    <div
                        className={clsx(
                            "refineui-typo-body-2 text-[var(--refineui-text,var(--refineui-color-primary-black))]",
                            message && "mb-refineui-size-xsmall",
                        )}
                    >
                        {title}
                    </div>
                )}
                {message && <div className="refineui-typo-body-4 text-refineui-neutral-500">{message}</div>}
            </div>
            {action != null && actionEl}
        </div>
    );
}
