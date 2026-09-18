/**
 * Narrow entry for Collapsible and ContextMenu (and Slot re-export).
 * Used by canvas Vite aliases so the full @refineui/react graph is not typechecked.
 */
export { Slot, type SlotProps } from "./components/Slot";
export { Collapsible, type CollapsibleRootProps, type CollapsibleTriggerProps, type CollapsibleContentProps } from "./components/Collapsible";
export {
    ContextMenu,
    type ContextMenuRootProps,
    type ContextMenuTriggerProps,
    type ContextMenuContentProps,
    type ContextMenuItemProps,
    type ContextMenuSubTriggerProps,
    type ContextMenuSubContentProps,
} from "./components/ContextMenu";
