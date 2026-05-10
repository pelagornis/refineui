import { Ref, ReactNode, ReactElement } from 'react';

/**
 * Root document scroll lock with ref-counting for nested overlays.
 *
 * Radix often uses `react-remove-scroll` with portals/focus scope.
 * RefineUI locks only document `overflow`/`position` without extra dependencies.
 */
/**
 * Block background (document) scroll while menus/modals are open.
 * @returns Release function — call on unmount/close
 */
declare function acquireBodyScrollLock(): () => void;

declare function composeRefs<T>(...refs: (Ref<T> | undefined)[]): (instance: T | null) => void;
/** Radix `useComposedRefs` — stable ref callback when merging cloneElement + forwardRef */
declare function useComposedRefs<T>(...refs: (Ref<T> | undefined)[]): (instance: T | null) => void;
/** @deprecated Prefer `composeRefs` */
declare const composeRef: typeof composeRefs;

/**
 * Resolve a single mergeable child so events/refs attach to one element.
 * (Unwraps one Fragment layer; otherwise returns `null` — caller supplies a default button/span wrapper.)
 */
declare function getMergeableTriggerChild(children: ReactNode): ReactElement | null;

export { acquireBodyScrollLock, composeRef, composeRefs, getMergeableTriggerChild, useComposedRefs };
