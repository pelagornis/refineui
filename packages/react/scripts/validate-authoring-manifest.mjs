import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const manifest = readJson(join(root, "spec/authoring/manifest.json"));
const pkg = readJson(join(root, "package.json"));
const behavior = readJson(join(root, "spec/manifest.json"));
const errors = [];
const byExport = new Map(manifest.components.map((component) => [component.exportName, component]));
const ids = new Set();
const byName = new Map(manifest.components.map((component) => [component.exportName, component]));

if (manifest.schema !== "refineui.authoring/1") errors.push("unsupported authoring schema");
if (manifest.packageVersion !== pkg.version) errors.push("package and manifest versions differ");
for (const component of manifest.components) {
    if (ids.has(component.id)) errors.push(`duplicate component id: ${component.id}`);
    ids.add(component.id);
    if (!["root", "part", "provider", "portal"].includes(component.kind)) errors.push(`${component.exportName}: invalid kind`);
    if (!Array.isArray(component.props)) errors.push(`${component.exportName}: props missing`);
    for (const prop of component.props) {
        if (/^(children|on[A-Z]|ref|container)$/u.test(prop.name)) errors.push(`${component.exportName}: non-serializable prop ${prop.name}`);
    }
    if (component.kind === "part" && (!component.parents || component.parents.length === 0)) errors.push(`${component.exportName}: part has no explicit parent`);
    if (component.kind === "root" && (!component.presets || component.presets.length === 0)) errors.push(`${component.exportName}: root has no preset`);
    if (component.portal?.strategy === "themed-overlay-root") {
        if (!component.portal.inheritsTheme) errors.push(`${component.exportName}: themed portal must inherit theme`);
        if (!component.portal.containerComponent || !component.portal.containerProp) {
            errors.push(`${component.exportName}: themed portal needs a runtime container contract`);
        } else if (!byExport.has(component.portal.containerComponent)) {
            errors.push(`${component.exportName}: portal container component does not exist: ${component.portal.containerComponent}`);
        }
    }
    for (const slot of component.slots ?? []) {
        if (slot.target === "prop" && !slot.prop) errors.push(`${component.exportName}.${slot.name}: prop slot is missing prop name`);
        if (slot.target !== undefined && !["children", "prop"].includes(slot.target)) errors.push(`${component.exportName}.${slot.name}: invalid slot target`);
        if (slot.recursive && !slot.accepts.includes(component.exportName) && component.exportName !== "TreeItemContent") errors.push(`${component.exportName}: recursive slot is not explicit`);
        for (const accepted of slot.accepts) if (!byExport.has(accepted)) errors.push(`${component.exportName}: slot references missing export ${accepted}`);
    }
}
for (const component of manifest.components.filter((component) => component.kind === "part" || component.kind === "provider")) {
    for (const constraint of component.parents ?? []) {
        const parent = byName.get(constraint.component);
        if (!parent) {
            errors.push(`${component.exportName}: parent does not exist: ${constraint.component}`);
            continue;
        }
        const parentSlot = parent.slots?.find((slot) => slot.name === constraint.slot);
        if (!parentSlot || (!parentSlot.allowAnyComponent && !parentSlot.accepts.includes(component.exportName))) {
            errors.push(`${component.exportName}: ${constraint.component}.${constraint.slot} does not accept it`);
        }
    }
}
function validatePresetNode(node, parentComponent, parentSlot, path) {
    const component = byName.get(node.component);
    if (!component) {
        errors.push(`${path}: references missing component ${node.component}`);
        return;
    }
    if (parentComponent) {
        const slot = parentComponent.slots?.find((candidate) => candidate.name === parentSlot);
        if (!slot || (!slot.allowAnyComponent && !slot.accepts.includes(node.component))) {
            errors.push(`${path}: ${parentComponent.exportName}.${parentSlot} cannot contain ${node.component}`);
        }
    }
    for (const prop of component.props.filter((prop) => prop.required)) {
        if (node.props?.[prop.name] === undefined && prop.defaultValue === undefined) {
            errors.push(`${path}: missing required prop ${prop.name}`);
        }
    }
    for (const [slotName, children] of Object.entries(node.slots ?? {})) {
        const slot = component.slots?.find((candidate) => candidate.name === slotName);
        if (!slot) errors.push(`${path}: unknown slot ${slotName}`);
        if (slot?.max !== undefined && children.length > slot.max) errors.push(`${path}.${slotName}: exceeds maximum child count`);
        if (slot?.min !== undefined && children.length < slot.min) errors.push(`${path}.${slotName}: below minimum child count`);
        for (const [index, child] of children.entries()) validatePresetNode(child, component, slotName, `${path}.${slotName}[${index}]`);
    }
}
for (const component of manifest.components.filter((component) => component.kind === "root")) {
    for (const preset of component.presets ?? []) validatePresetNode(preset.root, null, null, `${component.exportName}.${preset.id}`);
}
// A part must be reachable from an insertable root through its declared parents.
const reachable = new Set(manifest.components.filter((component) => component.kind === "root").map((component) => component.exportName));
let changed = true;
while (changed) {
    changed = false;
    for (const component of manifest.components) {
        if (reachable.has(component.exportName)) continue;
        if ((component.parents ?? []).some((constraint) => reachable.has(constraint.component))) {
            reachable.add(component.exportName);
            changed = true;
        }
    }
}
for (const component of manifest.components.filter((component) => component.kind === "part" || component.kind === "provider")) {
    if (!reachable.has(component.exportName)) errors.push(`${component.exportName}: not reachable from a root`);
}
for (const rootComponent of behavior.components) {
    const publicExport = rootComponent.export === "Resizable" ? "ResizablePanelGroup" : rootComponent.export;
    const component = byExport.get(publicExport);
    if (!component || component.kind !== "root") errors.push(`behavior root is absent from authoring metadata: ${rootComponent.export}`);
    if (component) {
        const componentSpec = readJson(join(root, "spec", rootComponent.spec.replace(/^\.\//, "")));
        for (const [variant, options] of Object.entries(componentSpec.variants ?? {})) {
            const prop = component.props.find((candidate) => candidate.name === variant);
            if (!prop || JSON.stringify(prop.options) !== JSON.stringify(options)) {
                errors.push(`${rootComponent.export}: authoring ${variant} options differ from behavior spec`);
            }
        }
    }
}
if (errors.length) {
    console.error("Invalid authoring manifest:\n" + errors.map((error) => `- ${error}`).join("\n"));
    process.exit(1);
}
console.log(`Validated authoring manifest (${manifest.components.length} exports, ${manifest.components.filter((component) => component.kind === "root").length} roots)`);
