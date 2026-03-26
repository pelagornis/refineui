import type { MutableRefObject, Ref } from "react";

/** cloneElement 시 부모 ref와 자식 ref 병합 */
export function composeRef<T>(...refs: (Ref<T> | undefined)[]) {
    return (instance: T | null) => {
        for (const ref of refs) {
            if (ref == null) continue;
            if (typeof ref === "function") ref(instance);
            else (ref as MutableRefObject<T | null>).current = instance;
        }
    };
}
