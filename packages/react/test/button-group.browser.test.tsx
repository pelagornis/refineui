import { act, createRef } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Button, ButtonGroup } from "../src";

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

const buttons = () => Array.from(host.querySelectorAll<HTMLElement>('[data-refineui="button"]'));

describe("ButtonGroup", () => {
    it("renders a labelled, attached group with a forwarded ref", async () => {
        const root = createRoot(host);
        const ref = createRef<HTMLDivElement>();
        await act(async () => root.render(<ButtonGroup ref={ref} aria-label="Calendar view"><Button>Day</Button><Button>Week</Button></ButtonGroup>));
        const group = host.querySelector<HTMLElement>('[role="group"]')!;
        expect(group.getAttribute("data-refineui")).toBe("button-group");
        expect(group.getAttribute("aria-label")).toBe("Calendar view");
        expect(group.dataset.attached).toBe("true");
        expect(group.dataset.size).toBe("md");
        expect(group.dataset.orientation).toBe("horizontal");
        expect(ref.current).toBe(group);
        await act(async () => root.unmount());
    });

    it("cascades size and variant to Buttons (ghost md by default)", async () => {
        const root = createRoot(host);
        await act(async () => root.render(<ButtonGroup aria-label="View"><Button>Day</Button><Button>Week</Button></ButtonGroup>));
        expect(buttons().map((button) => [button.dataset.size, button.dataset.variant])).toEqual([["md", "ghost"], ["md", "ghost"]]);
        await act(async () => root.render(<ButtonGroup aria-label="View" size="lg" variant="outline"><Button>Day</Button></ButtonGroup>));
        expect([buttons()[0].dataset.size, buttons()[0].dataset.variant]).toEqual(["lg", "outline"]);
        await act(async () => root.unmount());
    });

    it("lets an explicit Button prop win over the group", async () => {
        const root = createRoot(host);
        await act(async () =>
            root.render(<ButtonGroup aria-label="Actions" size="sm"><Button>Cancel</Button><Button variant="primary" size="lg">Save</Button></ButtonGroup>),
        );
        expect(buttons().map((button) => [button.dataset.size, button.dataset.variant])).toEqual([["sm", "ghost"], ["lg", "primary"]]);
        await act(async () => root.unmount());
    });

    it("leaves Buttons outside a group untouched", async () => {
        const root = createRoot(host);
        await act(async () => root.render(<Button>Alone</Button>));
        expect([buttons()[0].dataset.size, buttons()[0].dataset.variant]).toEqual(["md", "primary"]);
        await act(async () => root.unmount());
    });

    it("supports vertical orientation", async () => {
        const root = createRoot(host);
        await act(async () => root.render(<ButtonGroup aria-label="Zoom" orientation="vertical"><Button>+</Button><Button>-</Button></ButtonGroup>));
        const group = host.querySelector<HTMLElement>('[data-refineui="button-group"]')!;
        expect(group.dataset.orientation).toBe("vertical");
        expect(group.getAttribute("aria-orientation")).toBe("vertical");
        expect(group.className).toContain("flex-col");
        await act(async () => root.unmount());
    });

    it("drops the tube when attached is false", async () => {
        const root = createRoot(host);
        await act(async () => root.render(<ButtonGroup aria-label="Actions" attached={false}><Button>Cancel</Button><Button>Save</Button></ButtonGroup>));
        const group = host.querySelector<HTMLElement>('[data-refineui="button-group"]')!;
        expect(group.dataset.attached).toBeUndefined();
        expect(group.className).not.toContain("bg-refineui-alias-background-brand-subtle");
        expect(group.className).toContain("gap-refineui-size-xx-small");
        await act(async () => root.unmount());
    });
});
