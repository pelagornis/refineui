import { Box, Grid, Stack, Text } from "@refineui/react";
import { withBase } from "../../lib/docs-path";

const INDEXES = [
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
] as const;

const TOOLS = [
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
] as const;

function docsHref(href: string): string {
    return withBase(href);
}

export default function AiToolsCatalog() {
    return (
        <Stack gap="sizeXXXLarge" data-refineui-ai-tools-catalog className="w-full min-w-0">
            <Grid minItem="foundationSize3200" gap="sizeLarge">
                {INDEXES.map((item) => (
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
                                <a href={docsHref(item.href)} data-refineui-catalog-link>
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
                    Agent tooling
                </Text>
                <Box
                    data-refineui-foundation-index
                    background="backgroundSurface"
                    radius="roundedXLarge"
                    border="strokeWidthThin"
                    borderColor="borderDefault"
                    className="overflow-hidden"
                >
                    {TOOLS.map((item) => (
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
                                <a href={docsHref(item.href)} data-refineui-catalog-link>
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
