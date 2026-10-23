import { createElement, type ReactElement, type ReactNode } from "react";
import manifestJson from "../../spec/authoring/manifest.json";
import type { AuthoringManifest, AuthoringNode, AuthoringRenderOptions } from "./types";

/** The stable, editor-neutral metadata contract for @refineui/react. */
const manifest = manifestJson as AuthoringManifest;

/**
 * Consumer fixture: turns a preset tree into real React elements.  Editors can
 * replace this tiny resolver with their own canvas runtime without changing the
 * persisted document format.
 */
export function renderAuthoringNode(
    node: AuthoringNode,
    exports: Record<string, React.ElementType>,
    options: AuthoringRenderOptions = {},
): ReactElement {
    const byExport = new Map(manifest.components.map((component) => [component.exportName, component]));
    const portalProps = new Map<string, string>();
    for (const component of manifest.components) {
        if (component.portal?.containerComponent && component.portal.containerProp) {
            portalProps.set(component.portal.containerComponent, component.portal.containerProp);
        }
    }
    return renderNode(node, exports, byExport, portalProps, options.portalContainer);
}

function renderNode(
    node: AuthoringNode,
    exports: Record<string, React.ElementType>,
    byExport: Map<string, AuthoringManifest["components"][number]>,
    portalProps: Map<string, string>,
    portalContainer: Element | DocumentFragment | null | undefined,
): ReactElement {
    const Component = exports[node.component];
    if (!Component) throw new Error(`Unknown RefineUI authoring component: ${node.component}`);
    const definition = byExport.get(node.component);
    if (!definition) throw new Error(`Missing authoring metadata for: ${node.component}`);
    const props: Record<string, unknown> = { ...(node.props ?? {}) };
    const portalProp = portalProps.get(node.component);
    if (portalContainer && portalProp && props[portalProp] === undefined) props[portalProp] = portalContainer;
    const children: ReactNode[] = [];
    if (node.text !== undefined) children.push(node.text);
    for (const [slotName, nodes] of Object.entries(node.slots ?? {})) {
        const slot = definition.slots?.find((candidate) => candidate.name === slotName);
        if (!slot) throw new Error(`Unknown authoring slot ${node.component}.${slotName}`);
        const rendered = nodes.map((child) => renderNode(child, exports, byExport, portalProps, portalContainer));
        if (slot.target === "prop") {
            if (!slot.prop) throw new Error(`Prop slot ${node.component}.${slotName} has no prop name`);
            props[slot.prop] = slot.repeatable ? rendered : rendered[0] ?? null;
        } else {
            children.push(...rendered);
        }
    }
    return createElement(Component, props, ...children);
}

export * from "./types";
export default manifest;
