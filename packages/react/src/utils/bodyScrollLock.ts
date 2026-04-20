/** 루트 문서 스크롤 잠금 — 여러 오버레이가 겹칠 때 refCount로 안전하게 해제 */

let lockCount = 0;
let bodyOverflow = "";
let htmlOverflow = "";

function applyLock(): void {
    if (typeof document === "undefined") return;
    bodyOverflow = document.body.style.overflow;
    htmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
}

function releaseLock(): void {
    if (typeof document === "undefined") return;
    document.body.style.overflow = bodyOverflow;
    document.documentElement.style.overflow = htmlOverflow;
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
