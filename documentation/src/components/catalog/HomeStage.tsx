import { useState } from "react";
import {
    Avatar,
    AvatarGroup,
    AvatarIcon,
    AvatarImage,
    AvatarText,
    Badge,
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardHeaderMain,
    CardTitle,
    Progress,
    Slider,
    Stack,
    Switch,
} from "@refineui/react";

const PORTRAIT = "https://avatars.githubusercontent.com/u/108743931?s=200&v=4";

export function HomeStage() {
    const [live, setLive] = useState(true);
    const [motion, setMotion] = useState(64);

    return (
        <div data-refineui-home-stage>
            <Card variant="elevated">
                <CardHeader>
                    <CardHeaderMain>
                        <Stack direction="row" gap="sizeSmall" align="center">
                            <Avatar>
                                <AvatarImage src={PORTRAIT} alt="" />
                            </Avatar>
                            <Stack gap="sizeXXXSmall">
                                <CardTitle>RefineUI</CardTitle>
                                <CardDescription>Foundation to React</CardDescription>
                            </Stack>
                        </Stack>
                    </CardHeaderMain>
                    <CardAction>
                        <Switch checked={live} onCheckedChange={setLive} aria-label="Live" />
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <Stack gap="sizeLarge">
                        <Stack direction="row" align="center" justify="between" gap="sizeMedium">
                            <Badge variant={live ? "success" : "neutral"}>{live ? "Live" : "Off"}</Badge>
                            <AvatarGroup layout="stack">
                                <Avatar>
                                    <AvatarImage src={PORTRAIT} alt="" />
                                </Avatar>
                                <Avatar color="neutral">
                                    <AvatarIcon name="person" />
                                </Avatar>
                                <Avatar color="orange">
                                    <AvatarText>PL</AvatarText>
                                </Avatar>
                            </AvatarGroup>
                        </Stack>
                        <Slider
                            value={motion}
                            min={0}
                            max={100}
                            size="md"
                            disabled={!live}
                            aria-label="Motion"
                            onChange={setMotion}
                        />
                        <Progress value={live ? motion : 0} size="lg" />
                    </Stack>
                </CardContent>
            </Card>
        </div>
    );
}
