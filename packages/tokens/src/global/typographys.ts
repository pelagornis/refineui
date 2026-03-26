import type { TypographyStyles } from "../types";
import { fontFamilies } from "./fonts";
import { fontSizes } from "./fonts";
import { fontWeights } from "./fonts";
import { lineHeights } from "./fonts";

const { fontFamily } = fontFamilies;
const { fontWeightRegular, fontWeightMedium, fontWeightSemibold, fontWeightBold, fontWeightHeavy } = fontWeights;

/** Foundation Typography — https://www.figma.com/design/GOLyxZSkzbRIuMNBvxeqr3/Pelagornis-RefineUI-Foundation?node-id=1-650 */
export const typographys: TypographyStyles = {
    heading1: {
        fontFamily,
        fontSize: fontSizes.fontSize1000,
        fontWeight: fontWeightHeavy,
        lineHeight: lineHeights.lineHeight1000,
    },
    heading2: {
        fontFamily,
        fontSize: fontSizes.fontSize900,
        fontWeight: fontWeightBold,
        lineHeight: lineHeights.lineHeight900,
    },
    heading3: {
        fontFamily,
        fontSize: fontSizes.fontSize800,
        fontWeight: fontWeightBold,
        lineHeight: lineHeights.lineHeight800,
    },
    heading4: {
        fontFamily,
        fontSize: fontSizes.fontSize700,
        fontWeight: fontWeightSemibold,
        lineHeight: lineHeights.lineHeight700,
    },
    title1: {
        fontFamily,
        fontSize: fontSizes.fontSize800,
        fontWeight: fontWeightSemibold,
        lineHeight: lineHeights.lineHeight800,
    },
    title2: {
        fontFamily,
        fontSize: fontSizes.fontSize700,
        fontWeight: fontWeightSemibold,
        lineHeight: lineHeights.lineHeight700,
    },
    title3: {
        fontFamily,
        fontSize: fontSizes.fontSize600,
        fontWeight: fontWeightSemibold,
        lineHeight: lineHeights.lineHeight600,
    },
    subTitle1: {
        fontFamily,
        fontSize: fontSizes.fontSize500,
        fontWeight: fontWeightSemibold,
        lineHeight: lineHeights.lineHeight500,
    },
    subTitle2: {
        fontFamily,
        fontSize: fontSizes.fontSize400,
        fontWeight: fontWeightSemibold,
        lineHeight: lineHeights.lineHeight400,
    },
    body1: {
        fontFamily,
        fontSize: fontSizes.fontSize400,
        fontWeight: fontWeightMedium,
        lineHeight: lineHeights.lineHeight400,
    },
    body2: {
        fontFamily,
        fontSize: fontSizes.fontSize300,
        fontWeight: fontWeightMedium,
        lineHeight: lineHeights.lineHeight300,
    },
    body3: {
        fontFamily,
        fontSize: fontSizes.fontSize300,
        fontWeight: fontWeightRegular,
        lineHeight: lineHeights.lineHeight300,
    },
    body4: {
        fontFamily,
        fontSize: fontSizes.fontSize200,
        fontWeight: fontWeightRegular,
        lineHeight: lineHeights.lineHeight200,
    },
    caption1: {
        fontFamily,
        fontSize: fontSizes.fontSize200,
        fontWeight: fontWeightMedium,
        lineHeight: lineHeights.lineHeight200,
    },
    caption2: {
        fontFamily,
        fontSize: fontSizes.fontSize200,
        fontWeight: fontWeightRegular,
        lineHeight: lineHeights.lineHeight200,
    },
    caption3: {
        fontFamily,
        fontSize: fontSizes.fontSize100,
        fontWeight: fontWeightRegular,
        lineHeight: lineHeights.lineHeight100,
    },
};
