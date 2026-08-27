import type { HTMLAttributes, ReactNode } from "react";

export type ToastVariant = "default" | "success" | "error" | "warning";

export type ToastPosition =
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";

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
    position?: ToastPosition;
    /** Allowed swipe-to-dismiss directions. Defaults from `position`. */
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
