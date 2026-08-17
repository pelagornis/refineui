import { iconSizes } from "@refineui/tokens";
import {
    Avatar,
    Badge,
    Button,
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardHeaderMain,
    CardTitle,
    Stack,
    Text,
    WebIcon,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function CardPreview() {
    return (
        <Looks>
            <Look align="stretch">
                <Card variant="elevated" className="w-full">
                    <CardHeader>
                        <CardHeaderMain>
                            <Stack direction="row" gap="sizeXSmall" align="center">
                                <Badge variant="default">New</Badge>
                                <Text variant="captionMd" className="text-refineui-alias-foreground-tertiary">
                                    Design system
                                </Text>
                            </Stack>
                            <CardTitle>RefineUI is now available</CardTitle>
                            <CardDescription>Ship product UI with tokens, React, and Web Kit parity.</CardDescription>
                        </CardHeaderMain>
                        <CardAction>
                            <Button type="button" variant="ghost" size="sm" layout="icon" aria-label="More actions">
                                <WebIcon name="more-horizontal" size={iconSizes.small} color="currentColor" aria-hidden />
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Stack gap="sizeMedium">
                            <Text variant="bodyMd" className="m-0 text-refineui-alias-foreground-secondary">
                                Utilities, React components, and shared foundations for building consistent web
                                applications.
                            </Text>
                            <Stack direction="row" gap="sizeXSmall" align="center">
                                <Avatar size="xs" color="blue" alt="Pelagornis" />
                                <Text variant="captionLg" className="text-refineui-alias-foreground-tertiary">
                                    Pelagornis Inc · 7 hours ago
                                </Text>
                            </Stack>
                        </Stack>
                    </CardContent>
                    <CardFooter>
                        <Button type="button" size="sm" variant="outline">
                            Learn more
                        </Button>
                        <Button type="button" size="sm" variant="primary">
                            Get started
                        </Button>
                    </CardFooter>
                </Card>
            </Look>
        </Looks>
    );
}
