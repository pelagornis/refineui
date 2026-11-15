import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DateInput } from "../src";

let host: HTMLDivElement;

beforeEach(() => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    vi.stubGlobal("getComputedStyle", () => ({ width: "320px", height: "320px" }));
    vi.stubGlobal(
        "ResizeObserver",
        class {
            observe() {}
            unobserve() {}
            disconnect() {}
        },
    );
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { configurable: true, value: () => {} });
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: 320,
        bottom: 320,
        width: 320,
        height: 320,
        toJSON: () => ({}),
    });
    host = document.createElement("div");
    document.body.append(host);
});

afterEach(() => {
    document.body.replaceChildren();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe("DateInput", () => {
    it("opens a calendar and closes after selecting a date", async () => {
        const onValueChange = vi.fn();
        const root = createRoot(host);
        await act(async () => root.render(<DateInput defaultValue={new Date(2026, 10, 13)} onValueChange={onValueChange} />));

        const trigger = host.querySelector<HTMLButtonElement>('[data-refineui="date-input"]')!;
        expect(trigger.textContent).toContain("2026");
        await act(async () => trigger.click());
        expect(document.querySelector('[data-refineui="popover"]')).not.toBeNull();

        const day = document.querySelector<HTMLButtonElement>('[data-refineui="calendar-day"][data-current-month]')!;
        await act(async () => day.click());
        expect(onValueChange).toHaveBeenCalledWith(expect.any(Date));
        await act(async () => root.unmount());
    });

    it("uses Input sizing and a surfaced, icon-aligned calendar popover", async () => {
        const root = createRoot(host);
        await act(async () => root.render(<DateInput size="sm" defaultValue={new Date(2026, 10, 13)} />));

        const trigger = host.querySelector<HTMLButtonElement>('[data-refineui="date-input"]')!;
        expect(trigger.dataset.size).toBe("sm");
        await act(async () => trigger.click());

        const popover = document.querySelector<HTMLElement>('[data-refineui="popover"]')!;
        const calendar = popover.querySelector<HTMLElement>('[data-refineui="calendar"]')!;
        expect(popover.dataset.align).toBe("end");
        expect(calendar.className).toContain("border-none");
        await act(async () => root.unmount());
    });

    it("keeps the date popover open while choosing a calendar month", async () => {
        const root = createRoot(host);
        await act(async () => root.render(<DateInput defaultValue={new Date(2026, 10, 13)} />));

        const trigger = host.querySelector<HTMLButtonElement>('[data-refineui="date-input"]')!;
        await act(async () => trigger.click());

        const month = document.querySelector<HTMLButtonElement>('[data-calendar-header="caption-month"]')!;
        await act(async () => {
            month.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, button: 0 }));
        });

        const selectMenu = document.querySelector<HTMLElement>('[data-refineui="select-menu"]')!;
        await act(async () => {
            selectMenu.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        });

        expect(document.querySelector('[data-refineui="popover"]')).not.toBeNull();
        expect(document.querySelector('[data-refineui="select-menu"]')).not.toBeNull();
        await act(async () => root.unmount());
    });
});
