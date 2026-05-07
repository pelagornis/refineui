/**
 * 루트 문서 스크롤 잠금 — 여러 오버레이가 겹칠 때 refCount로 안전하게 해제.
 *
 * Radix Primitives는 보통 `react-remove-scroll` 등으로 포털·포커스 스코프와 함께 처리합니다.
 * RefineUI는 외부 패키지 추가 없이 동일한 ref-count 패턴으로 문서 `overflow`/`position`만 잠급니다.
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
 * 메뉴·모달 등이 열렸을 때 배경(문서) 스크롤을 막습니다.
 * @returns 해제 함수 — 반드시 언마운트/닫힐 때 호출
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
