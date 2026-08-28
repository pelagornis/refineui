import { Box, Grid, Stack, Text } from "@refineui/react";

const ICONOGRAPHY_SITE = "https://github.com/pelagornis/refineui-system-icons";

const AREAS = [
    {
        href: "/foundations/design-tokens/",
        name: "Design tokens",
        hint: "Color, type, space, radius, motion, and stacking",
        external: false,
    },
    {
        href: "/foundations/layout/",
        name: "Layout",
        hint: "Containers, grids, alignment, and responsive rules",
        external: false,
    },
    {
        href: ICONOGRAPHY_SITE,
        name: "Iconography",
        hint: "System icons — opens refineui-system-icons",
        external: true,
    },
] as const;

const TOKENS = [
    { href: "/foundations/color/", name: "Color", hint: "Aliases and palette" },
    { href: "/foundations/typography/", name: "Typography", hint: "Semantic text roles" },
    { href: "/foundations/spacing/", name: "Spacing", hint: "Gaps and padding" },
    { href: "/foundations/sizing/", name: "Sizing", hint: "Control and layout sizes" },
    { href: "/foundations/radius/", name: "Radius", hint: "Corners" },
    { href: "/foundations/border/", name: "Border", hint: "Stroke widths" },
    { href: "/foundations/elevation/", name: "Elevation", hint: "Theme shadows" },
    { href: "/foundations/opacity/", name: "Opacity", hint: "Disabled wash and overlay" },
    { href: "/foundations/motion/", name: "Motion", hint: "Duration, easing, scale" },
    { href: "/foundations/z-index/", name: "Z-index", hint: "Stacking layers" },
] as const;

export default function FoundationCatalog() {
    return (
        <Stack gap="sizeXXXLarge" className="w-full min-w-0">
            <Grid minItem="foundationSize3200" gap="sizeLarge">
                {AREAS.map((area) => (
                    <Box
                        key={area.href}
                        as="article"
                        data-refineui-foundation-area
                        background="backgroundSurface"
                        radius="roundedXLarge"
                        border="strokeWidthThin"
                        borderColor="borderDefault"
                        padding="sizeXLarge"
                        className="relative min-w-0"
                    >
                        <Stack gap="sizeSmall">
                            <Text as="h3" variant="subtitleMd" className="m-0">
                                <a
                                    href={area.href}
                                    data-refineui-catalog-link
                                    {...(area.external
                                        ? { target: "_blank", rel: "noreferrer" }
                                        : {})}
                                >
                                    {area.name}
                                </a>
                            </Text>
                            <Text variant="bodyMd" className="m-0 text-refineui-alias-foreground-secondary">
                                {area.hint}
                            </Text>
                        </Stack>
                    </Box>
                ))}
            </Grid>

            <Stack gap="sizeLarge" className="w-full min-w-0">
                <Text as="h2" variant="titleMd" className="m-0">
                    Design token index
                </Text>
                <Box
                    data-refineui-foundation-index
                    background="backgroundSurface"
                    radius="roundedXLarge"
                    border="strokeWidthThin"
                    borderColor="borderDefault"
                    className="overflow-hidden"
                >
                    {TOKENS.map((item) => (
                        <Stack
                            key={item.href}
                            as="article"
                            className="relative"
                            data-refineui-foundation-index-row
                            direction="row"
                            gap="sizeMedium"
                            align="center"
                            justify="between"
                        >
                            <Text as="h3" variant="subtitleMd" className="m-0">
                                <a href={item.href} data-refineui-catalog-link>
                                    {item.name}
                                </a>
                            </Text>
                            <Text
                                variant="captionMd"
                                className="m-0 text-refineui-alias-foreground-tertiary"
                            >
                                {item.hint}
                            </Text>
                        </Stack>
                    ))}
                </Box>
            </Stack>
        </Stack>
    );
}
