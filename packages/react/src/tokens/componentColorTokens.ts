/**
 * Component Color Tokens (Web Kit language layer)
 *
 * Primitive (global/colors) -> Semantic (semantic/colors) ->
 * Component Token (this file) -> Component implementation.
 *
 * 이 파일은 색 문자열을 직접 만들지 않고 token ref만 선언한다.
 * 실제 CSS variable 해석은 @refineui/utilities가 담당한다.
 */
import type { PaletteColors, SemanticColorName } from "@refineui/tokens";
import { paletteColorToken, semanticColorToken } from "@refineui/utilities/color";

const semanticToken = (name: SemanticColorName) => semanticColorToken(name);
const paletteToken = (name: keyof PaletteColors) => paletteColorToken(String(name));
// TODO: callsite rename migration in this file

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
            background: semanticToken("backgroundBrand"),
            foreground: semanticToken("foregroundOnBrand"),
            hoverBackground: semanticToken("backgroundBrandHover"),
            activeBackground: semanticToken("backgroundBrandActive"),
            disabledBackground: semanticToken("backgroundBrandDisabled"),
            disabledForeground: semanticToken("foregroundDisabled"),
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
            disabled: semanticToken("foregroundDisabled"),
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
            activeOn: semanticToken("backgroundBrandStrong"),
            hoverOff: semanticToken("backgroundPrimaryHover"),
            activeOff: semanticToken("backgroundPrimaryActive"),
            disabled: semanticToken("backgroundBrandDisabled"),
        },
        thumb: {
            default: semanticToken("backgroundPrimary"),
            disabled: semanticToken("backgroundBrandSubtle"),
        },
    },
    switch: {
        track: {
            on: semanticToken("backgroundBrand"),
            off: semanticToken("backgroundPrimaryActive"),
            hoverOn: semanticToken("backgroundBrandHover"),
            activeOn: semanticToken("backgroundBrandStrong"),
            hoverOff: semanticToken("backgroundPrimaryHover"),
            activeOff: semanticToken("backgroundPrimaryActive"),
            disabled: semanticToken("backgroundBrandDisabled"),
        },
        thumb: {
            default: semanticToken("backgroundPrimary"),
            disabled: semanticToken("backgroundBrandSubtle"),
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
            default: semanticToken("foregroundBrand"),
            info: paletteToken("blue600"),
            success: paletteToken("green600"),
            warning: paletteToken("yellow600"),
            danger: paletteToken("red600"),
            custom: paletteToken("purple600"),
        },
        accent: {
            default: semanticToken("foregroundPrimary"),
            info: paletteToken("blue600"),
            success: paletteToken("green600"),
            warning: paletteToken("yellow600"),
            danger: paletteToken("red600"),
            custom: paletteToken("purple600"),
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
    spinner: {
        track: semanticToken("backgroundBrandSubtle"),
        indicator: semanticToken("backgroundBrand"),
        label: semanticToken("foregroundPrimary"),
    },
    skeleton: {
        background: semanticToken("backgroundBrandSubtle"),
        shimmer: semanticToken("backgroundPrimary"),
    },
    toast: {
        background: semanticToken("backgroundPrimary"),
        border: semanticToken("borderDefault"),
        title: semanticToken("foregroundPrimary"),
        message: semanticToken("foregroundTertiary"),
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
        pill: {
            barBackground: semanticToken("backgroundPrimaryActive"),
            barBorder: semanticToken("borderDefault"),
            itemForeground: semanticToken("foregroundPrimary"),
            itemDisabledForeground: semanticToken("foregroundDisabled"),
            selectedBackground: semanticToken("backgroundPrimary"),
            selectedForeground: semanticToken("foregroundPrimary"),
            selectedDisabledBackground: semanticToken("backgroundSurfaceDisabled"),
        },
        underline: {
            line: paletteToken("neutral200"),
            selectedLine: paletteToken("primaryBlack"),
            itemForeground: semanticToken("foregroundPrimary"),
            itemDisabledForeground: semanticToken("foregroundDisabled"),
        },
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
            background: paletteToken("primaryLightGray"),
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
        /** 셀 채우기만 — MCP `Color`별 Global tint. 글리프·이니셜 잉크는 `avatar.icon`. */
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
