import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
if (!existsSync(resolve(dist, "index.js"))) {
    throw new Error("Build @refineui/react before verifying authoring presets.");
}

const require = createRequire(import.meta.url);
const { renderToStaticMarkup } = require("react-dom/server");
const exports = await import(pathToFileURL(resolve(dist, "index.js")).href);
const authoring = await import(pathToFileURL(resolve(dist, "authoring-manifest.js")).href);
const failures = [];
for (const component of authoring.default.components.filter((component) => component.kind === "root")) {
    try {
        const html = renderToStaticMarkup(authoring.renderAuthoringNode(component.presets[0].root, exports));
        if (html.includes("undefined")) failures.push(`${component.exportName}: rendered undefined`);
    } catch (error) {
        failures.push(`${component.exportName}: ${error instanceof Error ? error.message : String(error)}`);
    }
}
if (failures.length) throw new Error(`Authoring preset render failures:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
console.log(`Rendered ${authoring.default.components.filter((component) => component.kind === "root").length} authoring root presets without errors.`);
