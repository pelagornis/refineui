import { Box, Stack, Text } from "@refineui/react";

const ITEMS = [
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
        <Box
            data-refineui-foundation-index
            background="backgroundSurface"
            radius="roundedXLarge"
            border="strokeWidthThin"
            borderColor="borderDefault"
            className="overflow-hidden"
        >
            {ITEMS.map((item) => (
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
                    <Text variant="captionMd" className="m-0 text-refineui-alias-foreground-tertiary">
                        {item.hint}
                    </Text>
                </Stack>
            ))}
        </Box>
    );
}
