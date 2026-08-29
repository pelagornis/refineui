import {
    Avatar,
    AvatarIcon,
    AvatarImage,
    AvatarText,
} from "@refineui/react";
import { Cluster, Look, Looks } from "./PreviewFrame";

const portrait = "https://avatars.githubusercontent.com/u/108743931?s=200&v=4";

export default function AvatarPreview() {
    return (
        <Looks>
            <Look>
                <Cluster>
                    <Avatar>
                        <AvatarImage src={portrait} alt="User" />
                    </Avatar>
                    <Avatar color="neutral">
                        <AvatarIcon name="person" />
                    </Avatar>
                    <Avatar color="orange">
                        <AvatarText>PL</AvatarText>
                    </Avatar>
                </Cluster>
            </Look>
            <Look caption="Sizes">
                <Cluster>
                    <Avatar size="xs">
                        <AvatarImage src={portrait} alt="Extra small" />
                    </Avatar>
                    <Avatar size="sm">
                        <AvatarImage src={portrait} alt="Small" />
                    </Avatar>
                    <Avatar size="md">
                        <AvatarImage src={portrait} alt="Medium" />
                    </Avatar>
                    <Avatar size="lg">
                        <AvatarImage src={portrait} alt="Large" />
                    </Avatar>
                    <Avatar size="xl">
                        <AvatarImage src={portrait} alt="Extra large" />
                    </Avatar>
                </Cluster>
            </Look>
            <Look caption="Status">
                <Cluster>
                    <Avatar showStatus status="online">
                        <AvatarImage src={portrait} alt="Online" />
                    </Avatar>
                    <Avatar showStatus status="away">
                        <AvatarImage src={portrait} alt="Away" />
                    </Avatar>
                    <Avatar showStatus status="unavailable">
                        <AvatarImage src={portrait} alt="Unavailable" />
                    </Avatar>
                    <Avatar showStatus status="offline">
                        <AvatarImage src={portrait} alt="Offline" />
                    </Avatar>
                </Cluster>
            </Look>
        </Looks>
    );
}
