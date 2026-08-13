/**
 * Foundation layout size steps — digits ×0.1 → px (e.g. `320` → 32px, `3250` → 325px).
 * Emitted as `--refineui-size-foundation-size-*` and Tailwind `size-refineui-foundation-size-*`.
 *
 * Includes Web Kit component steps that must stay linked here (not invented in `componentSizes`).
 */
export const foundationSizes = {
    foundationSize10: "1px",
    foundationSize20: "2px",
    foundationSize30: "3px",
    foundationSize40: "4px",
    foundationSize60: "6px",
    foundationSize80: "8px",
    foundationSize100: "10px",
    foundationSize120: "12px",
    /** Divider icon inner circle — Web Kit ≈ 40/3 */
    foundationSize133: "13.33px",
    foundationSize140: "14px",
    foundationSize160: "16px",
    foundationSize200: "20px",
    foundationSize240: "24px",
    foundationSize280: "28px",
    foundationSize300: "30px",
    foundationSize320: "32px",
    foundationSize340: "34px",
    foundationSize360: "36px",
    foundationSize400: "40px",
    foundationSize440: "44px",
    foundationSize480: "48px",
    foundationSize520: "52px",
    foundationSize540: "54px",
    foundationSize600: "60px",
    foundationSize800: "80px",
    foundationSize2000: "200px",
    foundationSize2440: "244px",
    foundationSize2560: "256px",
    foundationSize3000: "300px",
    foundationSize3200: "320px",
    foundationSize3250: "325px",
    foundationSize5750: "575px",
    foundationSize6000: "600px",
    foundationSize8500: "850px",
} as const;

export type FoundationSizeName = keyof typeof foundationSizes;
