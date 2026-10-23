/** A value that an editor can safely persist in a document. */
export type SerializableValue =
    | null
    | string
    | number
    | boolean
    | SerializableValue[]
    | { [key: string]: SerializableValue };

export type AuthoringProp = {
    name: string;
    label: string;
    valueType: "string" | "number" | "boolean" | "enum" | "url" | "icon" | "string-array" | "number-array" | "object" | "json";
    control: "text" | "textarea" | "number" | "toggle" | "select" | "segmented" | "url" | "icon-picker" | "collection" | "json";
    defaultValue?: SerializableValue;
    options?: SerializableValue[];
    required?: boolean;
    bindable?: boolean;
    section?: "properties" | "variants" | "state" | "accessibility";
};

export type AuthoringNode = {
    component: string;
    props?: Record<string, SerializableValue>;
    slots?: Record<string, AuthoringNode[]>;
    /** Text is structural child content, never a serialized React children prop. */
    text?: string;
};

export type AuthoringSlot = {
    name: string;
    /** Where the rendered slot value is supplied to the React export. */
    target?: "children" | "prop";
    /** Required when target is prop; names the ReactNode prop to receive it. */
    prop?: string;
    accepts: string[];
    required?: boolean;
    repeatable?: boolean;
    min?: number;
    max?: number;
    order?: number;
    allowAnyComponent?: boolean;
    allowText?: boolean;
    recursive?: boolean;
    defaultChildren?: AuthoringNode[];
};

export type ParentConstraint = { component: string; slot: string };
export type StateBinding = { name: string; valueProp: string; defaultValueProp?: string; changeEvent: string; valueType: AuthoringProp["valueType"] };
export type AuthoringEvent = { name: string; payload: "void" | "boolean" | "number" | "string" | "string-array" | "object"; description?: string };
export type IconSlot = { name: string; optional: boolean; accepts: ["refineui-icon", "svg", "image"] };
export type PortalContract = {
    strategy: "screen-root" | "themed-overlay-root" | "document-body";
    inheritsTheme: boolean;
    /** Component and prop that accept an editor-owned portal container at render time. */
    containerComponent?: string;
    containerProp?: string;
};

export type AuthoringRenderOptions = {
    /**
     * An editor-owned themed overlay element. It is injected only at render
     * time, so no DOM reference is persisted in an AuthoringNode.
     */
    portalContainer?: Element | DocumentFragment | null;
};

export type AuthoringComponent = {
    id: string;
    exportPath: string;
    exportName: string;
    kind: "root" | "part" | "provider" | "portal";
    category: string;
    label: string;
    description?: string;
    props: AuthoringProp[];
    slots?: AuthoringSlot[];
    parents?: ParentConstraint[];
    presets?: { id: string; label: string; description?: string; root: AuthoringNode }[];
    stateBindings?: StateBinding[];
    events?: AuthoringEvent[];
    iconSlots?: IconSlot[];
    portal?: PortalContract;
    preview: { mode: "full" | "limited"; unsupported?: string[] };
};

export type AuthoringManifest = {
    schema: "refineui.authoring/1";
    packageName: "@refineui/react";
    packageVersion: string;
    css: string[];
    components: AuthoringComponent[];
};
