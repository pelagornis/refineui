import { clsx } from "clsx";
import { Children, cloneElement, createContext, isValidElement, useContext, useEffect, useState, type ReactElement } from "react";
import { iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";
import { Button } from "../Button";
import { codeBlockStyles } from "./style";
import type {
    CodeBlockActionsProps,
    CodeBlockContentProps,
    CodeBlockCopyButtonProps,
    CodeBlockHeaderProps,
    CodeBlockLineProps,
    CodeBlockProps,
    CodeBlockTitleProps,
} from "./types";

type CodeBlockContextValue = { lineNumbers: boolean };
const CodeBlockContext = createContext<CodeBlockContextValue>({ lineNumbers: false });

export function CodeBlock({ className, ...props }: CodeBlockProps) {
    return <div data-refineui="code-block" className={clsx(codeBlockStyles.root, className)} {...props} />;
}

export function CodeBlockHeader({ className, ...props }: CodeBlockHeaderProps) {
    return <div data-refineui="code-block-header" className={clsx(codeBlockStyles.header, className)} {...props} />;
}

export function CodeBlockTitle({ className, ...props }: CodeBlockTitleProps) {
    return <div data-refineui="code-block-title" className={clsx(codeBlockStyles.title, className)} {...props} />;
}

export function CodeBlockActions({ className, ...props }: CodeBlockActionsProps) {
    return <div data-refineui="code-block-actions" className={clsx(codeBlockStyles.actions, className)} {...props} />;
}

export function CodeBlockContent({ wrap = false, lineNumbers = false, className, children, dir = "ltr", tabIndex = 0, ...props }: CodeBlockContentProps) {
    const lines = Children.map(children, (child, index) =>
        isValidElement<CodeBlockLineProps>(child)
            ? cloneElement(child as ReactElement<CodeBlockLineProps>, { lineNumber: lineNumbers ? index + 1 : undefined })
            : child,
    );
    return (
        <CodeBlockContext.Provider value={{ lineNumbers }}>
            <pre
                data-refineui="code-block-content"
                data-wrap={wrap ? "true" : "false"}
                data-line-numbers={lineNumbers ? "true" : "false"}
                dir={dir}
                tabIndex={tabIndex}
                className={clsx(codeBlockStyles.content, wrap ? codeBlockStyles.contentWrapped : codeBlockStyles.contentUnwrapped, className)}
                {...props}
            >
                <code>{lines}</code>
            </pre>
        </CodeBlockContext.Provider>
    );
}

export function CodeBlockLine({ variant = "default", lineNumber, className, children, ...props }: CodeBlockLineProps) {
    const { lineNumbers } = useContext(CodeBlockContext);
    return (
        <span
            data-refineui="code-block-line"
            data-variant={variant}
            className={clsx(codeBlockStyles.line, variant === "highlighted" && codeBlockStyles.lineHighlighted, className)}
            {...props}
        >
            {lineNumbers ? <span aria-hidden className={codeBlockStyles.lineNumber}>{lineNumber}</span> : null}
            <span className={codeBlockStyles.lineContent}>{children}</span>
        </span>
    );
}

async function copyText(value: string): Promise<void> {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return;
    }
    if (typeof document === "undefined") throw new Error("Clipboard is unavailable");
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
}

export function CodeBlockCopyButton({
    value,
    copiedLabel = "Copied",
    copyLabel = "Copy code",
    onCopied,
    onClick,
    className,
    children,
    ...props
}: CodeBlockCopyButtonProps) {
    const [copied, setCopied] = useState(false);
    useEffect(() => {
        if (!copied) return;
        const timeout = window.setTimeout(() => setCopied(false), 1600);
        return () => window.clearTimeout(timeout);
    }, [copied]);

    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            layout="icon"
            aria-label={copied ? copiedLabel : copyLabel}
            title={copied ? copiedLabel : copyLabel}
            data-refineui="code-block-copy"
            data-state={copied ? "copied" : "idle"}
            className={className}
            {...props}
            onClick={async (event) => {
                onClick?.(event);
                if (event.defaultPrevented) return;
                try {
                    await copyText(value);
                    setCopied(true);
                    onCopied?.(value);
                } catch {
                    setCopied(false);
                }
            }}
        >
            {children ?? (
                <WebIcon
                    name={copied ? "checkmark" : "copy"}
                    size={iconSizes.small}
                    color="currentColor"
                    aria-hidden
                    fallback={copied ? "✓" : "⧉"}
                />
            )}
        </Button>
    );
}
