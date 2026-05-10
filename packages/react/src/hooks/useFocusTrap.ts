import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusableIn(root: HTMLElement): HTMLElement[] {
    return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.getAttribute("aria-hidden") !== "true" && el.closest("[aria-hidden='true']") === null
    );
}

/** While open, keep focus inside the root; restore previous focus on close */
export function useFocusTrap(open: boolean, rootRef: RefObject<HTMLElement | null>) {
    const previousFocus = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!open) return undefined;

        const root = rootRef.current;
        previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

        let raf = 0;
        raf = requestAnimationFrame(() => {
            if (!root) return;
            const nodes = focusableIn(root);
            if (nodes.length > 0) {
                nodes[0]!.focus();
            } else {
                root.focus();
            }
        });

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Tab" || !root) return;
            const nodes = focusableIn(root);
            if (nodes.length === 0) return;
            const first = nodes[0];
            const last = nodes[nodes.length - 1];
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", onKeyDown, true);
        return () => {
            cancelAnimationFrame(raf);
            document.removeEventListener("keydown", onKeyDown, true);
            previousFocus.current?.focus({ preventScroll: true });
            previousFocus.current = null;
        };
    }, [open, rootRef]);
}
