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
    /** Top navigation — trigger denser like segmented control; content links match menu rows. */
    navigationMenu: {
        trigger: role("captionLg"),
        link: role("captionLg"),
        contentLink: role("bodyMd"),
    },
    /** Site footer — sitemap body; legal lockup matches the locale pill. */
    footer: {
        brandName: role("bodyMd"),
        brandDescription: role("bodyXs"),
        groupLabel: role("bodyMd"),
        link: role("bodyMd"),
        copyright: role("bodyMd"),
    },
    /** App sidebar — group labels match menu sections; links match menu rows. */
    sidebar: {
        brand: role("bodyMd"),
        groupLabel: role("captionLg"),
        link: role("bodyMd"),
    },
    menu: {
        section: role("captionLg"),
        item: role("bodyMd"),
        description: role("bodyXs"),
        shortcut: role("bodyXs"),
    },
    /** Command palette — same scale as Menu (list / section / shortcut). */
    command: {
        group: role("captionLg"),
        item: role("bodyMd"),
        empty: role("bodyXs"),
        shortcut: role("bodyXs"),
        input: role("bodyMd"),
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
    bubble: role("bodyMd"),
    /** Digits use title scale — applied via `refineui.css` `[data-refineui="input-otp"][data-size]`. */
    inputOtp: {
        sm: role("subtitleLg"),
        md: role("titleSm"),
        lg: role("titleMd"),
    },
    stepper: {
        indicator: role("captionLg"),
        title: role("labelMd"),
        description: role("captionMd"),
    },
    progressStepper: {
        marker: role("captionSm"),
        label: role("labelSm"),
    },

    toast: {
        message: role("bodyMd"),
    },
    pagination: role("bodyLg"),
    chip: {
        sm: role("labelSm"),
        md: role("bodySm"),
        lg: role("bodyLg"),
    },
    badge: role("captionMd"),
    segmentedControl: role("captionLg"),
    tabs: role("captionLg"),
    table: {
        head: role("bodySm"),
        cell: role("bodySm"),
        caption: role("bodyXs"),
    },
    tooltip: role("bodyXs"),
    textarea: role("bodyMd"),
    select: {
        /** Trigger density matches Navigation Menu (`captionLg` at md). */
        trigger: {
            sm: role("captionMd"),
            md: role("captionLg"),
            lg: role("bodyMd"),
        },
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
    chart: {
        axisLabel: role("captionSm"),
        legendLabel: role("captionMd"),
        tooltipLabel: role("captionMd"),
        tooltipValue: role("bodySm"),
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
