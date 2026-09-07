import { Box, Grid, Stack, Text } from "@refineui/react";
import { withLocalePath, type DocsLocaleCode } from "../../lib/docs-locale";

const ICONOGRAPHY_SITE = "https://github.com/pelagornis/refineui-system-icons";

const AREAS = {
    en: [
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
    ],
    ko: [
        {
            href: "/foundations/design-tokens/",
            name: "디자인 토큰",
            hint: "컬러, 타이포, 스페이스, 라디우스, 모션, 스택킹",
            external: false,
        },
        {
            href: "/foundations/layout/",
            name: "레이아웃",
            hint: "컨테이너, 그리드, 정렬, 반응형 규칙",
            external: false,
        },
        {
            href: ICONOGRAPHY_SITE,
            name: "아이코노그래피",
            hint: "시스템 아이콘 — refineui-system-icons로 이동",
            external: true,
        },
    ],
} as const;

const TOKENS = {
    en: [
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
    ],
    ko: [
        { href: "/foundations/color/", name: "컬러", hint: "별칭과 팔레트" },
        { href: "/foundations/typography/", name: "타이포그래피", hint: "시맨틱 텍스트 역할" },
        { href: "/foundations/spacing/", name: "스페이싱", hint: "갭과 패딩" },
        { href: "/foundations/sizing/", name: "사이징", hint: "컨트롤·레이아웃 크기" },
        { href: "/foundations/radius/", name: "라디우스", hint: "모서리" },
        { href: "/foundations/border/", name: "보더", hint: "스트로크 두께" },
        { href: "/foundations/elevation/", name: "엘리베이션", hint: "테마 그림자" },
        { href: "/foundations/opacity/", name: "투명도", hint: "비활성 워시·오버레이" },
        { href: "/foundations/motion/", name: "모션", hint: "지속 시간, 이징, 스케일" },
        { href: "/foundations/z-index/", name: "Z-index", hint: "스택킹 레이어" },
    ],
} as const;

function docsHref(href: string, locale: DocsLocaleCode): string {
    return /^https?:\/\//.test(href) ? href : withLocalePath(href, locale);
}

export default function FoundationCatalog({ locale }: { locale?: DocsLocaleCode }) {
    const lang = locale === "ko" ? "ko" : "en";
    const areas = AREAS[lang];
    const tokens = TOKENS[lang];
    const indexTitle = lang === "ko" ? "디자인 토큰 인덱스" : "Design token index";

    return (
        <Stack gap="sizeXXXLarge" data-refineui-foundation-catalog className="w-full min-w-0">
            <Grid minItem="foundationSize3200" gap="sizeLarge">
                {areas.map((area) => (
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
                                    href={area.external ? area.href : docsHref(area.href, locale)}
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
                    {indexTitle}
                </Text>
                <Box
                    data-refineui-foundation-index
                    background="backgroundSurface"
                    radius="roundedXLarge"
                    border="strokeWidthThin"
                    borderColor="borderDefault"
                    className="overflow-hidden"
                >
                    {tokens.map((item) => (
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
                                <a href={docsHref(item.href, locale)} data-refineui-catalog-link>
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
