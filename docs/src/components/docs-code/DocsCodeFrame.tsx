import type { CSSProperties, ReactNode } from "react";
import { CodeBlock, CodeBlockActions, CodeBlockContent, CodeBlockLine } from "@refineui/react";

/** [content, lightColor, darkColor, fontStyle?] — produced by src/remark/remarkDocsCode.mjs */
export type DocsCodeToken = [string, string?, string?, number?];

function tokenStyle([, light, dark, fontStyle = 0]: DocsCodeToken): CSSProperties | undefined {
    if (!light && !dark && !fontStyle) return undefined;
    const style: Record<string, string> = {};
    if (light) style["--shiki-light"] = light;
    if (dark) style["--shiki-dark"] = dark;
    if (fontStyle & 1) style.fontStyle = "italic";
    if (fontStyle & 2) style.fontWeight = "bold";
    if (fontStyle & 4) style.textDecoration = "underline";
    return style as CSSProperties;
}

/**
 * Static (server-rendered) highlighted lines. The surrounding ScrollArea viewport is the
 * scroll container and keyboard tab stop, so the <pre> itself does not scroll or take focus.
 */
export function DocsCodeLines({ tokens, wrap = false }: { tokens: DocsCodeToken[][]; wrap?: boolean }) {
    return (
        <CodeBlockContent tabIndex={-1} wrap={wrap}>
            {tokens.map((line, lineIndex) => (
                <CodeBlockLine key={lineIndex}>
                    {line.length === 0
                        ? " "
                        : line.map((token, tokenIndex) => (
                              <span key={tokenIndex} style={tokenStyle(token)}>
                                  {token[0]}
                              </span>
                          ))}
                </CodeBlockLine>
            ))}
        </CodeBlockContent>
    );
}

type DocsCodeFrameProps = {
    lang: string;
    /** Scrollable body — the DocsCodeScroll island wrapping DocsCodeLines. */
    children?: ReactNode;
    /** Copy control (a hydrated island), pinned top-right outside the scroller. */
    actions?: ReactNode;
};

/** Static (server-rendered) RefineUI CodeBlock shell for docs fences. */
export default function DocsCodeFrame({ lang, children, actions }: DocsCodeFrameProps) {
    return (
        <CodeBlock className="docs-code" data-lang={lang}>
            {children}
            <CodeBlockActions className="docs-code-actions">{actions}</CodeBlockActions>
        </CodeBlock>
    );
}
