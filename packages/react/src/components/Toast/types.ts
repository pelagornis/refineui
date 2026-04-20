import type { HTMLAttributes, ReactNode } from "react";

export type ToastVariant = "default" | "success" | "error" | "warning";

export type ToastPosition =
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";

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
    iconName?: string;
    icon?: ReactNode;
    action?: ToastAction;
    stackState?: "entering" | "idle" | "leaving";
}

export interface ToastOptions {
    description?: ReactNode;
    variant?: ToastVariant;
    iconName?: string;
    icon?: ReactNode;
    action?: ToastAction;
    duration?: number;
}

export interface ToasterProps {
    maxToasts?: number;
    position?: ToastPosition;
    className?: string;
}

export interface ToastRecord {
    id: string;
    title?: ReactNode;
    message?: ReactNode;
    variant: ToastVariant;
    iconName?: string;
    icon?: ReactNode;
    action?: ToastAction;
    duration: number;
    phase: "entering" | "idle" | "leaving";
}

