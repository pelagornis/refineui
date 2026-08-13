/**
 * Component typography tokens (Web Kit language layer)
 *
 * Primitive (`typographys`) → Semantic (`SEMANTIC_TEXT`) → Component (this file) → implementation.
 */
import type { SemanticTextName } from "@refineui/tokens";
import { semanticTextToken } from "@refineui/utilities";

const role = (name: SemanticTextName) => semanticTextToken(name);

export type ControlSize = "sm" | "md" | "lg";

export const componentTypographyTokens = {
    formControl: {
        sm: role("bodySm"),
        md: role("bodyMd"),
        lg: role("bodyLg"),
    },
    label: {
        sm: role("labelSm"),
        md: role("labelMd"),
        lg: role("labelLg"),
    },
    labelCompanion: {
        label: role("labelMd"),
        description: role("captionMd"),
    },
    fieldFeedback: role("captionSm"),
    /** Trigger = size + medium weight; content = one step smaller / lighter for readable hierarchy */
    accordion: {
        trigger: {
            sm: role("labelMd"),
            md: role("bodyLg"),
            lg: role("subtitleLg"),
        },
        content: {
            sm: role("bodySm"),
            md: role("bodyMd"),
            lg: role("bodyLg"),
        },
    },
    button: {
        sm: role("bodySm"),
        md: role("bodyLg"),
        lg: role("subtitleLg"),
    },
    link: role("bodyLg"),
    breadcrumb: {
        row: role("captionLg"),
    },
    menu: {
        section: role("captionLg"),
        item: role("bodyMd"),
        description: role("bodyXs"),
        shortcut: role("bodyXs"),
    },
    dropdown: {
        label: role("captionLg"),
        item: role("bodyMd"),
        shortcut: role("bodyXs"),
    },
    dialog: {
        title: role("subtitleMd"),
        description: role("bodyXs"),
    },
    drawer: {
        title: role("subtitleLg"),
        description: role("bodyXs"),
        body: role("bodyMd"),
    },
    card: {
        title: role("titleSm"),
        description: role("bodyMd"),
    },
    alert: {
        title: role("captionLg"),
        description: role("captionLg"),
    },
    toast: {
        title: role("bodyMd"),
        message: role("bodyXs"),
    },
    pagination: role("bodyLg"),
    chip: {
        sm: role("labelSm"),
        md: role("bodySm"),
        lg: role("bodyLg"),
    },
    badge: role("captionMd"),
    tabs: role("captionLg"),
    tooltip: role("bodyXs"),
    textarea: role("bodyMd"),
    select: {
        label: role("captionLg"),
        item: role("bodyMd"),
    },
    calendar: {
        day: role("captionLg"),
        weekday: role("captionLg"),
    },
    divider: {
        contentLabel: role("captionMd"),
    },
    spinner: {
        xs: role("captionLg"),
        sm: role("bodyMd"),
        md: role("bodyLg"),
        lg: role("subtitleMd"),
        xl: role("subtitleLg"),
        xxl: role("titleSm"),
    },
    avatar: {
        initialsNeutral: {
            xxxsmall: role("bodyXs"),
            xxsmall: role("bodyMd"),
            xsmall: role("bodyLg"),
            small: role("bodyLg"),
            medium: role("bodyLg"),
            large: role("bodyLg"),
            xlarge: role("subtitleLg"),
            xxlarge: role("titleSm"),
            xxxlarge: role("titleMd"),
        },
        initialsAccent: {
            xxxlarge: role("titleMd"),
            xxlarge: role("titleSm"),
            xlarge: role("subtitleLg"),
            default: role("bodyLg"),
        },
        groupCount: {
            xxxsmall: role("captionSm"),
            xxsmall: role("captionSm"),
            xsmall: role("captionMd"),
            small: role("captionMd"),
            medium: role("captionLg"),
            large: role("captionLg"),
            xlarge: role("bodyMd"),
            xxlarge: role("bodyMd"),
            xxxlarge: role("bodyMd"),
        },
    },
} as const;
