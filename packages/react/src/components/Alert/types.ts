import type { HTMLAttributes, ReactNode } from "react";

export type AlertVariant = "default" | "info" | "success" | "warning" | "danger" | "custom";

export interface AlertAction {
    label: string;
    onClick?: () => void;
}

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    variant?: AlertVariant;
    icon?: string | ReactNode;
    title?: ReactNode;
    description?: ReactNode;
    onClose?: () => void;
    actions?: AlertAction[];
    children?: ReactNode;
}

export type AlertTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type AlertDescriptionProps = HTMLAttributes<HTMLDivElement>;

