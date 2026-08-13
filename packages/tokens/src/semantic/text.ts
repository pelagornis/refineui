import type { TypographyStyles } from "../types";

/**
 * Semantic text roles — M3/Polaris-style meaning layer over Foundation `typographys`.
 * UI and component tokens reference these names, not raw Foundation keys.
 */
export const SEMANTIC_TEXT = {
    /** Display / marketing hero */
    displayLg: "heading1",
    displayMd: "heading2",
    displaySm: "heading3",

    /** Page & section headings */
    headingLg: "heading2",
    headingMd: "heading3",
    headingSm: "heading4",

    /** Component titles (Card, Dialog header) */
    titleLg: "title1",
    titleMd: "title2",
    titleSm: "title3",

    /** Emphasized subtitles */
    subtitleLg: "subTitle1",
    subtitleMd: "subTitle2",

    /** Primary reading text */
    bodyLg: "body1",
    bodyMd: "body2",
    bodySm: "body3",
    bodyXs: "body4",

    /** Form labels, menu row labels */
    labelLg: "body1",
    labelMd: "body2",
    labelSm: "caption1",

    /** Metadata, helpers, shortcuts */
    captionLg: "caption1",
    captionMd: "caption2",
    captionSm: "caption3",
} as const satisfies Record<string, keyof TypographyStyles>;

export type SemanticTextName = keyof typeof SEMANTIC_TEXT;
export type FoundationTypographyName = keyof TypographyStyles;
