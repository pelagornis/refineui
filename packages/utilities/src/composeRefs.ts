/**
 * Same ref-merging pattern as `@radix-ui/react-compose-refs`
 * @see https://github.com/radix-ui/primitives/tree/main/packages/react/compose-refs
 */
import * as React from "react";
import type { MutableRefObject, Ref } from "react";

function setRef<T>(ref: Ref<T> | undefined, value: T | null): void {
    if (typeof ref === "function") {
        ref(value);
    } else if (ref != null) {
        (ref as MutableRefObject<T | null>).current = value;
    }
}

export function composeRefs<T>(...refs: (Ref<T> | undefined)[]) {
    return (instance: T | null) => refs.forEach((ref) => setRef(ref, instance));
}

/** Radix `useComposedRefs` — stable ref callback when merging cloneElement + forwardRef */
export function useComposedRefs<T>(...refs: (Ref<T> | undefined)[]) {
    return React.useCallback(composeRefs(...refs), refs);
}

/** @deprecated Prefer `composeRefs` */
export const composeRef = composeRefs;
