/**
 * Component Color Tokens (Web Kit language layer)
 *
 * Primitive (global/colors) -> Semantic (semantic/colors) ->
 * Component Token (this file) -> Component implementation.
 *
 * This file declares token refs only (no raw color strings).
 * `@refineui/utilities` resolves CSS variables.
 */
import type { PaletteColors, SemanticColorName } from "@refineui/tokens";
import { paletteColorToken, semanticColorToken } from "@refineui/utilities/color";

const semanticToken = (name: SemanticColorName) => semanticColorToken(name);
const paletteToken = (name: keyof PaletteColors) => paletteColorToken(String(name));

const buttonPrimaryColorTokens = {
    appearance: {
        background: semanticToken("backgroundBrand"),
        foreground: semanticToken("foregroundOnBrand"),
    },
    states: {
        hover: { background: semanticToken("backgroundBrandHover") },
        pressed: { background: semanticToken("backgroundBrandActive") },
        disabled: {
            background: semanticToken("backgroundBrandDisabled"),
            foreground: semanticToken("foregroundDisabled"),
        },
    },
} as const;

export const componentColorTokens = {
    webIcon: {
        default: "currentColor",
        primary: semanticToken("foregroundPrimary"),
        secondary: semanticToken("foregroundSecondary"),
        disabled: semanticToken("foregroundDisabled"),
        inversed: semanticToken("foregroundInversed"),
    },
    button: {
        primary: {
            ...buttonPrimaryColorTokens.appearance,
            hoverBackground: buttonPrimaryColorTokens.states.hover.background,
            activeBackground: buttonPrimaryColorTokens.states.pressed.background,
            disabledBackground: buttonPrimaryColorTokens.states.disabled.background,
            disabledForeground: buttonPrimaryColorTokens.states.disabled.foreground,
            appearance: buttonPrimaryColorTokens.appearance,
            states: buttonPrimaryColorTokens.states,
        },
        secondary: {
            background: semanticToken("backgroundPrimary"),
            foreground: semanticToken("foregroundPrimary"),
            border: semanticToken("borderDefault"),
            hoverBackground: semanticToken("backgroundSurfaceHover"),
            hoverBorder: semanticToken("borderStrong"),
            activeBackground: semanticToken("backgroundSurfaceActive"),
            disabledBackground: semanticToken("backgroundSurfaceDisabled"),
            disabledBorder: semanticToken("borderDisabled"),
            disabledForeground: semanticToken("foregroundDisabled"),
        },
        outline: {
            background: "transparent",
            foreground: semanticToken("foregroundPrimary"),
            border: semanticToken("borderDefault"),
            hoverBorder: semanticToken("borderStrong"),
            activeBorder: semanticToken("borderStrong"),
            disabledBorder: semanticToken("borderDisabled"),
            disabledForeground: semanticToken("foregroundDisabled"),
        },
        ghost: {
            background: "transparent",
            foreground: semanticToken("foregroundPrimary"),
            hoverBackground: semanticToken("backgroundPrimaryHover"),
            hoverForeground: semanticToken("foregroundPrimaryHover"),
            activeBackground: semanticToken("backgroundPrimaryActive"),
            activeForeground: semanticToken("foregroundPrimary"),
            disabledForeground: semanticToken("foregroundDisabled"),
        },
    },
    input: {
        text: semanticToken("foregroundPrimary"),
        placeholder: semanticToken("foregroundPlaceholder"),
        background: semanticToken("backgroundPrimary"),
        disabledBackground: semanticToken("backgroundSurfaceDisabled"),
        border: {
            default: semanticToken("borderDefault"),
            focus: semanticToken("borderFocus"),
            error: semanticToken("borderError"),
            success: semanticToken("borderSuccess"),
            disabled: semanticToken("borderDisabled"),
        },
    },
    textarea: {
        text: semanticToken("foregroundPrimary"),
        placeholder: semanticToken("foregroundPlaceholder"),
        background: semanticToken("backgroundPrimary"),
        disabledBackground: semanticToken("backgroundSurfaceDisabled"),
        border: {
            default: semanticToken("borderDefault"),
            focus: semanticToken("borderFocus"),
            error: semanticToken("borderError"),
            success: semanticToken("borderSuccess"),
            disabled: semanticToken("borderDisabled"),
        },
    },
    pagination: {
        navIcon: {
            default: semanticToken("foregroundPrimary"),
            disabled: semanticToken("foregroundDisabled"),
        },
        page: {
            text: semanticToken("foregroundPrimary"),
            border: semanticToken("borderDefault"),
            background: semanticToken("backgroundPrimary"),
            hoverBackground: semanticToken("backgroundPrimaryHover"),
            hoverBorder: semanticToken("borderHover"),
            selectedBackground: semanticToken("backgroundPrimaryActive"),
            selectedBorder: semanticToken("borderFocus"),
            disabledBackground: semanticToken("backgroundSurfaceDisabled"),
            disabledBorder: semanticToken("borderDisabled"),
        },
    },
    dropdown: {
        trigger: {
            icon: semanticToken("foregroundPrimary"),
            background: semanticToken("backgroundPrimary"),
            border: semanticToken("borderDefault"),
        },
        menu: {
            background: semanticToken("backgroundPrimary"),
            border: semanticToken("borderDefault"),
            title: semanticToken("foregroundPrimary"),
            itemText: semanticToken("foregroundPrimary"),
            itemTextSubtle: semanticToken("foregroundSecondary"),
            itemHoverBackground: semanticToken("backgroundSurfaceHover"),
            itemDisabledText: semanticToken("foregroundDisabled"),
        },
    },
    select: {
        text: semanticToken("foregroundPrimary"),
        placeholder: semanticToken("foregroundPlaceholder"),
        background: semanticToken("backgroundPrimary"),
        disabledBackground: semanticToken("backgroundSurfaceDisabled"),
        border: {
            default: semanticToken("borderDefault"),
            disabled: semanticToken("borderDisabled"),
            error: semanticToken("borderError"),
            success: semanticToken("borderSuccess"),
        },
    },
    tooltip: {
        default: {
            background: semanticToken("surfacePopover"),
            foreground: semanticToken("foregroundPrimary"),
        }
    },
    popover: {
        default: {
            background: semanticToken("surfacePopover"),
            foreground: semanticToken("foregroundPrimary"),
            border: semanticToken("borderDefault"),
        },
        inverted: {
            background: semanticToken("surfaceInverse"),
            foreground: semanticToken("foregroundInversed"),
            border: semanticToken("borderStrong"),
        },
    },
    field: {
        label: semanticToken("foregroundPrimary"),
        required: semanticToken("foregroundError"),
        hint: semanticToken("foregroundTertiary"),
        error: semanticToken("foregroundError"),
    },
    label: {
        text: semanticToken("foregroundPrimary"),
        disabledText: semanticToken("foregroundDisabled"),
        required: semanticToken("foregroundError"),
    },
    checkbox: {
        label: {
            default: semanticToken("foregroundPrimary"),
            description: semanticToken("foregroundSecondary"),
            disabled: semanticToken("foregroundDisabled"),
        },
        checkIcon: {
            default: semanticToken("foregroundInversed"),
            disabled: semanticToken("foregroundSecondary"),
        },
    },
    radio: {
        label: {
            default: semanticToken("foregroundPrimary"),
            description: semanticToken("foregroundSecondary"),
            disabled: semanticToken("foregroundDisabled"),
        },
        control: {
            dot: semanticToken("backgroundBrand"),
            dotHover: semanticToken("backgroundBrandActive"),
            background: semanticToken("backgroundPrimary"),
            disabledDot: semanticToken("foregroundDisabled"),
            borderDefault: semanticToken("borderDefault"),
            borderFocus: semanticToken("borderStrong"),
            borderDisabled: semanticToken("borderDisabled"),
        },
    },
    toggle: {
        track: {
            on: semanticToken("backgroundBrand"),
            off: semanticToken("backgroundPrimaryActive"),
            hoverOn: semanticToken("backgroundBrandHover"),
            activeOn: semanticToken("backgroundBrandActive"),
            /** Darken on hover/press (rest is already primaryActive) */
            hoverOff: semanticToken("backgroundSurfaceSelected"),
            activeOff: semanticToken("backgroundBrandSubtle"),
            disabledOff: semanticToken("backgroundSurfaceDisabled"),
            disabledOn: semanticToken("backgroundBrandSubtle"),
        },
        thumb: {
            default: semanticToken("backgroundPrimary"),
            disabledOff: semanticToken("backgroundBrandSubtle"),
            disabledOn: semanticToken("backgroundPrimary"),
        },
    },
    switch: {
        track: {
            on: semanticToken("backgroundBrand"),
            off: semanticToken("backgroundPrimaryActive"),
            hoverOn: semanticToken("backgroundBrandHover"),
            activeOn: semanticToken("backgroundBrandActive"),
            hoverOff: semanticToken("backgroundSurfaceSelected"),
            activeOff: semanticToken("backgroundBrandSubtle"),
            disabledOff: semanticToken("backgroundSurfaceDisabled"),
            disabledOn: semanticToken("backgroundBrandSubtle"),
        },
        thumb: {
            default: semanticToken("backgroundPrimary"),
            disabledOff: semanticToken("backgroundBrandSubtle"),
            disabledOn: semanticToken("backgroundPrimary"),
        },
    },
    dialog: {
        overlay: semanticToken("surfaceOverlay"),
        content: {
            background: semanticToken("backgroundPrimary"),
        },
        header: {
            foreground: semanticToken("foregroundPrimary"),
        },
        title: {
            foreground: semanticToken("foregroundPrimary"),
        },
        description: {
            foreground: semanticToken("foregroundSecondary"),
        },
        close: {
            icon: "currentColor",
        },
        panel: {
            background: semanticToken("backgroundPrimary"),
            title: semanticToken("foregroundPrimary"),
            description: semanticToken("foregroundSecondary"),
        },
    },
    drawer: {
        overlay: semanticToken("surfaceOverlay"),
        content: {
            background: semanticToken("backgroundPrimary"),
        },
        header: {
            foreground: semanticToken("foregroundPrimary"),
            divider: semanticToken("borderDefault"),
        },
        title: {
            foreground: semanticToken("foregroundPrimary"),
        },
        description: {
            foreground: semanticToken("foregroundSecondary"),
        },
        body: {
            foreground: semanticToken("foregroundPrimary"),
            divider: semanticToken("borderDefault"),
        },
        footer: {
            divider: semanticToken("borderDefault"),
        },
        close: {
            icon: "currentColor",
        },
        panel: {
            background: semanticToken("backgroundPrimary"),
            title: semanticToken("foregroundPrimary"),
            description: semanticToken("foregroundSecondary"),
            divider: semanticToken("borderDefault"),
            body: semanticToken("foregroundPrimary"),
        },
    },
    alert: {
        background: semanticToken("backgroundPrimary"),
        border: semanticToken("borderDefault"),
        title: semanticToken("foregroundPrimary"),
        description: {
            default: semanticToken("foregroundSecondary"),
            info: semanticToken("foregroundInfo"),
            success: semanticToken("foregroundSuccess"),
            warning: semanticToken("foregroundWarning"),
            danger: semanticToken("foregroundError"),
            custom: semanticToken("foregroundDiscovery"),
        },
        accent: {
            default: semanticToken("foregroundPrimary"),
            info: semanticToken("foregroundInfo"),
            success: semanticToken("foregroundSuccess"),
            warning: semanticToken("foregroundWarning"),
            danger: semanticToken("foregroundError"),
            custom: semanticToken("foregroundDiscovery"),
        },
    },
    badge: {
        default: {
            background: semanticToken("backgroundBrand"),
            foreground: semanticToken("foregroundOnBrand"),
        },
        neutral: {
            background: semanticToken("backgroundBrandSubtle"),
            foreground: semanticToken("foregroundBrandStrong"),
        },
        outline: {
            background: "transparent",
            foreground: semanticToken("foregroundBrandStrong"),
            border: semanticToken("borderDefault"),
        },
        success: {
            background: semanticToken("backgroundSuccess"),
            foreground: semanticToken("foregroundOnSuccess"),
        },
        warning: {
            background: paletteToken("orange500"),
            foreground: paletteToken("neutralWhite"),
        },
        danger: {
            background: semanticToken("backgroundError"),
            foreground: semanticToken("foregroundOnError"),
        },
    },
    chip: {
        default: {
            background: semanticToken("backgroundSurface"),
            foreground: semanticToken("foregroundBrand"),
            hoverBackground: semanticToken("backgroundPrimaryHover"),
            activeBackground: semanticToken("backgroundPrimaryActive"),
            disabledBackground: semanticToken("backgroundSurfaceDisabled"),
            disabledForeground: semanticToken("foregroundDisabled"),
        },
        outline: {
            background: "transparent",
            foreground: semanticToken("foregroundBrand"),
            border: semanticToken("borderDefault"),
            hoverBorder: semanticToken("borderHover"),
            activeBorder: semanticToken("borderFocus"),
            disabledBorder: semanticToken("borderDisabled"),
            disabledForeground: semanticToken("foregroundDisabled"),
        },
        filled: {
            background: semanticToken("backgroundBrand"),
            foreground: semanticToken("foregroundInversed"),
            hoverBackground: semanticToken("backgroundBrandHover"),
            activeBackground: semanticToken("backgroundBrandActive"),
            disabledBackground: semanticToken("backgroundSurfaceDisabled"),
            disabledForeground: semanticToken("foregroundDisabled"),
        },
        remove: {
            icon: "currentColor",
        },
    },
    tag: {
        default: {
            background: semanticToken("backgroundSurface"),
            foreground: semanticToken("foregroundBrand"),
        },
        outline: {
            background: "transparent",
            foreground: semanticToken("foregroundBrand"),
            border: semanticToken("borderDefault"),
        },
        filled: {
            background: semanticToken("backgroundBrand"),
            foreground: semanticToken("foregroundInversed"),
        },
    },
    progress: {
        track: semanticToken("backgroundBrandSubtle"),
        indicator: {
            default: semanticToken("backgroundBrand"),
            success: semanticToken("backgroundSuccess"),
            warning: semanticToken("backgroundWarning"),
            danger: semanticToken("backgroundError"),
        },
    },
    chart: {
        plotBackground: semanticToken("backgroundPrimary"),
        grid: semanticToken("borderSubtle"),
        gridBaseline: semanticToken("borderDefault"),
        axis: semanticToken("foregroundTertiary"),
        pointStroke: semanticToken("backgroundPrimary"),
        cursor: semanticToken("backgroundSurfaceHover"),
        tooltip: {
            background: semanticToken("surfacePopover"),
            foreground: semanticToken("foregroundPrimary"),
            muted: semanticToken("foregroundSecondary"),
            border: semanticToken("borderDefault"),
        },
        series: {
            brand: semanticToken("backgroundBrand"),
            info: semanticToken("backgroundInfo"),
            success: semanticToken("backgroundSuccess"),
            warning: semanticToken("backgroundWarning"),
            error: semanticToken("backgroundError"),
            discovery: semanticToken("backgroundDiscovery"),
        },
        seriesSubtle: {
            brand: semanticToken("backgroundBrandSubtle"),
            info: semanticToken("backgroundInfoSubtle"),
            success: semanticToken("backgroundSuccessSubtle"),
            warning: semanticToken("backgroundWarningSubtle"),
            error: semanticToken("backgroundErrorSubtle"),
            discovery: semanticToken("backgroundDiscoverySubtle"),
        },
    },
    spinner: {
        track: semanticToken("backgroundBrandSubtle"),
        indicator: semanticToken("backgroundBrand"),
        label: semanticToken("foregroundPrimary"),
    },
    skeleton: {
        background: semanticToken("backgroundSurfaceSelected"),
    },
    carousel: {
        nav: {
            background: semanticToken("backgroundPrimary"),
            border: semanticToken("borderDefault"),
            foreground: semanticToken("foregroundPrimary"),
            hoverBackground: semanticToken("backgroundSurfaceHover"),
            hoverBorder: semanticToken("borderStrong"),
        },
        indicator: {
            default: semanticToken("backgroundBrandSubtle"),
            selected: semanticToken("backgroundBrand"),
        },
    },
    scrollArea: {
        track: {
            background: semanticToken("backgroundSurfaceSelected"),
        },
        thumb: {
            background: semanticToken("borderStrong"),
            hoverBackground: semanticToken("foregroundSecondary"),
        },
    },
    toast: {
        background: semanticToken("surfacePopover"),
        message: semanticToken("foregroundPrimary"),
        accent: {
            default: semanticToken("foregroundPrimary"),
            success: semanticToken("foregroundSuccess"),
            error: semanticToken("foregroundError"),
            warning: semanticToken("foregroundWarning"),
        },
    },
    toaster: {
        stackBackground: "transparent",
    },
    tabs: {
        listLine: semanticToken("borderDefault"),
        selectedLine: semanticToken("backgroundBrand"),
        itemForeground: semanticToken("foregroundTertiary"),
        selectedForeground: semanticToken("foregroundPrimary"),
        hoverForeground: semanticToken("foregroundPrimaryHover"),
        itemDisabledForeground: semanticToken("foregroundDisabled"),
    },
    segmentedControl: {
        barBackground: semanticToken("backgroundBrandSubtle"),
        barBorder: semanticToken("borderDefault"),
        itemForeground: semanticToken("foregroundSecondary"),
        itemDisabledForeground: semanticToken("foregroundDisabled"),
        selectedBackground: semanticToken("backgroundBrand"),
        selectedForeground: semanticToken("foregroundOnBrand"),
        selectedHoverBackground: semanticToken("backgroundBrandHover"),
        selectedDisabledBackground: semanticToken("backgroundSurfaceDisabled"),
        hoverForeground: semanticToken("foregroundPrimary"),
    },
    accordion: {
        item: {
            border: semanticToken("borderDefault"),
        },
        trigger: {
            background: semanticToken("backgroundPrimary"),
            foreground: semanticToken("foregroundPrimary"),
            border: semanticToken("borderDefault"),
        },
        content: {
            background: semanticToken("backgroundPrimaryHover"),
            foreground: semanticToken("foregroundPrimary"),
            border: semanticToken("borderDefault"),
        },
    },
    breadcrumb: {
        list: {
            foreground: semanticToken("foregroundTertiary"),
        },
        item: semanticToken("foregroundTertiary"),
        link: {
            foreground: semanticToken("foregroundTertiary"),
        },
        page: {
            foreground: semanticToken("foregroundPrimary"),
        },
        current: semanticToken("foregroundPrimary"),
        separatorToken: {
            foreground: semanticToken("foregroundTertiary"),
        },
        separator: semanticToken("foregroundTertiary"),
        ellipsisTrigger: {
            foreground: semanticToken("foregroundSecondary"),
        },
        ellipsis: semanticToken("foregroundSecondary"),
    },
    menu: {
        panel: {
            background: semanticToken("backgroundSurface"),
            border: semanticToken("borderDefault"),
        },
        popover: {
            background: "transparent",
        },
        list: {
            background: semanticToken("backgroundSurface"),
            border: semanticToken("borderDefault"),
        },
        section: semanticToken("foregroundPrimary"),
        sectionToken: {
            foreground: semanticToken("foregroundPrimary"),
        },
        divider: semanticToken("borderDefault"),
        dividerToken: {
            border: semanticToken("borderDefault"),
        },
        item: {
            text: semanticToken("foregroundPrimary"),
            description: semanticToken("foregroundPrimary"),
            disabledText: semanticToken("foregroundDisabled"),
            hoverBackground: semanticToken("backgroundSurfaceHover"),
            activeBackground: semanticToken("backgroundSurfaceSelected"),
            pressedBackground: semanticToken("backgroundSurfaceActive"),
            disabledBackground: semanticToken("backgroundSurfaceDisabled"),
        },
    },
    command: {
        panel: {
            background: semanticToken("backgroundPrimary"),
            border: semanticToken("borderDefault"),
        },
        input: {
            foreground: semanticToken("foregroundPrimary"),
            placeholder: semanticToken("foregroundPlaceholder"),
            icon: semanticToken("foregroundTertiary"),
        },
        group: semanticToken("foregroundTertiary"),
        empty: semanticToken("foregroundTertiary"),
        separator: semanticToken("borderDefault"),
        item: {
            text: semanticToken("foregroundPrimary"),
            disabledText: semanticToken("foregroundDisabled"),
            selectedBackground: semanticToken("backgroundSurfaceHover"),
            shortcut: semanticToken("foregroundTertiary"),
        },
    },
    link: {
        default: semanticToken("foregroundLink"),
        hover: semanticToken("foregroundLinkHover"),
        active: semanticToken("foregroundLinkActive"),
        visited: semanticToken("foregroundLinkVisited"),
        disabled: semanticToken("foregroundDisabled"),
        subtle: {
            default: semanticToken("foregroundSecondary"),
            hover: semanticToken("foregroundPrimary"),
            active: semanticToken("foregroundBrandStrong"),
        },
    },
    calendar: {
        background: semanticToken("backgroundPrimary"),
        border: semanticToken("borderDefault"),
        weekday: semanticToken("foregroundPrimary"),
        day: {
            default: semanticToken("foregroundPrimary"),
            otherMonth: semanticToken("foregroundDisabled"),
            selectedBackground: semanticToken("backgroundBrand"),
            selectedForeground: semanticToken("foregroundInversed"),
            rangeMiddleBackground: semanticToken("backgroundPrimaryHover"),
            rangeMiddleForeground: semanticToken("foregroundPrimary"),
            hoverBackground: semanticToken("backgroundPrimaryHover"),
            hoverForeground: semanticToken("foregroundPrimaryHover"),
            activeBackground: semanticToken("backgroundPrimaryActive"),
            activeForeground: semanticToken("foregroundPrimary"),
        },
    },
    card: {
        header: {
            foreground: semanticToken("foregroundPrimary"),
        },
        headerMain: {
            foreground: semanticToken("foregroundPrimary"),
        },
        content: {
            foreground: semanticToken("foregroundPrimary"),
        },
        footer: {
            foreground: semanticToken("foregroundPrimary"),
        },
        action: {
            foreground: "currentColor",
        },
        titleToken: {
            foreground: semanticToken("foregroundPrimary"),
        },
        descriptionToken: {
            foreground: semanticToken("foregroundSecondary"),
        },
        elevated: {
            background: semanticToken("backgroundPrimary"),
        },
        outlined: {
            background: semanticToken("backgroundPrimary"),
            border: semanticToken("borderDefault"),
        },
        title: semanticToken("foregroundPrimary"),
        description: semanticToken("foregroundSecondary"),
    },
    divider: {
        line: semanticToken("borderDefault"),
        label: paletteToken("primaryBlack"),
        icon: paletteToken("primaryBlack"),
    },
    avatar: {
        image: {
            background: "transparent",
        },
        fallback: {
            foreground: "currentColor",
        },
        badge: {
            background: "transparent",
        },
        avatarIcon: {
            foreground: "currentColor",
        },
        overflow: {
            background: semanticToken("backgroundPrimary"),
            border: semanticToken("borderDefault"),
            foreground: semanticToken("foregroundPrimary"),
            icon: semanticToken("foregroundPrimary"),
        },
        group: {
            background: "transparent",
        },
        groupCount: {
            background: semanticToken("backgroundPrimary"),
            border: semanticToken("borderDefault"),
            foreground: semanticToken("foregroundSecondary"),
        },
        /** Cell fill only — Global tint per MCP `Color`. Glyph/initials ink: `avatar.icon`. */
        shell: {
            background: {
                neutral: paletteToken("neutral300"),
                blue: paletteToken("blue100"),
                green: paletteToken("green100"),
                lime: paletteToken("lime100"),
                magenta: paletteToken("magenta100"),
                orange: paletteToken("orange100"),
                purple: paletteToken("purple100"),
                red: paletteToken("red100"),
                teal: paletteToken("teal100"),
                yellow: paletteToken("yellow100"),
            },
        },
        icon: {
            neutral: paletteToken("neutral850"),
            blue: paletteToken("blue1000"),
            green: paletteToken("green1000"),
            lime: paletteToken("lime1000"),
            magenta: paletteToken("magenta1000"),
            orange: paletteToken("orange1000"),
            purple: paletteToken("purple1000"),
            red: paletteToken("red1000"),
            teal: paletteToken("teal1000"),
            yellow: paletteToken("yellow1000"),
        },
        status: {
            online: paletteToken("green500"),
            away: paletteToken("yellow300"),
            unavailable: {
                background: paletteToken("red500"),
                mark: paletteToken("neutralWhite"),
            },
            offline: paletteToken("neutral300"),
        },
    },
    avatars: {
        stack: {
            background: "transparent",
        },
        spread: {
            background: "transparent",
        },
        count: {
            background: semanticToken("backgroundPrimary"),
            border: semanticToken("borderDefault"),
            foreground: semanticToken("foregroundSecondary"),
        },
    },
} as const;
