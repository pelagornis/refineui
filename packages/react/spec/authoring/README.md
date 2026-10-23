# RefineUI authoring manifest

This is the editor-neutral authoring contract for `@refineui/react`. It is
additive: the existing React API, CSS entrypoint, and behavior specs remain the
source of runtime behavior.

```ts
import manifest, { renderAuthoringNode } from "@refineui/react/authoring-manifest";
import * as RefineUI from "@refineui/react";

const carousel = manifest.components.find((component) => component.exportName === "Carousel")!;
const element = renderAuthoringNode(carousel.presets![0].root, RefineUI);
```

Tools that prefer data-only loading may import
`@refineui/react/authoring-manifest.json`. Persist authoring nodes using the
`component`, `props`, `slots`, and optional `text` fields. `text` represents a
structural text child; it is intentionally not a React `children` prop.

Slots normally become React children. A slot with `target: "prop"` and `prop`
instead supplies a ReactNode-valued component property. For example, a Toast
stores its message as a `Text` node in its `message` slot and an optional
`WebIcon` node in its `icon` slot. This keeps content and icons structural and
serializable rather than placing React nodes in `props`.

For a portal contract with `containerComponent` and `containerProp`, pass the
editor's themed overlay element as the optional third argument to
`renderAuthoringNode`. The runtime injects that DOM reference only while
rendering; the persisted authoring tree remains JSON-only.

The manifest is generated with `bun run generate:authoring` and checked with
`bun run validate:authoring`. Consumers should use `kind: "root"` for their
insert palette, and use each part's explicit `parents` and slot constraints for
child menus. Event callbacks, refs, React nodes, and portal DOM targets are not
serializable props: they are represented by `events`, `stateBindings`,
`iconSlots`, and `portal` contracts.
