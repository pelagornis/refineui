import {
    cloneElement,
    forwardRef,
    isValidElement,
    type HTMLAttributes,
    type ReactElement,
    type Ref,
} from "react";
import { composeRefs } from "./composeRefs";

export interface SlotProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
    children?: any;
}

function mergeProps(slotProps: Record<string, any>, childProps: Record<string, any>) {
    const merged: Record<string, any> = { ...slotProps };
    for (const key of Object.keys(childProps)) {
        if (key === "ref" || key === "children") continue;
        const slotValue = slotProps[key];
        const childValue = childProps[key];
        const isEvent = key.startsWith("on") && typeof slotValue === "function" && typeof childValue === "function";
        if (key === "className" || key === "aria-describedby") {
            merged[key] = [slotValue, childValue].filter(Boolean).join(" ");
        } else if (key === "style") {
            merged.style = { ...(slotValue ?? {}), ...(childValue ?? {}) };
        } else if (isEvent) {
            merged[key] = (event: { defaultPrevented?: boolean }) => {
                childValue(event);
                if (!event?.defaultPrevented) slotValue(event);
            };
        } else {
            merged[key] = childValue;
        }
    }
    return merged;
}

/** Merges its props onto the single child. Used for `asChild`. */
export const Slot = forwardRef<HTMLElement | null, SlotProps>(function Slot({ children, ...slotProps }, forwardedRef) {
    if (!isValidElement(children)) {
        return <>{children}</>;
    }

    const child = children as ReactElement<Record<string, any> & { ref?: Ref<HTMLElement | null> }>;
    const childProps = { ...(child.props ?? {}) };
    const childRef = (child as { ref?: Ref<HTMLElement | null> }).ref ?? childProps.ref;
    delete childProps.ref;
    delete childProps.children;

    const merged = mergeProps(slotProps as Record<string, any>, childProps);
    merged.ref = composeRefs(forwardedRef, childRef);
    return cloneElement(child, merged);
});
