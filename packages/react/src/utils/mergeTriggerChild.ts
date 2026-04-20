import { Children, Fragment, isValidElement, type ReactElement, type ReactNode } from "react";

/**
 * 트리거에 이벤트·ref 등을 한 엘리먼트에만 합성하기 위한 단일 자식 확인.
 * (Fragment 한 겹만 풀며, 그 외 패턴은 `null` → 호출부에서 기본 래퍼 버튼/스팬 사용.)
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
