import type { ShadowLevel, ShadowColorTokens, ShadowTokens } from "../types";
import { colors } from "./colors";

function hexToRgba(hex: string, alpha: number): string {
    const h = hex.replace("#", "");
    const r = h.length === 3 ? parseInt(h[0] + h[0], 16) : parseInt(h.slice(0, 2), 16);
    const g = h.length === 3 ? parseInt(h[1] + h[1], 16) : parseInt(h.slice(2, 4), 16);
    const b = h.length === 3 ? parseInt(h[2] + h[2], 16) : parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Shadow base color — Foundation node-id=1-5785, primaryBlack */
const SHADOW_BASE = colors.primaryBlack;

/** Shadow color (Figma Variables — Lighter ~ Darker, Key/Ambient별) */
export const shadowColors: ShadowColorTokens = {
    shadowColorKeyLighter: hexToRgba(SHADOW_BASE, 0.02),
    shadowColorKeyLight: hexToRgba(SHADOW_BASE, 0.05),
    shadowColorKey: hexToRgba(SHADOW_BASE, 0.08),
    shadowColorKeyDark: hexToRgba(SHADOW_BASE, 0.2),
    shadowColorKeyDarker: hexToRgba(SHADOW_BASE, 0.3),
    shadowColorAmbientLighter: hexToRgba(SHADOW_BASE, 0.02),
    shadowColorAmbientLight: hexToRgba(SHADOW_BASE, 0.04),
    shadowColorAmbient: hexToRgba(SHADOW_BASE, 0.06),
    shadowColorAmbientDark: hexToRgba(SHADOW_BASE, 0.15),
    shadowColorAmbientDarker: hexToRgba(SHADOW_BASE, 0.25),
};

/** 레벨별 dimension (x y blur spread) */
const SHADOW_DIMS = {
    shadow2: { key: "0 1px 2px 0", ambient: "0 2px 4px 0" },
    shadow4: { key: "0 2px 2px 0", ambient: "0 4px 8px 0" },
    shadow8: { key: "0 4px 4px 0", ambient: "0 8px 16px 0" },
    shadow16: { key: "0 8px 8px 0", ambient: "0 16px 32px 0" },
    shadow24: { key: "0 12px 12px 0", ambient: "0 24px 48px 0" },
    shadow32: { key: "0 16px 16px 0", ambient: "0 32px 64px 0" },
    shadow64: { key: "0 24px 24px 0", ambient: "0 48px 96px 0" },
} as const;

function shadowLevel(
    keyDim: string,
    ambientDim: string,
    keyColor: string,
    ambientColor: string
): ShadowLevel {
    return {
        key: `${keyDim} ${keyColor}`,
        ambient: `${ambientDim} ${ambientColor}`,
    };
}

/** key + ambient를 box-shadow 문자열로 합침 */
export function toBoxShadow(level: ShadowLevel): string {
    return `${level.key}, ${level.ambient}`;
}

/**
 * Shadow tokens — Lighter ~ Darker, shadowColors 기반
 * Foundation: https://www.figma.com/design/GOLyxZSkzbRIuMNBvxeqr3/Pelagornis-RefineUI-Foundation?node-id=1-5785
 */
export const shadows: ShadowTokens = {
    shadow2Lighter: shadowLevel(
        SHADOW_DIMS.shadow2.key,
        SHADOW_DIMS.shadow2.ambient,
        shadowColors.shadowColorKeyLighter,
        shadowColors.shadowColorAmbientLighter
    ),
    shadow2Light: shadowLevel(
        SHADOW_DIMS.shadow2.key,
        SHADOW_DIMS.shadow2.ambient,
        shadowColors.shadowColorKeyLight,
        shadowColors.shadowColorAmbientLight
    ),
    shadow2: shadowLevel(
        SHADOW_DIMS.shadow2.key,
        SHADOW_DIMS.shadow2.ambient,
        shadowColors.shadowColorKey,
        shadowColors.shadowColorAmbient
    ),
    shadow2Dark: shadowLevel(
        SHADOW_DIMS.shadow2.key,
        SHADOW_DIMS.shadow2.ambient,
        shadowColors.shadowColorKeyDark,
        shadowColors.shadowColorAmbientDark
    ),
    shadow2Darker: shadowLevel(
        SHADOW_DIMS.shadow2.key,
        SHADOW_DIMS.shadow2.ambient,
        shadowColors.shadowColorKeyDarker,
        shadowColors.shadowColorAmbientDarker
    ),
    shadow4Lighter: shadowLevel(
        SHADOW_DIMS.shadow4.key,
        SHADOW_DIMS.shadow4.ambient,
        shadowColors.shadowColorKeyLighter,
        shadowColors.shadowColorAmbientLighter
    ),
    shadow4Light: shadowLevel(
        SHADOW_DIMS.shadow4.key,
        SHADOW_DIMS.shadow4.ambient,
        shadowColors.shadowColorKeyLight,
        shadowColors.shadowColorAmbientLight
    ),
    shadow4: shadowLevel(
        SHADOW_DIMS.shadow4.key,
        SHADOW_DIMS.shadow4.ambient,
        shadowColors.shadowColorKey,
        shadowColors.shadowColorAmbient
    ),
    shadow4Dark: shadowLevel(
        SHADOW_DIMS.shadow4.key,
        "0 6px 10px 0",
        shadowColors.shadowColorKeyDark,
        shadowColors.shadowColorAmbientDark
    ),
    shadow4Darker: shadowLevel(
        SHADOW_DIMS.shadow4.key,
        "0 6px 10px 0",
        shadowColors.shadowColorKeyDarker,
        shadowColors.shadowColorAmbientDarker
    ),
    shadow8Lighter: shadowLevel(
        SHADOW_DIMS.shadow8.key,
        SHADOW_DIMS.shadow8.ambient,
        shadowColors.shadowColorKeyLighter,
        shadowColors.shadowColorAmbientLighter
    ),
    shadow8Light: shadowLevel(
        SHADOW_DIMS.shadow8.key,
        SHADOW_DIMS.shadow8.ambient,
        shadowColors.shadowColorKeyLight,
        shadowColors.shadowColorAmbientLight
    ),
    shadow8: shadowLevel(
        SHADOW_DIMS.shadow8.key,
        SHADOW_DIMS.shadow8.ambient,
        shadowColors.shadowColorKey,
        shadowColors.shadowColorAmbient
    ),
    shadow8Dark: shadowLevel(
        SHADOW_DIMS.shadow8.key,
        SHADOW_DIMS.shadow8.ambient,
        shadowColors.shadowColorKeyDark,
        shadowColors.shadowColorAmbientDark
    ),
    shadow8Darker: shadowLevel(
        SHADOW_DIMS.shadow8.key,
        SHADOW_DIMS.shadow8.ambient,
        shadowColors.shadowColorKeyDarker,
        shadowColors.shadowColorAmbientDarker
    ),
    shadow16Lighter: shadowLevel(
        SHADOW_DIMS.shadow16.key,
        SHADOW_DIMS.shadow16.ambient,
        shadowColors.shadowColorKeyLighter,
        shadowColors.shadowColorAmbientLighter
    ),
    shadow16Light: shadowLevel(
        SHADOW_DIMS.shadow16.key,
        SHADOW_DIMS.shadow16.ambient,
        shadowColors.shadowColorKeyLight,
        shadowColors.shadowColorAmbientLight
    ),
    shadow16: shadowLevel(
        SHADOW_DIMS.shadow16.key,
        SHADOW_DIMS.shadow16.ambient,
        shadowColors.shadowColorKey,
        shadowColors.shadowColorAmbient
    ),
    shadow16Dark: shadowLevel(
        SHADOW_DIMS.shadow16.key,
        SHADOW_DIMS.shadow16.ambient,
        shadowColors.shadowColorKeyDark,
        shadowColors.shadowColorAmbientDark
    ),
    shadow16Darker: shadowLevel(
        SHADOW_DIMS.shadow16.key,
        SHADOW_DIMS.shadow16.ambient,
        shadowColors.shadowColorKeyDarker,
        shadowColors.shadowColorAmbientDarker
    ),
    shadow24Lighter: shadowLevel(
        SHADOW_DIMS.shadow24.key,
        SHADOW_DIMS.shadow24.ambient,
        shadowColors.shadowColorKeyLighter,
        shadowColors.shadowColorAmbientLighter
    ),
    shadow24Light: shadowLevel(
        SHADOW_DIMS.shadow24.key,
        SHADOW_DIMS.shadow24.ambient,
        shadowColors.shadowColorKeyLight,
        shadowColors.shadowColorAmbientLight
    ),
    shadow24: shadowLevel(
        SHADOW_DIMS.shadow24.key,
        SHADOW_DIMS.shadow24.ambient,
        shadowColors.shadowColorKey,
        shadowColors.shadowColorAmbient
    ),
    shadow24Dark: shadowLevel(
        SHADOW_DIMS.shadow24.key,
        SHADOW_DIMS.shadow24.ambient,
        shadowColors.shadowColorKeyDark,
        shadowColors.shadowColorAmbientDark
    ),
    shadow24Darker: shadowLevel(
        SHADOW_DIMS.shadow24.key,
        SHADOW_DIMS.shadow24.ambient,
        shadowColors.shadowColorKeyDarker,
        shadowColors.shadowColorAmbientDarker
    ),
    shadow32Lighter: shadowLevel(
        SHADOW_DIMS.shadow32.key,
        SHADOW_DIMS.shadow32.ambient,
        shadowColors.shadowColorKeyLighter,
        shadowColors.shadowColorAmbientLighter
    ),
    shadow32Light: shadowLevel(
        SHADOW_DIMS.shadow32.key,
        SHADOW_DIMS.shadow32.ambient,
        shadowColors.shadowColorKeyLight,
        shadowColors.shadowColorAmbientLight
    ),
    shadow32: shadowLevel(
        SHADOW_DIMS.shadow32.key,
        SHADOW_DIMS.shadow32.ambient,
        shadowColors.shadowColorKey,
        shadowColors.shadowColorAmbient
    ),
    shadow32Dark: shadowLevel(
        SHADOW_DIMS.shadow32.key,
        SHADOW_DIMS.shadow32.ambient,
        shadowColors.shadowColorKeyDark,
        shadowColors.shadowColorAmbientDark
    ),
    shadow32Darker: shadowLevel(
        SHADOW_DIMS.shadow32.key,
        SHADOW_DIMS.shadow32.ambient,
        shadowColors.shadowColorKeyDarker,
        shadowColors.shadowColorAmbientDarker
    ),
    shadow64Lighter: shadowLevel(
        SHADOW_DIMS.shadow64.key,
        SHADOW_DIMS.shadow64.ambient,
        shadowColors.shadowColorKeyLighter,
        shadowColors.shadowColorAmbientLighter
    ),
    shadow64Light: shadowLevel(
        SHADOW_DIMS.shadow64.key,
        SHADOW_DIMS.shadow64.ambient,
        shadowColors.shadowColorKeyLight,
        shadowColors.shadowColorAmbientLight
    ),
    shadow64: shadowLevel(
        SHADOW_DIMS.shadow64.key,
        SHADOW_DIMS.shadow64.ambient,
        shadowColors.shadowColorKey,
        shadowColors.shadowColorAmbient
    ),
    shadow64Dark: shadowLevel(
        SHADOW_DIMS.shadow64.key,
        SHADOW_DIMS.shadow64.ambient,
        shadowColors.shadowColorKeyDark,
        shadowColors.shadowColorAmbientDark
    ),
    shadow64Darker: shadowLevel(
        SHADOW_DIMS.shadow64.key,
        SHADOW_DIMS.shadow64.ambient,
        shadowColors.shadowColorKeyDarker,
        shadowColors.shadowColorAmbientDarker
    ),
};
