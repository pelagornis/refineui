/**
 * Web Kit component dimensions — **aliases only**.
 * Every px value comes from Foundation (`foundationSizes`).
 * Do not add raw `"Npx"` here; extend Foundation first.
 */
import { foundationSizes, type FoundationSizeName } from "../global/foundationSizes";

const F = foundationSizes;

/**
 * Maps each component size key → Foundation size key for CSS
 * `--refineui-size-*` → `var(--refineui-size-foundation-size-*)`.
 */
export const componentSizeFoundationKeys = {
    avatarStatusXxxlarge: "foundationSize140",
    buttonMinHeightSm: "foundationSize280",
    buttonMinHeightMd: "foundationSize360",
    buttonMinHeightLg: "foundationSize480",
    chipMinHeightSm: "foundationSize200",
    chipMinHeightMd: "foundationSize240",
    chipMinHeightLg: "foundationSize320",
    controlHeightSm: "foundationSize360",
    controlHeightMd: "foundationSize440",
    controlHeightLg: "foundationSize520",
    controlTouchMin: "foundationSize440",
    controlCheckbox: "foundationSize200",
    controlCheckboxRadio: "foundationSize200",
    controlTextareaMin: "foundationSize800",
    popoverPanelWidth: "foundationSize3250",
    popoverBeakInsetFromStartEdge: "foundationSize340",
    popoverBeakInsetFromEndEdge: "foundationSize300",
    menuPanelWidth: "foundationSize2440",
    dropdownMenuWidth: "foundationSize2440",
    sidebarWidth: "foundationSize2560",
    toastMinWidth: "foundationSize3250",
    toastMaxWidth: "foundationSize3250",
    dialogMaxWidth: "foundationSize6000",
    dialogWidthSm: "foundationSize3000",
    drawerWidthSm: "foundationSize3200",
    drawerWidthMd: "foundationSize5750",
    drawerWidthLg: "foundationSize8500",
    calendarMinWidth: "foundationSize2560",
    calendarDaySize: "foundationSize320",
    tooltipMaxWidth: "foundationSize2000",
    spinStepperWidth: "foundationSize320",
    spinFieldPaddingInlineStart: "foundationSize120",
    switchWidth: "foundationSize440",
    switchHeight: "foundationSize240",
    switchThumb: "foundationSize200",
    switchPadding: "foundationSize20",
    progressTrackHeightSm: "foundationSize20",
    progressTrackHeightLg: "foundationSize40",
    sliderTrackHeightSm: "foundationSize20",
    sliderTrackHeightMd: "foundationSize40",
    sliderInteractionHeight: "foundationSize280",
    paginationButtonMinWidth: "foundationSize400",
    skeletonDefaultHeight: "foundationSize200",
    dividerShortEnd: "foundationSize80",
    dividerIconSlot: "foundationSize200",
    dividerIconCircleDiameter: "foundationSize133",
    dividerIconCircleInset: "foundationSize30",
    accessibleClip: "foundationSize10",
    spinnerSizeXSmall: "foundationSize160",
    spinnerSizeSmall: "foundationSize200",
    spinnerSizeMedium: "foundationSize240",
    spinnerSizeLarge: "foundationSize280",
    spinnerSizeXLarge: "foundationSize320",
    spinnerSizeXXLarge: "foundationSize480",
    spinnerRingWidthXSmall: "foundationSize20",
    spinnerRingWidthSmall: "foundationSize20",
    spinnerRingWidthMedium: "foundationSize20",
    spinnerRingWidthLarge: "foundationSize30",
    spinnerRingWidthXLarge: "foundationSize30",
    spinnerRingWidthXXLarge: "foundationSize40",
} as const satisfies Record<string, FoundationSizeName>;

export type ComponentSizeName = keyof typeof componentSizeFoundationKeys;

function fromFoundation<K extends ComponentSizeName>(
    key: K,
): (typeof F)[(typeof componentSizeFoundationKeys)[K]] {
    return F[componentSizeFoundationKeys[key]];
}

/**
 * Resolved px strings for JS layout math (`parseFloat`, inline styles).
 * Source of truth is Foundation via `componentSizeFoundationKeys`.
 */
export const componentSizes = {
    avatarStatusXxxlarge: fromFoundation("avatarStatusXxxlarge"),
    buttonMinHeightSm: fromFoundation("buttonMinHeightSm"),
    buttonMinHeightMd: fromFoundation("buttonMinHeightMd"),
    buttonMinHeightLg: fromFoundation("buttonMinHeightLg"),
    chipMinHeightSm: fromFoundation("chipMinHeightSm"),
    chipMinHeightMd: fromFoundation("chipMinHeightMd"),
    chipMinHeightLg: fromFoundation("chipMinHeightLg"),
    controlHeightSm: fromFoundation("controlHeightSm"),
    controlHeightMd: fromFoundation("controlHeightMd"),
    controlHeightLg: fromFoundation("controlHeightLg"),
    controlTouchMin: fromFoundation("controlTouchMin"),
    controlCheckbox: fromFoundation("controlCheckbox"),
    controlCheckboxRadio: fromFoundation("controlCheckboxRadio"),
    controlTextareaMin: fromFoundation("controlTextareaMin"),
    popoverPanelWidth: fromFoundation("popoverPanelWidth"),
    popoverBeakInsetFromStartEdge: fromFoundation("popoverBeakInsetFromStartEdge"),
    popoverBeakInsetFromEndEdge: fromFoundation("popoverBeakInsetFromEndEdge"),
    menuPanelWidth: fromFoundation("menuPanelWidth"),
    /** @deprecated Same as `menuPanelWidth` */
    dropdownMenuWidth: fromFoundation("dropdownMenuWidth"),
    sidebarWidth: fromFoundation("sidebarWidth"),
    toastMinWidth: fromFoundation("toastMinWidth"),
    toastMaxWidth: fromFoundation("toastMaxWidth"),
    dialogMaxWidth: fromFoundation("dialogMaxWidth"),
    /** Viewport-relative — not a Foundation px step */
    dialogMaxHeightViewport: "90vh",
    dialogWidthSm: fromFoundation("dialogWidthSm"),
    drawerWidthSm: fromFoundation("drawerWidthSm"),
    drawerWidthMd: fromFoundation("drawerWidthMd"),
    drawerWidthLg: fromFoundation("drawerWidthLg"),
    calendarMinWidth: fromFoundation("calendarMinWidth"),
    calendarDaySize: fromFoundation("calendarDaySize"),
    tooltipMaxWidth: fromFoundation("tooltipMaxWidth"),
    spinStepperWidth: fromFoundation("spinStepperWidth"),
    spinFieldPaddingInlineStart: fromFoundation("spinFieldPaddingInlineStart"),
    switchWidth: fromFoundation("switchWidth"),
    switchHeight: fromFoundation("switchHeight"),
    switchThumb: fromFoundation("switchThumb"),
    switchPadding: fromFoundation("switchPadding"),
    progressTrackHeightSm: fromFoundation("progressTrackHeightSm"),
    progressTrackHeightLg: fromFoundation("progressTrackHeightLg"),
    sliderTrackHeightSm: fromFoundation("sliderTrackHeightSm"),
    sliderTrackHeightMd: fromFoundation("sliderTrackHeightMd"),
    sliderInteractionHeight: fromFoundation("sliderInteractionHeight"),
    paginationButtonMinWidth: fromFoundation("paginationButtonMinWidth"),
    skeletonDefaultHeight: fromFoundation("skeletonDefaultHeight"),
    dividerShortEnd: fromFoundation("dividerShortEnd"),
    dividerIconSlot: fromFoundation("dividerIconSlot"),
    dividerIconCircleDiameter: fromFoundation("dividerIconCircleDiameter"),
    dividerIconCircleInset: fromFoundation("dividerIconCircleInset"),
    accessibleClip: fromFoundation("accessibleClip"),
    spinnerSizeXSmall: fromFoundation("spinnerSizeXSmall"),
    spinnerSizeSmall: fromFoundation("spinnerSizeSmall"),
    spinnerSizeMedium: fromFoundation("spinnerSizeMedium"),
    spinnerSizeLarge: fromFoundation("spinnerSizeLarge"),
    spinnerSizeXLarge: fromFoundation("spinnerSizeXLarge"),
    spinnerSizeXXLarge: fromFoundation("spinnerSizeXXLarge"),
    spinnerRingWidthXSmall: fromFoundation("spinnerRingWidthXSmall"),
    spinnerRingWidthSmall: fromFoundation("spinnerRingWidthSmall"),
    spinnerRingWidthMedium: fromFoundation("spinnerRingWidthMedium"),
    spinnerRingWidthLarge: fromFoundation("spinnerRingWidthLarge"),
    spinnerRingWidthXLarge: fromFoundation("spinnerRingWidthXLarge"),
    spinnerRingWidthXXLarge: fromFoundation("spinnerRingWidthXXLarge"),
} as const;
