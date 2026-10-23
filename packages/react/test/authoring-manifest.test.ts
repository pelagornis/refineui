import { describe, expect, it } from "vitest";
import manifest from "../spec/authoring/manifest.json";

describe("authoring manifest", () => {
    it("gives every root a full preset and every part an explicit parent", () => {
        for (const component of manifest.components) {
            if (component.kind === "root") expect(component.presets?.length).toBeGreaterThan(0);
            if (component.kind === "part") expect(component.parents?.length).toBeGreaterThan(0);
        }
    });

    it("ships full, ready-to-insert core composite presets", () => {
        for (const name of ["Bubble", "Carousel", "Tree"]) {
            const component = manifest.components.find((entry) => entry.exportName === name);
            expect(component?.presets?.[0]?.root.component).toBe(name);
            expect(component?.preview.mode).toBe("full");
        }
    });

    it("models ReactNode properties as structural slots rather than JSON props", () => {
        const toast = manifest.components.find((entry) => entry.exportName === "Toast");
        expect(toast?.props.some((prop) => prop.name === "message" || prop.name === "icon")).toBe(false);
        expect(toast?.slots).toEqual(expect.arrayContaining([
            expect.objectContaining({ name: "message", target: "prop", prop: "message", accepts: ["Text"] }),
            expect.objectContaining({ name: "icon", target: "prop", prop: "icon", accepts: ["WebIcon"] }),
        ]));
        expect(toast?.presets?.[0]?.root.slots?.message?.[0]?.text).toBe("Changes saved");

        const commandItem = manifest.components.find((entry) => entry.exportName === "CommandItem");
        expect(commandItem?.iconSlots).toEqual(expect.arrayContaining([
            expect.objectContaining({ name: "startIcon" }),
            expect.objectContaining({ name: "endIcon" }),
        ]));
    });
});
