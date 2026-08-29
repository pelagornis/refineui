import { Stack, Text } from "@refineui/react";

export function HomeHeroHeadline() {
    return (
        <Stack as="header" gap="sizeMedium" data-refineui-home-headline className="m-0">
            <Text as="h1" variant="displayLg" id="_top" className="m-0 text-refineui-alias-foreground-primary">
                RefineUI
            </Text>
            <Text
                as="p"
                variant="displayMd"
                className="m-0 text-refineui-alias-foreground-secondary"
            >
                One language from tokens to React.
            </Text>
        </Stack>
    );
}
