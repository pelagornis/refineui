import { colors, SEMANTIC_PALETTE_PAIRS, type SemanticPaletteName } from "@refineui/tokens";
import { paletteColorCssVar, semanticColorCssVar } from "@refineui/utilities";
import { Stack, Text } from "@refineui/react";
import PreviewFrame from "../PreviewFrame";
import { ColorRamp, TokenRow, TokenSwatch, TokenTable } from "./TokenMeta";

const PALETTE_GROUPS: { title: string; prefix: string; keys: (keyof typeof colors)[] }[] = [
    {
        title: "Primary",
        prefix: "primary",
        keys: ["primaryLightGray", "primaryGray", "primaryDarkGray", "primaryBlack"],
    },
    {
        title: "Neutral",
        prefix: "neutral",
        keys: [
            "neutralWhite",
            "neutral100",
            "neutral150",
            "neutral200",
            "neutral250",
            "neutral300",
            "neutral350",
            "neutral400",
            "neutral450",
            "neutral500",
            "neutral550",
            "neutral600",
            "neutral650",
            "neutral700",
            "neutral750",
            "neutral800",
            "neutral850",
            "neutral900",
            "neutral950",
            "neutralBlack",
        ],
    },
    {
        title: "Red",
        prefix: "red",
        keys: ["red100", "red200", "red300", "red400", "red500", "red600", "red700", "red800", "red900", "red1000"],
    },
    {
        title: "Orange",
        prefix: "orange",
        keys: [
            "orange100",
            "orange200",
            "orange300",
            "orange400",
            "orange500",
            "orange600",
            "orange700",
            "orange800",
            "orange900",
            "orange1000",
        ],
    },
    {
        title: "Yellow",
        prefix: "yellow",
        keys: [
            "yellow100",
            "yellow200",
            "yellow300",
            "yellow400",
            "yellow500",
            "yellow600",
            "yellow700",
            "yellow800",
            "yellow900",
            "yellow1000",
        ],
    },
    {
        title: "Lime",
        prefix: "lime",
        keys: [
            "lime100",
            "lime200",
            "lime300",
            "lime400",
            "lime500",
            "lime600",
            "lime700",
            "lime800",
            "lime900",
            "lime1000",
        ],
    },
    {
        title: "Green",
        prefix: "green",
        keys: [
            "green100",
            "green200",
            "green300",
            "green400",
            "green500",
            "green600",
            "green700",
            "green800",
            "green900",
            "green1000",
        ],
    },
    {
        title: "Teal",
        prefix: "teal",
        keys: [
            "teal100",
            "teal200",
            "teal300",
            "teal400",
            "teal500",
            "teal600",
            "teal700",
            "teal800",
            "teal900",
            "teal1000",
        ],
    },
    {
        title: "Blue",
        prefix: "blue",
        keys: [
            "blue100",
            "blue200",
            "blue300",
            "blue400",
            "blue500",
            "blue600",
            "blue700",
            "blue800",
            "blue900",
            "blue1000",
        ],
    },
    {
        title: "Purple",
        prefix: "purple",
        keys: [
            "purple100",
            "purple200",
            "purple300",
            "purple400",
            "purple500",
            "purple600",
            "purple700",
            "purple800",
            "purple900",
            "purple1000",
        ],
    },
    {
        title: "Magenta",
        prefix: "magenta",
        keys: [
            "magenta100",
            "magenta200",
            "magenta300",
            "magenta400",
            "magenta500",
            "magenta600",
            "magenta700",
            "magenta800",
            "magenta900",
            "magenta1000",
        ],
    },
];

const ALIAS_GROUPS: { title: string; prefix: string }[] = [
    { title: "Background", prefix: "background" },
    { title: "Foreground", prefix: "foreground" },
    { title: "Border", prefix: "border" },
    { title: "Surface", prefix: "surface" },
];

function aliasNames(prefix: string): SemanticPaletteName[] {
    return (Object.keys(SEMANTIC_PALETTE_PAIRS) as SemanticPaletteName[]).filter((name) =>
        name.startsWith(prefix),
    );
}

function paletteStep(prefix: string, key: string): string {
    const stripped = key.slice(prefix.length);
    return stripped.length > 0 ? stripped : key;
}

export function ColorAliasPreview() {
    return (
        <PreviewFrame>
            <Stack gap="sizeXXLarge">
            {ALIAS_GROUPS.map((group) => (
                <TokenTable key={group.title} label={group.title}>
                    {aliasNames(group.prefix).map((name) => (
                        <TokenRow
                            key={name}
                            leading={<TokenSwatch style={{ background: semanticColorCssVar(name) }} />}
                            name={name}
                            value={`${SEMANTIC_PALETTE_PAIRS[name].light} / ${SEMANTIC_PALETTE_PAIRS[name].dark}`}
                        />
                    ))}
                </TokenTable>
            ))}
            </Stack>
        </PreviewFrame>
    );
}

export function ColorPalettePreview() {
    return (
        <PreviewFrame>
            <Stack gap="sizeXXLarge">
            {PALETTE_GROUPS.map((group) => (
                <Stack key={group.title} gap="sizeSmall">
                    <Text variant="captionMd" className="m-0 text-refineui-alias-foreground-secondary">
                        {group.title}
                    </Text>
                    <ColorRamp
                        fills={group.keys.map((key) => ({
                            key,
                            fill: paletteColorCssVar(key),
                        }))}
                    />
                    <Text variant="captionSm" className="m-0 text-refineui-alias-foreground-tertiary">
                        {group.keys.map((key) => paletteStep(group.prefix, key)).join("  ")}
                    </Text>
                </Stack>
            ))}
            </Stack>
        </PreviewFrame>
    );
}
