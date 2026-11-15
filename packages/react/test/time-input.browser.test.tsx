import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TimeInput } from "../src";

let host: HTMLDivElement;

beforeEach(() => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    vi.stubGlobal("getComputedStyle", () => ({ width: "320px", height: "320px" }));
    vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
        x: 0, y: 0, top: 0, left: 0, right: 320, bottom: 320, width: 320, height: 320, toJSON: () => ({}),
    });
    host = document.createElement("div");
    document.body.append(host);
});

afterEach(() => {
    document.body.replaceChildren();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe("TimeInput", () => {
    it("commits a time selected from the scrollable hour and minute columns", async () => {
        const onValueChange = vi.fn();
        const root = createRoot(host);
        await act(async () => root.render(<TimeInput defaultValue="09:30" onValueChange={onValueChange} />));

        const trigger = host.querySelector<HTMLButtonElement>('[data-refineui="time-input"]')!;
        await act(async () => trigger.click());

        const popover = document.querySelector<HTMLElement>('[data-refineui="popover"]')!;
        expect(popover.dataset.align).toBe("end");
        expect(popover.querySelectorAll('[data-time-input-column="minute"] button')).toHaveLength(60);
        const hour = [...popover.querySelectorAll<HTMLElement>('[data-time-input-column="hour"] button')].find((button) => button.textContent === "10")!;
        const minute = [...popover.querySelectorAll<HTMLElement>('[data-time-input-column="minute"] button')].find((button) => button.textContent === "15")!;
        await act(async () => hour.click());
        await act(async () => minute.click());

        expect(onValueChange).toHaveBeenCalledWith("10:15");
        expect([...popover.querySelectorAll<HTMLButtonElement>("button")].some((button) => button.textContent === "Apply")).toBe(false);
        await act(async () => root.unmount());
    });

    it("uses an AM/PM column in 12-hour mode while preserving the HH:mm value", async () => {
        const onValueChange = vi.fn();
        const root = createRoot(host);
        await act(async () => root.render(<TimeInput defaultValue="09:30" hourCycle="12h" onValueChange={onValueChange} />));

        const trigger = host.querySelector<HTMLButtonElement>('[data-refineui="time-input"]')!;
        expect(trigger.textContent).toContain("AM");
        await act(async () => trigger.click());

        const popover = document.querySelector<HTMLElement>('[data-refineui="popover"]')!;
        expect(popover.querySelector("[data-time-input-column]")?.getAttribute("data-time-input-column")).toBe("period");
        const period = [...popover.querySelectorAll<HTMLElement>('[data-time-input-column="period"] button')].find((button) => button.textContent === "PM")!;
        await act(async () => period.click());

        expect(onValueChange).toHaveBeenCalledWith("21:30");
        await act(async () => root.unmount());
    });
});
