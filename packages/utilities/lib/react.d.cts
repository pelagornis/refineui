import { Ref, ReactNode, ReactElement } from 'react';

/**
 * 루트 문서 스크롤 잠금 — 여러 오버레이가 겹칠 때 refCount로 안전하게 해제.
 *
 * Radix Primitives는 보통 `react-remove-scroll` 등으로 포털·포커스 스코프와 함께 처리합니다.
 * RefineUI는 외부 패키지 추가 없이 동일한 ref-count 패턴으로 문서 `overflow`/`position`만 잠급니다.
 */
/**
 * 메뉴·모달 등이 열렸을 때 배경(문서) 스크롤을 막습니다.
 * @returns 해제 함수 — 반드시 언마운트/닫힐 때 호출
 */
declare function acquireBodyScrollLock(): () => void;

declare function composeRefs<T>(...refs: (Ref<T> | undefined)[]): (instance: T | null) => void;
/** Radix `useComposedRefs` — cloneElement·forwardRef 조합 시 안정적인 ref 콜백 */
declare function useComposedRefs<T>(...refs: (Ref<T> | undefined)[]): (instance: T | null) => void;
/** 하위 호환 별칭 — `composeRefs` 사용 권장 */
declare const composeRef: typeof composeRefs;

/**
 * 트리거에 이벤트·ref 등을 한 엘리먼트에만 합성하기 위한 단일 자식 확인.
 * (Fragment 한 겹만 풀며, 그 외 패턴은 `null` → 호출부에서 기본 래퍼 버튼/스팬 사용.)
 */
declare function getMergeableTriggerChild(children: ReactNode): ReactElement | null;

export { acquireBodyScrollLock, composeRef, composeRefs, getMergeableTriggerChild, useComposedRefs };
