import {
    Avatar,
    AvatarImage,
    Badge,
    Box,
    Button,
    Input,
    Stack,
    WebIcon,
} from "@refineui/react";
import { iconSizes } from "@refineui/tokens";
import { CatalogCard, CatalogGrid } from "./CatalogCard";

const PORTRAIT = "https://avatars.githubusercontent.com/u/108743931?s=200&v=4";

const SHOWCASE_TILES = [
    {
        href: "/components/",
        name: "Web",
        preview: (
            <Stack gap="sizeSmall" align="center">
                <Button variant="primary" size="sm" tabIndex={-1}>
                    Continue
                </Button>
                <Input size="sm" placeholder="Search" defaultValue="" tabIndex={-1} aria-hidden readOnly />
            </Stack>
        ),
    },
    {
        href: "/foundations/design-tokens/",
        name: "Tokens",
        preview: (
            <Stack direction="row" gap="sizeXSmall" align="center">
                <Box className="size-refineui-size-x-large rounded-refineui-circle bg-refineui-alias-background-brand" />
                <Box className="size-refineui-size-x-large rounded-refineui-circle bg-refineui-alias-background-surface-selected" />
                <Box className="size-refineui-size-x-large rounded-refineui-circle bg-refineui-alias-background-primary-hover" />
                <Box className="size-refineui-size-x-large rounded-refineui-circle border-refineui-hairline border-refineui-alias-border-default bg-refineui-alias-background-primary" />
            </Stack>
        ),
    },
    {
        href: "https://github.com/pelagornis/refineui-system-icons",
        name: "Icons",
        external: true,
        preview: (
            <Stack direction="row" gap="sizeMedium" align="center">
                <WebIcon name="home" size={iconSizes.small} color="currentColor" />
                <WebIcon name="search" size={iconSizes.small} color="currentColor" />
                <WebIcon name="settings" size={iconSizes.small} color="currentColor" />
                <WebIcon name="person" size={iconSizes.small} color="currentColor" />
            </Stack>
        ),
    },
    {
        href: "/components/avatars/",
        name: "Patterns",
        preview: (
            <Stack direction="row" gap="sizeSmall" align="center">
                <Avatar size="sm">
                    <AvatarImage src={PORTRAIT} alt="" />
                </Avatar>
                <Badge variant="success">Live</Badge>
            </Stack>
        ),
    },
] as const;

export function HomeShowcaseTiles() {
    return (
        <CatalogGrid>
            {SHOWCASE_TILES.map((tile) => (
                <CatalogCard
                    key={tile.href}
                    href={tile.href}
                    name={tile.name}
                    preview={tile.preview}
                    {...("external" in tile && tile.external
                        ? { external: true }
                        : undefined)}
                />
            ))}
        </CatalogGrid>
    );
}
