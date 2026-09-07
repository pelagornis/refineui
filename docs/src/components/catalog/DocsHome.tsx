import { useCallback, useRef, type PointerEvent } from "react";
import { Box, Grid, Stack, Text } from "@refineui/react";
import { withLocalePath, type DocsLocaleCode } from "../../lib/docs-locale";
import { HeroBackdrop } from "../../resources/home";
import { HomeHeroHeadline } from "./HomeHeroHeadline";

const PATHWAYS = {
    en: [
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
    ],
    ko: [
        {
            href: "/foundations/",
            title: "파운데이션",
            description: "컬러, 타이포, 스페이스, 모션, 엘리베이션 토큰.",
        },
        {
            href: "/components/",
            title: "컴포넌트",
            description: "레이아웃·폼·내비게이션·데이터를 위한 라이브 React 예제.",
        },
        {
            href: "/development/",
            title: "개발",
            description: "제품 코드에서의 설치, 테마, 모션.",
        },
        {
            href: "/ai-tools/",
            title: "AI & 도구",
            description: "llm 인덱스, 에이전트 스킬, Doctor, MCP.",
        },
    ],
} as const;

const POINTER_CENTER = "0.5";

function docsHref(href: string, locale: DocsLocaleCode): string {
    return /^https?:\/\//.test(href) ? href : withLocalePath(href, locale);
}

export type DocsHomeProps = {
    locale?: DocsLocaleCode;
};

export default function DocsHome({ locale }: DocsHomeProps) {
    const heroRef = useRef<HTMLElement>(null);
    const pathways = locale === "ko" ? PATHWAYS.ko : PATHWAYS.en;
    const startHere = locale === "ko" ? "여기서 시작" : "Start here";
    const cta = locale === "ko" ? "시작하기" : "Get started";

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
                    <HomeHeroHeadline locale={locale} />
                    <a href={docsHref("/getting-started/", locale)} data-refineui-home-cta="primary">
                        {cta}
                    </a>
                </Stack>
            </section>

            <Stack gap="sizeMedium" className="w-full min-w-0">
                <Text as="h2" variant="titleMd" className="m-0">
                    {startHere}
                </Text>
                <Grid minItem="foundationSize2560" gap="sizeMedium">
                    {pathways.map((path) => (
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
                                    <a href={docsHref(path.href, locale)} data-refineui-catalog-link>
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
