import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { ButtonProps } from "../Button";

export type DialogSize = "lg" | "sm";

export interface DialogProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Web Kit `size`: Large(600px) / Small(300px) */
    size?: DialogSize;
    children: ReactNode;
}

export type DialogTriggerProps = ButtonProps;

export interface DialogContentProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    container?: Element | DocumentFragment | null;
    style?: CSSProperties;
    /**
     * When `false`, children render directly in the panel (no ScrollArea).
     * Useful for composed surfaces like Command that manage their own scroll.
     * @default true
     */
    scrollable?: boolean;
}

export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
    showClose?: boolean;
}

export type DialogTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type DialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export type DialogCloseProps = ButtonHTMLAttributes<HTMLButtonElement>;

