import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export type AlertVariant = "default" | "info" | "success" | "warning" | "danger" | "custom";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
    variant?: AlertVariant;
}

export interface AlertIconProps extends HTMLAttributes<HTMLDivElement> {
    name?: string;
    children?: ReactNode;
}

export type AlertContentProps = HTMLAttributes<HTMLDivElement>;
export type AlertRowProps = HTMLAttributes<HTMLDivElement>;
export type AlertBodyProps = HTMLAttributes<HTMLDivElement>;
export type AlertActionsProps = HTMLAttributes<HTMLDivElement>;
export type AlertActionProps = ButtonHTMLAttributes<HTMLButtonElement>;
export type AlertCloseProps = ButtonHTMLAttributes<HTMLButtonElement>;
export type AlertTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type AlertDescriptionProps = HTMLAttributes<HTMLDivElement>;

