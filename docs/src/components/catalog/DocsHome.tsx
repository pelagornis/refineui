import { Box, Grid, Link, Stack, Text } from "@refineui/react";
import { withBase } from "../../lib/docs-path";
import { HeroBackdrop } from "../../resources/home";
import { HomeFeaturedComponents } from "./HomeFeaturedComponents";
import { HomeHeroHeadline } from "./HomeHeroHeadline";
import { HomeHeroVideo } from "./HomeHeroVideo";

const PATHWAYS = [
    {
        href: "/foundations/",
        title: "Foundations",
        description: "Color, type, space, motion, and elevation tokens.",
        cta: "Browse foundations",
    },
    {
        href: "/components/",
        title: "Components",
        description: "Live React specimens grouped by layout, forms, navigation, and data.",
        cta: "Component overview",
    },
    {
        href: "/development/installation/",
        title: "Develop",
        description: "Install packages, theme apps, and align motion with product.",
        cta: "Installation",
    },
] as const;

const EXPLORE = [
    { href: "/components/button/", title: "Button", tag: "Component" },
    { href: "/foundations/design-tokens/", title: "Design tokens", tag: "Foundation" },
    { href: "/ai-tools/", title: "AI & Tools", tag: "Guide" },
    { href: "/llm.txt", title: "llm.txt", tag: "Resource", external: true },
    {
        href: "https://github.com/pelagornis/refineui-system-icons",
        title: "System icons",
        tag: "External",
        external: true,
    },
    { href: "/development/motion/", title: "Motion roles", tag: "Development" },
] as const;

function docsHref(href: string): string {
    return /^https?:\/\//.test(href) ? href : withBase(href);
}

export default function DocsHome() {
    return (
        <Stack gap="sizeXXXLarge" data-refineui-home className="w-full min-w-0">
            <section data-refineui-home-hero className="relative isolate">
                <HeroBackdrop />
                <Stack gap="sizeXXLarge" data-refineui-home-hero-inner className="relative min-w-0">
                    <Stack gap="sizeXXLarge" data-refineui-home-hero-copy className="min-w-0">
                        <Stack gap="sizeLarge">
                            <HomeHeroHeadline />
                            <Text
                                as="p"
                                variant="bodyLg"
                                data-refineui-home-lead
                                className="m-0 text-refineui-alias-foreground-secondary"
                            >
                                Documentation rendered with the same packages as product — precise,
                                token-driven, and interactive.
                            </Text>
                        </Stack>
                        <Stack direction="row" align="center" gap="sizeMedium" wrap>
                            <a href={docsHref("/development/installation/")} data-refineui-home-cta="primary">
                                Get started
                            </a>
                            <Link href={docsHref("/components/")}>Browse components</Link>
                        </Stack>
                    </Stack>
                    <HomeHeroVideo />
                </Stack>
            </section>

            <Stack gap="sizeLarge" className="w-full min-w-0">
                <Text as="h2" variant="titleMd" className="m-0">
                    Start here
                </Text>
                <Grid minItem="foundationSize3200" gap="sizeLarge">
                    {PATHWAYS.map((path) => (
                        <Box
                            key={path.href}
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
                                    <a href={docsHref(path.href)} data-refineui-catalog-link>
                                        {path.title}
                                    </a>
                                </Text>
                                <Text
                                    as="p"
                                    variant="bodyMd"
                                    className="m-0 text-refineui-alias-foreground-secondary"
                                >
                                    {path.description}
                                </Text>
                                <Text
                                    as="span"
                                    variant="labelSm"
                                    className="m-0 text-refineui-alias-foreground-link"
                                >
                                    {path.cta}
                                </Text>
                            </Stack>
                        </Box>
                    ))}
                </Grid>
            </Stack>

            <Stack gap="sizeLarge" className="w-full min-w-0">
                <Stack direction="row" align="end" justify="between" gap="sizeMedium" wrap>
                    <Stack gap="sizeXSmall">
                        <Text as="h2" variant="titleMd" className="m-0">
                            Featured components
                        </Text>
                        <Text as="p" variant="bodyMd" className="m-0 text-refineui-alias-foreground-secondary">
                            Live specimens from @refineui/react — not screenshots.
                        </Text>
                    </Stack>
                    <Link href={docsHref("/components/")} className="shrink-0">
                        View all
                    </Link>
                </Stack>
                <HomeFeaturedComponents />
            </Stack>

            <Stack gap="sizeLarge" className="w-full min-w-0">
                <Text as="h2" variant="titleMd" className="m-0">
                    Explore
                </Text>
                <Box
                    data-refineui-foundation-index
                    background="backgroundSurface"
                    radius="roundedXLarge"
                    border="strokeWidthThin"
                    borderColor="borderDefault"
                    className="overflow-hidden"
                >
                    {EXPLORE.map((item) => (
                        <Stack
                            key={item.href}
                            as="article"
                            data-refineui-foundation-index-row
                            direction="row"
                            gap="sizeMedium"
                            align="center"
                            justify="between"
                            className="relative"
                        >
                            <Text as="h3" variant="subtitleMd" className="m-0 min-w-0">
                                <a
                                    href={docsHref(item.href)}
                                    data-refineui-catalog-link
                                    {...("external" in item && item.external
                                        ? { target: "_blank", rel: "noreferrer" }
                                        : undefined)}
                                >
                                    {item.title}
                                </a>
                            </Text>
                            <Text
                                as="span"
                                variant="labelSm"
                                className="m-0 shrink-0 text-refineui-alias-foreground-tertiary uppercase tracking-wide"
                            >
                                {item.tag}
                            </Text>
                        </Stack>
                    ))}
                </Box>
            </Stack>
        </Stack>
    );
}
