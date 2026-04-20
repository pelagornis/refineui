import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export type MenuAlign = "start" | "end" | "center";

/** Row selection UI + ARIA. `none` = 일반 행(`menuitem`). */
export type DropdownSelectionVariant = "none" | "checkbox" | "radio";

export interface DropdownListItem {
    id: string;
    label: ReactNode;
    startIcon?: ReactNode;
    shortcut?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    /** 고정 선택 표시(배경 `surfaceSelected`). `selection`이 none일 때만 시각만 쓰면 됩니다. */
    selected?: boolean;
    /** 체크·라디오 행 — 좌측 컨트롤 + `menuitemcheckbox` / `menuitemradio`. */
    selection?: DropdownSelectionVariant;
}

export interface DropdownListProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    trigger: ReactNode;
    items: DropdownListItem[];
    align?: "start" | "end";
    /** 메뉴를 트리거 위·아래 어디에 붙일지. `auto`는 공간에 따라 뒤집습니다. */
    side?: "auto" | "top" | "bottom";
    showTriggerChevron?: boolean;
    menuTitle?: ReactNode;
}

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
}

export interface DropdownSubTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export interface DropdownSubContentProps extends HTMLAttributes<HTMLDivElement> {}

