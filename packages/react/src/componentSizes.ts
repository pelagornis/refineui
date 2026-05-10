/**
 * Figma Foundation **`Global/Size/{n}`** — step name digits are **×0.1 → px** (e.g. `320` → 32px).
 * `generate-refineui-css.mjs` consumes `foundationSizes` + `componentSizes` for `--refineui-size-*`, `@theme`, Avatar `size-refineui-foundation-size-*`.
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
 * Web Kit per-component sizes (Figma node notes).
 * Unlike Foundation, these are **component-only** sizes.
 */
export const componentSizes = {
    /** Web Kit `Avatar/Status` — XXXLarge tier diameter 14px (no Foundation `Global/Size/140`; MCP) */
    avatarStatusXxxlarge: "14px",
    /** Web Kit Button `79:3304` — Label row `minHeight` (Small / Medium / Large) */
    buttonMinHeightSm: "28px",
    buttonMinHeightMd: "36px",
    buttonMinHeightLg: "48px",
    controlHeightSm: "32px",
    controlHeightMd: "40px",
    controlHeightLg: "48px",
    controlTouchMin: "44px",
    /** Web Kit Checkbox `327:2539` — box 16×16 */
    controlCheckbox: "16px",
    /** Web Kit Radio `397:1001` — circular control 16×16 */
    controlCheckboxRadio: "16px",
    controlTextareaMin: "80px",
    /** Web Kit PopOver `553:5669` — Default panel min width */
    popoverPanelWidth: "325px",
    /**
     * Web Kit PopOver `553:5669` — beak inset from horizontal panel edge (325px panel; Bottom/Top MCP).
     * Used for Start/End beak on Top/Bottom (Center: 50% − half beak).
     */
    popoverBeakInsetFromStartEdge: "34px",
    popoverBeakInsetFromEndEdge: "30px",
    /** Web Kit Menu `633:4268` — Default panel min width */
    menuPanelWidth: "244px",
    /** Web Kit Dropdown `503:2985` — `Dropdown / Menu` width */
    dropdownMenuWidth: "180px",
    /** Web Kit Toast `548:654` (`548:655` COMPONENT_SET) — card width 325px */
    toastMinWidth: "325px",
    toastMaxWidth: "325px",
    /** Web Kit Dialog `393:1181` — Large panel reference width */
    dialogMaxWidth: "600px",
    /** Dialog panel max height vs viewport */
    dialogMaxHeightViewport: "90vh",
    /** Web Kit Dialog `393:1181` — Small (`size=Small`) */
    dialogWidthSm: "300px",
    /** Web Kit Drawer `635:1756` — Overlay width (Small / Medium / Large) */
    drawerWidthSm: "320px",
    drawerWidthMd: "575px",
    drawerWidthLg: "850px",
    calendarMinWidth: "256px",
    /** Web Kit Calendar `656:2958` — Day cell 32×32 */
    calendarDaySize: "32px",
    tooltipMaxWidth: "200px",
    /** Web Kit Spin Button `561:2067` — Stepper column width */
    spinStepperWidth: "32px",
    /** Web Kit Spin Button `561:2067` — Stepper half-row height (Small) */
    spinStepperStepHeightSm: "16px",
    /** Web Kit Spin Button `561:2067` — Stepper half-row height (Medium) */
    spinStepperStepHeightMd: "20px",
    /** Web Kit Spin Button `561:2067` — Stepper half-row height (Large) */
    spinStepperStepHeightLg: "24px",
    /** Web Kit Spin Button `561:2067` — value field padding-inline-start */
    spinFieldPaddingInlineStart: "12px",
    /** Web Kit Switch `270:3057` — track (40×20 excluding padding) */
    switchWidth: "44px",
    switchHeight: "24px",
    switchThumb: "20px",
    switchPadding: "2px",
    /** Web Kit `Progress bar` `452:3994` — Small */
    progressTrackHeightSm: "2px",
    /** Web Kit `Progress bar` `452:3994` — Large */
    progressTrackHeightLg: "4px",
    /** Web Kit Slider `526:1556` — Small rail */
    sliderTrackHeightSm: "2px",
    /** Web Kit Slider `526:1556` — Medium rail */
    sliderTrackHeightMd: "4px",
    /** Web Kit Slider `526:1556` — thumb/drag hit-area height */
    sliderInteractionHeight: "24px",
    /** Web Kit `Pagination` `558:1989` · `Pagination / Item` `570:2332` — item min 36×36 */
    paginationButtonMinWidth: "36px",
    skeletonDefaultHeight: "20px",
    /** Web Kit Divider `346:722` — short line end (Content/Icon split) */
    dividerShortEnd: "8px",
    /** Web Kit Divider `346:722` — Icon variant circle slot */
    dividerIconSlot: "20px",
    /** Web Kit Divider `346:722` — inner circle shape (Figma `left`/`top` 3px, `size` 13.33px) */
    dividerIconCircleDiameter: "13.33px",
    dividerIconCircleInset: "3px",
    accessibleClip: "1px",
    /** Web Kit Spinner `550:3669` — `Spinner / Item` diameter per variant */
    spinnerSizeXSmall: "16px",
    spinnerSizeSmall: "20px",
    spinnerSizeMedium: "24px",
    spinnerSizeLarge: "28px",
    spinnerSizeXLarge: "32px",
    spinnerSizeXXLarge: "48px",
    /** Web Kit Spinner `550:3669` — ring width per size */
    spinnerRingWidthXSmall: "2px",
    spinnerRingWidthSmall: "2px",
    spinnerRingWidthMedium: "2px",
    spinnerRingWidthLarge: "3px",
    spinnerRingWidthXLarge: "3px",
    spinnerRingWidthXXLarge: "4px",
} as const;
