/**
 * Root document scroll lock with ref-counting for nested overlays.
 *
 * Radix often uses `react-remove-scroll` with portals/focus scope.
 * RefineUI locks only document `overflow`/`position` without extra dependencies.
 */

let lockCount = 0;
let bodyOverflow = "";
let htmlOverflow = "";
let bodyPosition = "";
let bodyTop = "";
let bodyWidth = "";
let lockedScrollY = 0;

function applyLock(): void {
    if (typeof document === "undefined") return;
    lockedScrollY = window.scrollY;
    bodyOverflow = document.body.style.overflow;
    htmlOverflow = document.documentElement.style.overflow;
    bodyPosition = document.body.style.position;
    bodyTop = document.body.style.top;
    bodyWidth = document.body.style.width;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    // Prevent viewport scrolling even when page layout doesn't rely on body overflow.
    document.body.style.position = "fixed";
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.width = "100%";
}

function releaseLock(): void {
    if (typeof document === "undefined") return;
    document.body.style.overflow = bodyOverflow;
    document.documentElement.style.overflow = htmlOverflow;
    document.body.style.position = bodyPosition;
    document.body.style.top = bodyTop;
    document.body.style.width = bodyWidth;
    window.scrollTo(0, lockedScrollY);
}

/**
 * Block background (document) scroll while menus/modals are open.
 * @returns Release function — call on unmount/close
 */
export function acquireBodyScrollLock(): () => void {
    if (typeof document === "undefined") return () => {};
    lockCount += 1;
    if (lockCount === 1) applyLock();
    return () => {
        lockCount -= 1;
        if (lockCount <= 0) {
            lockCount = 0;
            releaseLock();
        }
    };
}
