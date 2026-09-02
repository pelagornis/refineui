import { useCallback, useRef, type PointerEvent } from "react";
import { Box, Grid, Stack, Text } from "@refineui/react";
import { withBase } from "../../lib/docs-path";
import { HeroBackdrop } from "../../resources/home";
import { HomeHeroHeadline } from "./HomeHeroHeadline";

const PATHWAYS = [
    {
        href: "/foundations/",
        title: "Foundations",
        description: "Color, type, space, motion, and elevation tokens.",
    },
    {
        href: "/components/",
        title: "Components",
        description: "Live React specimens — layout, forms, navigation, and data.",
    },
    {
        href: "/development/",
        title: "Development",
        description: "Installation, theming, and motion in product code.",
    },
    {
        href: "/ai-tools/",
        title: "AI & Tools",
        description: "llm indexes, agent skill, Doctor, and MCP.",
    },
] as const;

const POINTER_CENTER = "0.5";

function docsHref(href: string): string {
    return /^https?:\/\//.test(href) ? href : withBase(href);
}

export default function DocsHome() {
    const heroRef = useRef<HTMLElement>(null);

    const setPointer = useCallback((x: string, y: string) => {
        const hero = heroRef.current;
        if (!hero) {
            return;
        }
        hero.style.setProperty("--refineui-home-pointer-x", x);
        hero.style.setProperty("--refineui-home-pointer-y", y);
    }, []);

    const onHeroPointerMove = useCallback(
        (event: PointerEvent<HTMLElement>) => {
            const hero = heroRef.current;
            if (!hero) {
                return;
            }

            const rect = hero.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            setPointer(String(x), String(y));
        },
        [setPointer],
    );

    const onHeroPointerLeave = useCallback(() => {
        setPointer(POINTER_CENTER, POINTER_CENTER);
    }, [setPointer]);

    return (
        <Stack gap="sizeXXLarge" data-refineui-home className="w-full min-w-0">
            <section
                ref={heroRef}
                data-refineui-home-hero
                className="relative isolate overflow-hidden"
                onPointerMove={onHeroPointerMove}
                onPointerLeave={onHeroPointerLeave}
            >
                <HeroBackdrop />
                <Stack
                    gap="sizeXLarge"
                    align="center"
                    data-refineui-home-hero-inner
                    className="relative min-w-0 text-center"
                >
                    <HomeHeroHeadline />
                    <a href={docsHref("/getting-started/")} data-refineui-home-cta="primary">
                        Get started
                    </a>
                </Stack>
            </section>

            <Stack gap="sizeMedium" className="w-full min-w-0">
                <Text as="h2" variant="titleMd" className="m-0">
                    Start here
                </Text>
                <Grid minItem="foundationSize2560" gap="sizeMedium">
                    {PATHWAYS.map((path) => (
                        <Box
                            key={path.href}
                            as="article"
                            data-refineui-foundation-area
                            background="backgroundSurface"
                            radius="roundedXLarge"
                            border="strokeWidthThin"
                            borderColor="borderDefault"
                            padding="sizeLarge"
                            className="relative min-w-0"
                        >
                            <Stack gap="sizeXXSmall">
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
                            </Stack>
                        </Box>
                    ))}
                </Grid>
            </Stack>
        </Stack>
    );
}
