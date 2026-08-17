import {
    Avatar,
    AvatarGroup,
    AvatarIcon,
    AvatarImage,
    AvatarText,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

const portrait = "https://avatars.githubusercontent.com/u/108743931?s=200&v=4";

export default function AvatarsPreview() {
    return (
        <Looks>
            <Look>
                <AvatarGroup layout="stack">
                    <Avatar>
                        <AvatarImage src={portrait} alt="User" />
                    </Avatar>
                    <Avatar color="neutral">
                        <AvatarIcon name="person" />
                    </Avatar>
                    <Avatar color="orange">
                        <AvatarText>PL</AvatarText>
                    </Avatar>
                    <Avatar color="red">
                        <AvatarIcon name="person" />
                    </Avatar>
                    <Avatar>
                        <AvatarIcon name="more-horizontal" />
                    </Avatar>
                </AvatarGroup>
            </Look>
        </Looks>
    );
}
