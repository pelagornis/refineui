import { hexToRgba } from "@refineui/utilities";
import type { ShadowLevel, ShadowColorTokens, ShadowTokens, SemanticShadowElevationName } from "../types";
import { colors } from "./colors";

/** Shadow base color — Foundation node-id=1-5785, primaryBlack */
const SHADOW_BASE = colors.primaryBlack;

/**
 * Shadow color — Figma `Global/Shadows/Key *` · `Ambient *` (lighter ~ darker 램프).
 * Elevation 이펙트는 보통 Key light + Ambient light (Light 모드) / Key dark + Ambient dark (Dark 모드).
 */
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

/** 레벨별 dimension (x y blur spread) — Figma Shadow 2 / 4 / … */
const SHADOW_DIMS = {
    shadow2: { key: "0 1px 2px 0", ambient: "0 2px 4px 0" },
    shadow4: { key: "0 2px 2px 0", ambient: "0 4px 8px 0" },
    shadow8: { key: "0 4px 4px 0", ambient: "0 8px 16px 0" },
    shadow16: { key: "0 8px 8px 0", ambient: "0 16px 32px 0" },
    shadow24: { key: "0 12px 12px 0", ambient: "0 24px 48px 0" },
    shadow32: { key: "0 16px 16px 0", ambient: "0 32px 64px 0" },
    shadow64: { key: "0 24px 24px 0", ambient: "0 48px 96px 0" },
} as const satisfies Record<SemanticShadowElevationName, { key: string; ambient: string }>;

/** Elevation Dark / Shadow 4 — Foundation ambient만 `0 6px 10px 0` */
const SHADOW4_DARK_AMBIENT = "0 6px 10px 0";

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
 * Elevation 그림자 — Figma `Elevation/Light` → `shadowNLight`, `Elevation/Dark` → `shadowNDark`
 * Foundation: https://www.figma.com/design/GOLyxZSkzbRIuMNBvxeqr3/Pelagornis-RefineUI-Foundation?node-id=1-5785
 */
export const shadows: ShadowTokens = {
    shadow2Light: shadowLevel(
        SHADOW_DIMS.shadow2.key,
        SHADOW_DIMS.shadow2.ambient,
        shadowColors.shadowColorKeyLight,
        shadowColors.shadowColorAmbientLight
    ),
    shadow2Dark: shadowLevel(
        SHADOW_DIMS.shadow2.key,
        SHADOW_DIMS.shadow2.ambient,
        shadowColors.shadowColorKeyDark,
        shadowColors.shadowColorAmbientDark
    ),
    shadow4Light: shadowLevel(
        SHADOW_DIMS.shadow4.key,
        SHADOW_DIMS.shadow4.ambient,
        shadowColors.shadowColorKeyLight,
        shadowColors.shadowColorAmbientLight
    ),
    shadow4Dark: shadowLevel(
        SHADOW_DIMS.shadow4.key,
        SHADOW4_DARK_AMBIENT,
        shadowColors.shadowColorKeyDark,
        shadowColors.shadowColorAmbientDark
    ),
    shadow8Light: shadowLevel(
        SHADOW_DIMS.shadow8.key,
        SHADOW_DIMS.shadow8.ambient,
        shadowColors.shadowColorKeyLight,
        shadowColors.shadowColorAmbientLight
    ),
    shadow8Dark: shadowLevel(
        SHADOW_DIMS.shadow8.key,
        SHADOW_DIMS.shadow8.ambient,
        shadowColors.shadowColorKeyDark,
        shadowColors.shadowColorAmbientDark
    ),
    shadow16Light: shadowLevel(
        SHADOW_DIMS.shadow16.key,
        SHADOW_DIMS.shadow16.ambient,
        shadowColors.shadowColorKeyLight,
        shadowColors.shadowColorAmbientLight
    ),
    shadow16Dark: shadowLevel(
        SHADOW_DIMS.shadow16.key,
        SHADOW_DIMS.shadow16.ambient,
        shadowColors.shadowColorKeyDark,
        shadowColors.shadowColorAmbientDark
    ),
    shadow24Light: shadowLevel(
        SHADOW_DIMS.shadow24.key,
        SHADOW_DIMS.shadow24.ambient,
        shadowColors.shadowColorKeyLight,
        shadowColors.shadowColorAmbientLight
    ),
    shadow24Dark: shadowLevel(
        SHADOW_DIMS.shadow24.key,
        SHADOW_DIMS.shadow24.ambient,
        shadowColors.shadowColorKeyDark,
        shadowColors.shadowColorAmbientDark
    ),
    shadow32Light: shadowLevel(
        SHADOW_DIMS.shadow32.key,
        SHADOW_DIMS.shadow32.ambient,
        shadowColors.shadowColorKeyLight,
        shadowColors.shadowColorAmbientLight
    ),
    shadow32Dark: shadowLevel(
        SHADOW_DIMS.shadow32.key,
        SHADOW_DIMS.shadow32.ambient,
        shadowColors.shadowColorKeyDark,
        shadowColors.shadowColorAmbientDark
    ),
    shadow64Light: shadowLevel(
        SHADOW_DIMS.shadow64.key,
        SHADOW_DIMS.shadow64.ambient,
        shadowColors.shadowColorKeyLight,
        shadowColors.shadowColorAmbientLight
    ),
    shadow64Dark: shadowLevel(
        SHADOW_DIMS.shadow64.key,
        SHADOW_DIMS.shadow64.ambient,
        shadowColors.shadowColorKeyDark,
        shadowColors.shadowColorAmbientDark
    ),
};
