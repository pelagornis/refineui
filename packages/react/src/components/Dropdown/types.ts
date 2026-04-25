import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export type MenuAlign = "start" | "end" | "center";

export interface DropdownTriggerProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
    children: ReactNode;
}

export interface DropdownContentProps extends HTMLAttributes<HTMLDivElement> {
    align?: MenuAlign;
    side?: "auto" | "top" | "bottom";
    /** 트리거와 패널 사이 간격 — 기본 `sizeXSmall`(4px). */
    sideOffset?: number;
}

export interface DropdownItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    children: ReactNode;
    selected?: boolean;
}

export interface DropdownSubTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export interface DropdownSubContentProps extends HTMLAttributes<HTMLDivElement> {}

