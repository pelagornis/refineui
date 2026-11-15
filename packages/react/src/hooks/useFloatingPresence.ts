import { useEffect, useRef, useState, type RefObject } from "react";

/** Upper bound for the exit transition, in case `transitionend` never fires (reduced motion, 0ms duration). */
const EXIT_FALLBACK_MS = 300;

/**
 * Keeps a floating panel mounted while it animates out.
 * `mounted` controls rendering; `entered` drives the open/closed styles.
 * On open: mount, then flip `entered` on the next frame so the enter transition runs.
 * On close: flip `entered` off, then unmount once the wrapper's transition ends.
 */
export function useFloatingPresence(open: boolean, motionRef: RefObject<HTMLElement | null>) {
    const [mounted, setMounted] = useState(open);
    const [entered, setEntered] = useState(false);
    const openRef = useRef(open);
    openRef.current = open;

    useEffect(() => {
        if (open) {
            setMounted(true);
            // Two frames so the closed styles are painted before the enter transition starts.
            let frame = requestAnimationFrame(() => {
                frame = requestAnimationFrame(() => setEntered(true));
            });
            return () => cancelAnimationFrame(frame);
        }

        setEntered(false);
        const el = motionRef.current;
        let done = false;
        const finish = () => {
            if (done || openRef.current) return;
            done = true;
            setMounted(false);
        };
        const onEnd = (event: TransitionEvent) => {
            if (event.target === el && event.propertyName === "opacity") finish();
        };
        el?.addEventListener("transitionend", onEnd);
        const timer = setTimeout(finish, EXIT_FALLBACK_MS);
        return () => {
            el?.removeEventListener("transitionend", onEnd);
            clearTimeout(timer);
        };
    }, [open, motionRef]);

    return { mounted, entered };
}
