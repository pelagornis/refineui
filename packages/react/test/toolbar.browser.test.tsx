import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Button, Input, Toolbar, ToolbarButton, ToolbarGroup, ToolbarDivider, ToolbarToggleButton } from "../src";

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

const press = (target: HTMLElement, key: string) =>
    act(async () => {
        target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
    });

describe("Toolbar", () => {
    it("renders a labelled toolbar with attached groups and dividers", async () => {
        const root = createRoot(host);
        await act(async () =>
            root.render(
                <Toolbar label="Text formatting" attached>
                    <ToolbarGroup aria-label="Clipboard"><ToolbarButton aria-label="Copy">C</ToolbarButton><ToolbarButton aria-label="Cut">X</ToolbarButton></ToolbarGroup>
                    <ToolbarDivider />
                    <ToolbarGroup aria-label="More"><ToolbarButton aria-label="More">…</ToolbarButton></ToolbarGroup>
                </Toolbar>,
            ),
        );
        const toolbar = host.querySelector<HTMLElement>('[role="toolbar"]')!;
        expect(toolbar.getAttribute("data-refineui")).toBe("toolbar");
        expect(toolbar.getAttribute("aria-label")).toBe("Text formatting");
        expect(toolbar.dataset.attached).toBe("true");
        const groups = host.querySelectorAll<HTMLElement>('[data-refineui="toolbar-group"]');
        expect(groups).toHaveLength(2);
        for (const group of groups) {
            expect(group.getAttribute("role")).toBe("group");
            expect(group.className).toContain("bg-refineui-alias-background-brand-subtle");
            expect(group.dataset.variant).toBeUndefined();
        }
        expect(host.querySelector('[data-refineui="toolbar-divider"]')?.getAttribute("aria-orientation")).toBe("vertical");
        await act(async () => root.unmount());
    });

    it("toggles aria-pressed on ToolbarToggleButton", async () => {
        const root = createRoot(host);
        const onPressedChange = vi.fn();
        await act(async () => root.render(<Toolbar label="Style"><ToolbarToggleButton aria-label="Bold" onPressedChange={onPressedChange}>B</ToolbarToggleButton></Toolbar>));
        const bold = host.querySelector<HTMLButtonElement>('[data-refineui="toolbar-toggle-button"]')!;
        expect(bold.getAttribute("aria-pressed")).toBe("false");
        await act(async () => bold.click());
        expect(bold.getAttribute("aria-pressed")).toBe("true");
        expect(onPressedChange).toHaveBeenCalledWith(true);
        await act(async () => root.unmount());
    });

    it("cascades its size to Buttons and Field controls, unless a child sets its own", async () => {
        const root = createRoot(host);
        await act(async () =>
            root.render(
                <Toolbar label="Filters" size="lg"><Input aria-label="Search" /><Button>Save</Button><Button size="sm">Small</Button><ToolbarButton aria-label="More">…</ToolbarButton></Toolbar>,
            ),
        );
        const buttons = Array.from(host.querySelectorAll<HTMLElement>('[data-refineui="button"], [data-refineui="toolbar-button"]'));
        expect(buttons.map((button) => button.dataset.size)).toEqual(["lg", "sm", "lg"]);
        expect(host.querySelector("input")?.closest("[data-size]")?.getAttribute("data-size")).toBe("lg");
        await act(async () => root.unmount());
    });

    it("inherits vertical orientation in groups and dividers", async () => {
        const root = createRoot(host);
        await act(async () => root.render(<Toolbar label="Editor" orientation="vertical"><ToolbarGroup aria-label="Formatting"><ToolbarButton aria-label="Copy">C</ToolbarButton></ToolbarGroup><ToolbarDivider /></Toolbar>));
        expect(host.querySelector('[role="toolbar"]')?.getAttribute("aria-orientation")).toBe("vertical");
        expect(host.querySelector('[data-refineui="toolbar-group"]')?.getAttribute("data-orientation")).toBe("vertical");
        expect(host.querySelector('[data-refineui="toolbar-divider"]')?.getAttribute("aria-orientation")).toBe("horizontal");
        await act(async () => root.unmount());
    });

    it("is a single Tab stop and moves focus with arrow keys, Home and End across groups", async () => {
        const root = createRoot(host);
        await act(async () =>
            root.render(
                <Toolbar label="Editor">
                    <ToolbarGroup aria-label="Style"><ToolbarButton aria-label="Bold">B</ToolbarButton><ToolbarButton aria-label="Italic" disabled>I</ToolbarButton></ToolbarGroup>
                    <ToolbarDivider />
                    <ToolbarButton aria-label="Underline">U</ToolbarButton>
                </Toolbar>,
            ),
        );
        const [bold, italic, underline] = Array.from(host.querySelectorAll<HTMLButtonElement>('[data-refineui="toolbar-button"]'));
        expect([bold.tabIndex, underline.tabIndex]).toEqual([0, -1]);
        expect(italic.disabled).toBe(true);

        await act(async () => bold.focus());
        await press(bold, "ArrowRight");
        expect(document.activeElement).toBe(underline);
        expect([bold.tabIndex, underline.tabIndex]).toEqual([-1, 0]);
        await press(underline, "ArrowRight");
        expect(document.activeElement).toBe(bold);
        await press(bold, "End");
        expect(document.activeElement).toBe(underline);
        await press(underline, "Home");
        expect(document.activeElement).toBe(bold);
        await act(async () => root.unmount());
    });

    it("lets arrow keys move the caret inside a text field until it reaches an edge", async () => {
        const root = createRoot(host);
        await act(async () => root.render(<Toolbar label="Search"><Input aria-label="Query" defaultValue="abc" /><ToolbarButton aria-label="Go">G</ToolbarButton></Toolbar>));
        const input = host.querySelector<HTMLInputElement>("input")!;
        const go = host.querySelector<HTMLButtonElement>('[data-refineui="toolbar-button"]')!;
        await act(async () => input.focus());
        input.setSelectionRange(1, 1);
        await press(input, "ArrowRight");
        expect(document.activeElement).toBe(input);
        input.setSelectionRange(3, 3);
        await press(input, "ArrowRight");
        expect(document.activeElement).toBe(go);
        await act(async () => root.unmount());
    });
});
