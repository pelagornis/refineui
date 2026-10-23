import { createRoot } from "react-dom/client";
import { act } from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(() => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    class ResizeObserverStub {
        observe() {}
        unobserve() {}
        disconnect() {}
    }
    vi.stubGlobal("ResizeObserver", ResizeObserverStub);
    vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => window.setTimeout(() => callback(performance.now()), 0));
    vi.stubGlobal("cancelAnimationFrame", (id: number) => window.clearTimeout(id));
    vi.stubGlobal("scrollTo", () => {});
    vi.stubGlobal("scrollBy", () => {});
    Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", { value: () => {}, configurable: true });
});

afterEach(() => document.body.replaceChildren());

describe("authoring browser presets", () => {
    it("mounts every root preset without a React render error or undefined output", async () => {
        const RefineUI = await import("../dist/index.js");
        const authoring = await import("../dist/authoring-manifest.js");
        const errors: unknown[] = [];
        const error = console.error;
        console.error = (...args: unknown[]) => errors.push(args);
        try {
            for (const theme of ["light", "dark"]) {
                for (const component of authoring.default.components.filter((component) => component.kind === "root")) {
                    const host = document.createElement("div");
                    host.dataset.theme = theme;
                    host.className = theme === "dark" ? "dark" : "";
                    document.body.append(host);
                    const root = createRoot(host);
                    await act(async () => root.render(authoring.renderAuthoringNode(component.presets[0].root, RefineUI)));
                    expect(host.textContent).not.toContain("undefined");
                    await act(async () => root.unmount());
                }
            }
        } finally {
            console.error = error;
        }
        expect(errors).toEqual([]);
    });

    it("passes prop-target slots into the component API", async () => {
        const RefineUI = await import("../dist/index.js");
        const authoring = await import("../dist/authoring-manifest.js");
        const toast = authoring.default.components.find((component) => component.exportName === "Toast");
        expect(toast).toBeDefined();
        const host = document.createElement("div");
        document.body.append(host);
        const root = createRoot(host);
        await act(async () => root.render(authoring.renderAuthoringNode(toast!.presets[0].root, RefineUI)));
        expect(host.textContent).toContain("Changes saved");
        expect(host.querySelector('[data-refineui="toast"]')).not.toBeNull();
        await act(async () => root.unmount());
    });

    it("keeps stateful authoring presets interactive", async () => {
        const RefineUI = await import("../dist/index.js");
        const authoring = await import("../dist/authoring-manifest.js");
        const tabs = authoring.default.components.find((component) => component.exportName === "Tabs");
        expect(tabs).toBeDefined();
        const host = document.createElement("div");
        document.body.append(host);
        const root = createRoot(host);
        await act(async () => root.render(authoring.renderAuthoringNode(tabs!.presets[0].root, RefineUI)));
        const triggers = host.querySelectorAll<HTMLButtonElement>('[data-refineui="tab"]');
        expect(triggers).toHaveLength(2);
        expect(triggers[0].getAttribute("aria-selected")).toBe("true");
        await act(async () => triggers[1].click());
        expect(triggers[1].getAttribute("aria-selected")).toBe("true");
        expect(host.textContent).toContain("Second tab content");
        await act(async () => root.unmount());
    });

    it("updates carousel, tree, and select presets through their public controls", async () => {
        const RefineUI = await import("../dist/index.js");
        const authoring = await import("../dist/authoring-manifest.js");
        const host = document.createElement("div");
        document.body.append(host);
        const root = createRoot(host);
        const presetFor = (exportName: string) => authoring.default.components.find((component) => component.exportName === exportName)!;

        await act(async () => root.render(authoring.renderAuthoringNode(presetFor("Carousel").presets[0].root, RefineUI)));
        const carouselNext = host.querySelector<HTMLButtonElement>('[data-refineui="carousel-nav"][data-dir="next"]');
        expect(carouselNext?.disabled).toBe(false);
        await act(async () => carouselNext!.click());
        expect(host.querySelector<HTMLButtonElement>('[data-refineui="carousel-indicator"][aria-selected="true"]')?.getAttribute("aria-label")).toBe("Go to slide 2");

        await act(async () => root.render(authoring.renderAuthoringNode(presetFor("Tree").presets[0].root, RefineUI)));
        const treeRoot = host.querySelector<HTMLElement>('[data-refineui="tree-item"]');
        expect(treeRoot?.getAttribute("aria-expanded")).toBe("true");
        const treeTrigger = host.querySelector<HTMLElement>('[data-refineui="tree-item-trigger"]');
        await act(async () => treeTrigger!.click());
        expect(treeRoot?.getAttribute("aria-selected")).toBe("true");
        expect(treeRoot?.getAttribute("aria-expanded")).toBe("false");

        await act(async () => root.render(authoring.renderAuthoringNode(presetFor("Select").presets[0].root, RefineUI)));
        const selectTrigger = host.querySelector<HTMLButtonElement>('[data-refineui="select-trigger"]');
        await act(async () => selectTrigger!.dispatchEvent(new MouseEvent("mousedown", { bubbles: true })));
        expect(document.body.querySelector('[data-refineui="select-menu"]')).not.toBeNull();
        const options = document.body.querySelectorAll<HTMLElement>('[data-refineui="select-item"]');
        await act(async () => options[1]!.click());
        expect(selectTrigger?.textContent).toContain("Option 2");
        expect(selectTrigger?.getAttribute("aria-expanded")).toBe("false");
        await act(async () => root.unmount());
    });

    it("opens portal-backed presets in the editor's themed overlay root", async () => {
        const RefineUI = await import("../dist/index.js");
        const authoring = await import("../dist/authoring-manifest.js");
        const dialog = authoring.default.components.find((component) => component.exportName === "Dialog")!;
        const host = document.createElement("div");
        host.className = "dark";
        host.dataset.theme = "dark";
        document.body.append(host);
        const overlay = document.createElement("div");
        overlay.className = "dark";
        overlay.dataset.theme = "dark";
        document.body.append(overlay);
        const root = createRoot(host);
        await act(async () => root.render(authoring.renderAuthoringNode(dialog.presets[0].root, RefineUI, { portalContainer: overlay })));
        const trigger = Array.from(host.querySelectorAll<HTMLButtonElement>("button")).find((button) => button.textContent === "Open dialog");
        expect(trigger).toBeDefined();
        await act(async () => trigger!.click());
        const portal = overlay.querySelector<HTMLElement>('[data-refineui="dialog"]');
        expect(portal).not.toBeNull();
        expect(host.contains(portal)).toBe(false);
        expect(portal?.parentElement).toBe(overlay);
        expect(overlay.dataset.theme).toBe("dark");
        expect(portal?.getAttribute("data-state")).toBe("open");
        await act(async () => root.unmount());
    });
});
