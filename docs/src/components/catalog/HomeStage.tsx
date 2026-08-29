import { useState } from "react";
import {
    Badge,
    Box,
    Button,
    Input,
    Stack,
    Switch,
} from "@refineui/react";

export function HomeStage() {
    const [enabled, setEnabled] = useState(true);

    return (
        <Box
            data-refineui-home-stage
            background="backgroundSurface"
            radius="roundedXLarge"
            border="strokeWidthThin"
            borderColor="borderSubtle"
            padding="sizeXLarge"
            className="w-full"
        >
            <Stack gap="sizeLarge">
                <Stack direction="row" gap="sizeSmall" align="center" wrap>
                    <Button variant="primary" size="md" tabIndex={-1}>
                        Continue
                    </Button>
                    <Button variant="secondary" size="md" tabIndex={-1}>
                        Cancel
                    </Button>
                    <Badge variant={enabled ? "success" : "neutral"}>
                        {enabled ? "Live" : "Off"}
                    </Badge>
                </Stack>
                <Input
                    size="md"
                    placeholder="Search components…"
                    defaultValue=""
                    tabIndex={-1}
                    aria-hidden
                    readOnly
                />
                <Stack direction="row" align="center" justify="between" gap="sizeMedium">
                    <Stack direction="row" gap="sizeXSmall" aria-hidden>
                        <Box className="size-refineui-size-large rounded-refineui-circle bg-refineui-alias-background-brand" />
                        <Box className="size-refineui-size-large rounded-refineui-circle bg-refineui-alias-background-surface-selected" />
                        <Box className="size-refineui-size-large rounded-refineui-circle border-refineui-hairline border-refineui-alias-border-default bg-refineui-alias-background-primary" />
                    </Stack>
                    <Switch
                        checked={enabled}
                        onCheckedChange={setEnabled}
                        aria-label="Live preview"
                    />
                </Stack>
            </Stack>
        </Box>
    );
}
