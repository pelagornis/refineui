import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    CodeBlock,
    CodeBlockActions,
    CodeBlockContent,
    CodeBlockCopyButton,
    CodeBlockHeader,
    CodeBlockLine,
    CodeBlockTitle,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../src";

let host: HTMLDivElement;

beforeEach(() => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    host = document.createElement("div");
    document.body.append(host);
});

afterEach(() => {
    document.body.replaceChildren();
    vi.unstubAllGlobals();
});

describe("CodeBlock", () => {
    it("renders composable header, highlighted lines, wrapping, and line numbers", async () => {
        const root = createRoot(host);
        await act(async () => root.render(
            <CodeBlock>
                <CodeBlockHeader>
                    <CodeBlockTitle>route.ts</CodeBlockTitle>
                    <CodeBlockActions />
                </CodeBlockHeader>
                <CodeBlockContent wrap lineNumbers>
                    <CodeBlockLine>export const ready = true</CodeBlockLine>
                    <CodeBlockLine variant="highlighted">export const status = "ok"</CodeBlockLine>
                </CodeBlockContent>
            </CodeBlock>,
        ));

        expect(host.querySelector('[data-refineui="code-block"]')).not.toBeNull();
        const content = host.querySelector('[data-refineui="code-block-content"]');
        expect(content?.getAttribute("data-wrap")).toBe("true");
        expect(content?.getAttribute("dir")).toBe("ltr");
        expect(content?.getAttribute("tabindex")).toBe("0");
        expect(host.querySelectorAll('[data-refineui="code-block-line"]')).toHaveLength(2);
        expect(host.querySelector('[data-refineui="code-block-line"][data-variant="highlighted"]')).not.toBeNull();
        expect(host.textContent).toContain("1");
        expect(host.textContent).toContain("2");
        await act(async () => root.unmount());
    });

    it("copies the supplied source and reports copied state", async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
        const root = createRoot(host);
        await act(async () => root.render(<CodeBlockCopyButton value="const answer = 42" />));
        const copy = host.querySelector<HTMLButtonElement>('[data-refineui="code-block-copy"]')!;
        await act(async () => copy.click());
        expect(writeText).toHaveBeenCalledWith("const answer = 42");
        expect(copy.getAttribute("data-state")).toBe("copied");
        await act(async () => root.unmount());
    });

    it("keeps a containing dialog open when copying", async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
        const root = createRoot(host);

        await act(async () => root.render(
            <Dialog defaultOpen>
                <DialogContent scrollable={false}>
                    <DialogHeader showClose={false}>
                        <DialogTitle>Source</DialogTitle>
                    </DialogHeader>
                    <CodeBlock>
                        <CodeBlockHeader>
                            <CodeBlockTitle>route.ts</CodeBlockTitle>
                            <CodeBlockActions>
                                <CodeBlockCopyButton value="export const ready = true" />
                            </CodeBlockActions>
                        </CodeBlockHeader>
                        <CodeBlockContent>
                            <CodeBlockLine>export const ready = true</CodeBlockLine>
                        </CodeBlockContent>
                    </CodeBlock>
                </DialogContent>
            </Dialog>,
        ));

        const copy = document.querySelector<HTMLButtonElement>('[data-refineui="code-block-copy"]')!;
        await act(async () => copy.click());
        expect(writeText).toHaveBeenCalledWith("export const ready = true");
        expect(document.querySelector('[data-refineui="dialog"]')?.getAttribute("data-state")).toBe("open");
        await act(async () => root.unmount());
    });
});
