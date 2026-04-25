/**
 * Figma Foundation **`Global/Size/{n}`** — 스텝 이름의 숫자는 **×0.1 → px**(예: `320` → 32px).
 * `generate-refineui-css.mjs`가 `foundationSizes` + `componentSizes`로 `--refineui-size-*`·`@theme`·Avatar `size-refineui-foundation-size-*`에 쓴다.
 */
export const foundationSizes = {
    foundationSize40: "4px",
    foundationSize60: "6px",
    foundationSize80: "8px",
    foundationSize100: "10px",
    foundationSize120: "12px",
    foundationSize160: "16px",
    foundationSize200: "20px",
    foundationSize240: "24px",
    foundationSize280: "28px",
    foundationSize320: "32px",
    foundationSize360: "36px",
    foundationSize480: "48px",
    foundationSize540: "54px",
    foundationSize600: "60px",
} as const;

/**
 * Web Kit 컴포넌트별 치수 (Figma 노드 주석).
 * Foundation과 달리 Web Kit **컴포넌트 전용** 치수.
 */
export const componentSizes = {
    /** Web Kit `Avatar/Status` — XXXLarge 티어 지름 14px (Foundation에 `Global/Size/140` 없음, MCP 기준) */
    avatarStatusXxxlarge: "14px",
    /** Web Kit Button `79:3304` — Label 행 `minHeight` (Small / Medium / Large) */
    buttonMinHeightSm: "28px",
    buttonMinHeightMd: "36px",
    buttonMinHeightLg: "48px",
    controlHeightSm: "32px",
    controlHeightMd: "40px",
    controlHeightLg: "48px",
    controlTouchMin: "44px",
    /** Web Kit Checkbox `327:2539` — 박스 16×16 */
    controlCheckbox: "16px",
    /** Web Kit Radio `397:1001` — 원형 컨트롤 16×16 */
    controlCheckboxRadio: "16px",
    controlTextareaMin: "80px",
    /** Web Kit PopOver `553:5669` — Default 패널 최소 폭 */
    popoverPanelWidth: "325px",
    /**
     * Web Kit PopOver `553:5669` — Beak 가로 패널 가장자리까지 inset (325px 패널·Bottom/Top 변형 MCP 기준).
     * Top/Bottom 에서 Start / End 비크 위치에 사용 (Center 는 50% − 비크 반폭).
     */
    popoverBeakInsetFromStartEdge: "34px",
    popoverBeakInsetFromEndEdge: "30px",
    /** Web Kit Menu `633:4268` — Default 패널 최소 폭 */
    menuPanelWidth: "244px",
    /** Web Kit Dropdown `503:2985` — `Dropdown / Menu` 폭 */
    dropdownMenuWidth: "180px",
    /** Web Kit Toast `548:654` (`548:655` COMPONENT_SET) — 카드 폭 325px */
    toastMinWidth: "325px",
    toastMaxWidth: "325px",
    /** Web Kit Dialog `393:1181` — Large 패널 기준 폭 */
    dialogMaxWidth: "600px",
    /** Dialog 패널 세로 한도 — 뷰포트 대비 */
    dialogMaxHeightViewport: "90vh",
    /** Web Kit Dialog `393:1181` — Small (`size=Small`) */
    dialogWidthSm: "300px",
    /** Web Kit Drawer `635:1756` — Overlay 폭 (Small / Medium / Large) */
    drawerWidthSm: "320px",
    drawerWidthMd: "575px",
    drawerWidthLg: "850px",
    calendarMinWidth: "256px",
    /** Web Kit Calendar `656:2958` — Day 셀 32×32 */
    calendarDaySize: "32px",
    tooltipMaxWidth: "200px",
    /** Web Kit Spin Button `561:2067` — Stepper 열 폭 */
    spinStepperWidth: "32px",
    /** Web Kit Spin Button `561:2067` — Stepper 반칸 높이 (Small 행) */
    spinStepperStepHeightSm: "16px",
    /** Web Kit Spin Button `561:2067` — Stepper 반칸 높이 (Medium 행) */
    spinStepperStepHeightMd: "20px",
    /** Web Kit Spin Button `561:2067` — Stepper 반칸 높이 (Large 행) */
    spinStepperStepHeightLg: "24px",
    /** Web Kit Spin Button `561:2067` — 값 영역 좌측 패딩 */
    spinFieldPaddingInlineStart: "12px",
    /** Web Kit Switch `270:3057` — 트랙(패딩 제외 영역 40×20) */
    switchWidth: "44px",
    switchHeight: "24px",
    switchThumb: "20px",
    switchPadding: "2px",
    /** Web Kit `Progress bar` `452:3994` — Small */
    progressTrackHeightSm: "2px",
    /** Web Kit `Progress bar` `452:3994` — Large */
    progressTrackHeightLg: "4px",
    /** Web Kit Slider `526:1556` — Small 레일 */
    sliderTrackHeightSm: "2px",
    /** Web Kit Slider `526:1556` — Medium 레일 */
    sliderTrackHeightMd: "4px",
    /** Web Kit Slider `526:1556` — 썸·드래그 터치 영역 높이 */
    sliderInteractionHeight: "24px",
    /** Web Kit `Pagination` `558:1989` · `Pagination / Item` `570:2332` — 항목 최소 36×36 */
    paginationButtonMinWidth: "36px",
    skeletonDefaultHeight: "20px",
    /** Web Kit Divider `346:722` — Content/Icon 분할 시 짧은 선 끝 */
    dividerShortEnd: "8px",
    /** Web Kit Divider `346:722` — Icon 변형 Circle 슬롯 */
    dividerIconSlot: "20px",
    /** Web Kit Divider `346:722` — Circle 내부 Shape (Figma `left`/`top` 3px, `size` 13.33px) */
    dividerIconCircleDiameter: "13.33px",
    dividerIconCircleInset: "3px",
    accessibleClip: "1px",
    /** Web Kit Spinner `550:3669` — `Spinner / Item` 변형별 지름 */
    spinnerSizeXSmall: "16px",
    spinnerSizeSmall: "20px",
    spinnerSizeMedium: "24px",
    spinnerSizeLarge: "28px",
    spinnerSizeXLarge: "32px",
    spinnerSizeXXLarge: "48px",
    /** Web Kit Spinner `550:3669` — 링 두께(크기별) */
    spinnerRingWidthXSmall: "2px",
    spinnerRingWidthSmall: "2px",
    spinnerRingWidthMedium: "2px",
    spinnerRingWidthLarge: "3px",
    spinnerRingWidthXLarge: "3px",
    spinnerRingWidthXXLarge: "4px",
} as const;
