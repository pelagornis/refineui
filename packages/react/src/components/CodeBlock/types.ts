import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export type CodeBlockProps = HTMLAttributes<HTMLDivElement>;
export type CodeBlockHeaderProps = HTMLAttributes<HTMLDivElement>;
export type CodeBlockTitleProps = HTMLAttributes<HTMLDivElement>;
export type CodeBlockActionsProps = HTMLAttributes<HTMLDivElement>;

export interface CodeBlockContentProps extends HTMLAttributes<HTMLPreElement> {
    /** Preserve long lines when false; wrap them at the available width when true. */
    wrap?: boolean;
    /** Render a non-selectable number gutter for each CodeBlockLine. */
    lineNumbers?: boolean;
}

export interface CodeBlockLineProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "highlighted";
    /** Assigned automatically by CodeBlockContent when lineNumbers is enabled. */
    lineNumber?: number;
}

export interface CodeBlockCopyButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    /** Plain source used by the copy action; syntax-highlighted children remain presentation only. */
    value: string;
    copiedLabel?: string;
    copyLabel?: string;
    onCopied?: (value: string) => void;
    children?: ReactNode;
}
