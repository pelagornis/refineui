import { Box, Grid, Stack, Text } from "@refineui/react";
import { withLocalePath, type DocsLocaleCode } from "../../lib/docs-locale";

const INDEXES = {
    en: [
        {
            href: "/DESIGN.md",
            name: "DESIGN.md",
            hint: "Stitch-compatible visual identity and agent rules",
        },
        {
            href: "/llms.txt",
            name: "llms.txt",
            hint: "Curated link index for agents and tooling",
        },
        {
            href: "/llm.txt",
            name: "llm.txt",
            hint: "Expanded plain-text reference",
        },
    ],
    ko: [
        {
            href: "/DESIGN.md",
            name: "DESIGN.md",
            hint: "Stitch 호환 비주얼 아이덴티티와 에이전트 규칙",
        },
        {
            href: "/llms.txt",
            name: "llms.txt",
            hint: "에이전트·도구용 큐레이션 링크 인덱스",
        },
        {
            href: "/llm.txt",
            name: "llm.txt",
            hint: "확장된 평문 레퍼런스",
        },
    ],
} as const;

const TOOLS = {
    en: [
        {
            href: "/ai-tools/skill/",
            name: "Skill",
            hint: "Agent routing, doc index, and codegen rules",
        },
        {
            href: "/ai-tools/doctor/",
            name: "Doctor",
            hint: "Read-only workspace diagnostics",
        },
        {
            href: "/ai-tools/mcp/",
            name: "MCP",
            hint: "@refineui/mcp server for doc search and design rules",
        },
    ],
    ko: [
        {
            href: "/ai-tools/skill/",
            name: "Skill",
            hint: "에이전트 라우팅, 문서 인덱스, 코드젠 규칙",
        },
        {
            href: "/ai-tools/doctor/",
            name: "Doctor",
            hint: "읽기 전용 워크스페이스 진단",
        },
        {
            href: "/ai-tools/mcp/",
            name: "MCP",
            hint: "문서 검색·디자인 규칙용 @refineui/mcp 서버",
        },
    ],
} as const;

function docsHref(href: string, locale: DocsLocaleCode): string {
    return withLocalePath(href, locale);
}

export default function AiToolsCatalog({ locale }: { locale?: DocsLocaleCode }) {
    const lang = locale === "ko" ? "ko" : "en";
    const indexes = INDEXES[lang];
    const tools = TOOLS[lang];
    const toolsTitle = lang === "ko" ? "에이전트 도구" : "Agent tooling";

    return (
        <Stack gap="sizeXXXLarge" data-refineui-ai-tools-catalog className="w-full min-w-0">
            <Grid minItem="foundationSize3200" gap="sizeLarge">
                {indexes.map((item) => (
                    <Box
                        key={item.href}
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
                                <a href={docsHref(item.href, locale)} data-refineui-catalog-link>
                                    {item.name}
                                </a>
                            </Text>
                            <Text variant="bodyMd" className="m-0 text-refineui-alias-foreground-secondary">
                                {item.hint}
                            </Text>
                        </Stack>
                    </Box>
                ))}
            </Grid>

            <Stack gap="sizeLarge" className="w-full min-w-0">
                <Text as="h2" variant="titleMd" className="m-0">
                    {toolsTitle}
                </Text>
                <Box
                    data-refineui-foundation-index
                    background="backgroundSurface"
                    radius="roundedXLarge"
                    border="strokeWidthThin"
                    borderColor="borderDefault"
                    className="overflow-hidden"
                >
                    {tools.map((item) => (
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
