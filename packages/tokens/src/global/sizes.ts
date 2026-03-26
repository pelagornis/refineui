import { fontSizes } from "./fonts";

const p = (value: string) => Number.parseInt(value, 10) || 0;

/**
 * 컴포넌트·레이아웃 치수 (Web Kit — docs/design-specs-web-kit.md).
 * style에는 문자열(px), WebIcon `size`에는 `iconSizes` 숫자 사용.
 */
export const sizes = {
    controlHeightSm: "32px",
    controlHeightMd: "40px",
    controlHeightLg: "48px",
    controlTouchMin: "44px",
    controlCheckboxRadio: "18px",
    controlTextareaMin: "80px",
    menuMinWidth: "160px",
    toastMinWidth: "280px",
    toastMaxWidth: "360px",
    dialogMaxWidth: "480px",
    drawerMaxWidth: "400px",
    calendarMinWidth: "256px",
    /** Web Kit Calendar `656:2958` — Day 셀 32×32 */
    calendarDaySize: "32px",
    tooltipMaxWidth: "200px",
    spinValueMinWidth: "48px",
    spinStepperWidth: "24px",
    spinStepperStepHeight: "20px",
    switchWidth: "44px",
    switchHeight: "24px",
    switchThumb: "20px",
    switchPadding: "2px",
    progressTrackHeight: "8px",
    sliderTrackHeight: "6px",
    paginationButtonMinWidth: "32px",
    /** Web Kit Avater Stack `Size=Small|Medium|XLarge` (`69:3008`) */
    avatarSm: "32px",
    avatarMd: "36px",
    avatarLg: "56px",
    skeletonDefaultHeight: "20px",
    accessibleClip: "1px",
    spinnerRingWidth: "3px",
} as const;

/** @refineui/web-icons WebIcon `size` — `fonts.fontSize*`와 동기 */
export const iconSizes = {
    xxs: p(fontSizes.fontSize100),
    xs: p(fontSizes.fontSize200),
    sm: p(fontSizes.fontSize300),
    md: p(fontSizes.fontSize400),
    lg: p(fontSizes.fontSize500),
    xl: p(fontSizes.fontSize600),
} as const;
