import type { ButtonProps } from "../Button";
import type { HTMLAttributes, ReactNode } from "react";

export type ResultVariant = "success" | "info" | "warning" | "error";

export interface ResultProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    variant?: ResultVariant;
    figure?: ReactNode;
    title?: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
}

export type ResultIconProps = HTMLAttributes<HTMLDivElement> & { name?: string };
export type ResultTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type ResultDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export type ResultActionsProps = HTMLAttributes<HTMLDivElement>;
export type ResultButtonProps = ButtonProps;
