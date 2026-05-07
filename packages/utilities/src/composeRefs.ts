/**
 * `@radix-ui/react-compose-refs`와 동일한 ref 병합 패턴
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

/** Radix `useComposedRefs` — cloneElement·forwardRef 조합 시 안정적인 ref 콜백 */
export function useComposedRefs<T>(...refs: (Ref<T> | undefined)[]) {
    return React.useCallback(composeRefs(...refs), refs);
}

/** 하위 호환 별칭 — `composeRefs` 사용 권장 */
export const composeRef = composeRefs;
