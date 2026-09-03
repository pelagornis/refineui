import type { HTMLAttributes, ReactNode } from "react";

export type ToastVariant = "default" | "success" | "error" | "warning";

export type ToastSwipeDirection = "top" | "right" | "bottom" | "left";

export type ToastAction =
    | ReactNode
    | {
          label: string;
          onClick?: () => void;
          variant?: "primary" | "secondary";
      };

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
    variant?: ToastVariant;
    message?: ReactNode;
    iconName?: string;
    icon?: ReactNode;
    action?: ToastAction;
    stackState?: "entering" | "idle" | "leaving";
}

export interface ToastOptions {
    variant?: ToastVariant;
    iconName?: string;
    icon?: ReactNode;
    action?: ToastAction;
    duration?: number;
}

export interface ToasterProps {
    /** Max visible toasts. Default `1` (new toast replaces the previous). */
    maxToasts?: number;
    /** Allowed swipe-to-dismiss directions. Default `["top"]` (fixed top-center placement). */
    swipeDirections?: ToastSwipeDirection[];
    className?: string;
}

export interface ToastRecord {
    id: string;
    message?: ReactNode;
    variant: ToastVariant;
    iconName?: string;
    icon?: ReactNode;
    action?: ToastAction;
    duration: number;
    phase: "entering" | "idle" | "leaving";
}
