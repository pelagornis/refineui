import { Badge, Button, Input, Stack, Text } from "@refineui/react";
import { DemoBlock } from "../layout/DemoBlock";
import { CatalogCard, CatalogGrid } from "./CatalogCard";
import ComponentCatalog from "./ComponentCatalog";

export default function DocsHome() {
    return (
        <Stack gap="sizeXXXLarge" data-refineui-home>
            <CatalogGrid>
                <CatalogCard
                    href="/components/"
                    name="Components"
                    preview={
                        <Stack direction="row" gap="sizeSmall" align="center">
                            <Button type="button" variant="primary">
                                Primary
                            </Button>
                            <Badge variant="success">Ready</Badge>
                        </Stack>
                    }
                />
                <CatalogCard
                    href="/layout/"
                    name="Layout"
                    preview={
                        <Stack gap="sizeSmall" className="w-full">
                            <DemoBlock tone={0}>Stack</DemoBlock>
                            <DemoBlock tone={1}>Grid</DemoBlock>
                        </Stack>
                    }
                />
                <CatalogCard
                    href="/intro/"
                    name="Get started"
                    preview={<Input placeholder="bun add @refineui/react" fullWidth />}
                />
                <CatalogCard
                    href="/guides/packages/"
                    name="Guides"
                    preview={
                        <Text variant="bodyMd" className="text-refineui-alias-foreground-secondary">
                            Packages · CLI
                        </Text>
                    }
                />
            </CatalogGrid>
            <Stack gap="sizeLarge">
                <Text as="h2" variant="headingSm" className="m-0">
                    Components
                </Text>
                <ComponentCatalog />
            </Stack>
        </Stack>
    );
}
