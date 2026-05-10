import { Children, Fragment, isValidElement, type ReactElement, type ReactNode } from "react";

/**
 * Resolve a single mergeable child so events/refs attach to one element.
 * (Unwraps one Fragment layer; otherwise returns `null` — caller supplies a default button/span wrapper.)
 */
export function getMergeableTriggerChild(children: ReactNode): ReactElement | null {
    let node: ReactNode;
    try {
        node = Children.only(children);
    } catch {
        return null;
    }
    if (!isValidElement(node)) return null;
    if (node.type === Fragment) {
        const inner = Children.toArray((node.props as { children?: ReactNode }).children);
        if (inner.length !== 1 || !isValidElement(inner[0])) return null;
        return inner[0] as ReactElement;
    }
    return node as ReactElement;
}
