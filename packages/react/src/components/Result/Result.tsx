import { clsx } from "clsx";
import { iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";
import { Button } from "../Button";
import { resultStyles } from "./style";
import type { ResultActionsProps, ResultButtonProps, ResultDescriptionProps, ResultIconProps, ResultProps, ResultTitleProps, ResultVariant } from "./types";

const variantIcons: Record<ResultVariant, string> = { success: "checkmark", info: "info", warning: "warning", error: "error-circle" };

export function Result({ variant = "info", figure, title, description, actions, children, className, ...props }: ResultProps) {
    const figureClass = variant === "success" ? resultStyles.figureSuccess : variant === "warning" ? resultStyles.figureWarning : variant === "error" ? resultStyles.figureError : resultStyles.figureInfo;
    const content = children ?? (title || description || actions || figure ? <><ResultIcon name={variantIcons[variant]} className={figureClass}>{figure}</ResultIcon><div className={resultStyles.content}>{title && <ResultTitle>{title}</ResultTitle>}{description && <ResultDescription>{description}</ResultDescription>}</div>{actions && <ResultActions>{actions}</ResultActions>}</> : null);
    return <section data-refineui="result" data-variant={variant} className={clsx(resultStyles.root, className)} {...props}>{content}</section>;
}

export function ResultIcon({ name, children, className, ...props }: ResultIconProps) {
    return <div data-refineui="result-icon" className={clsx(resultStyles.figure, className)} {...props}>{children ?? <WebIcon name={name ?? "info"} iconStyle="regular" size={iconSizes.large} color="currentColor" fallback="●" aria-hidden />}</div>;
}
export function ResultTitle({ className, ...props }: ResultTitleProps) { return <h2 data-refineui="result-title" className={clsx(resultStyles.title, className)} {...props} />; }
export function ResultDescription({ className, ...props }: ResultDescriptionProps) { return <p data-refineui="result-description" className={clsx(resultStyles.description, className)} {...props} />; }
export function ResultActions({ className, ...props }: ResultActionsProps) { return <div data-refineui="result-actions" className={clsx(resultStyles.actions, className)} {...props} />; }
export function ResultButton({ className, size = "lg", ...props }: ResultButtonProps) { return <Button className={clsx(resultStyles.button, className)} size={size} {...props} />; }
