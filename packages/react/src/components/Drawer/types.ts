import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { ButtonProps } from "../Button";

export type DrawerPlacement = "left" | "right";
export type DrawerSize = "small" | "medium" | "large";

export interface DrawerProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    placement?: DrawerPlacement;
    /** Web Kit Overlay `635:1756` — `componentSizes.drawerWidthSm` / `Md` / `Lg` */
    size?: DrawerSize;
    children: ReactNode;
}

export type DrawerTriggerProps = ButtonProps;

export interface DrawerContentProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    container?: Element | DocumentFragment | null;
    style?: CSSProperties;
    placement?: DrawerPlacement;
    size?: DrawerSize;
}

export interface DrawerHeaderProps extends HTMLAttributes<HTMLDivElement> {
    showClose?: boolean;
    actions?: ReactNode;
}

export type DrawerTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type DrawerDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export type DrawerBodyProps = HTMLAttributes<HTMLDivElement>;
export type DrawerFooterProps = HTMLAttributes<HTMLDivElement>;

export interface DrawerCloseProps extends Omit<ButtonProps, "children"> {
    children?: ReactNode;
}

