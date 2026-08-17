import { Avatar, AvatarImage } from "@refineui/react";
import { Cluster, Look, Looks } from "./PreviewFrame";

const portrait = "https://avatars.githubusercontent.com/u/108743931?s=200&v=4";

export default function AvatarStatusPreview() {
    return (
        <Looks>
            <Look>
                <Cluster>
                    <Avatar showStatus status="online">
                        <AvatarImage src={portrait} alt="" />
                    </Avatar>
                    <Avatar showStatus status="away">
                        <AvatarImage src={portrait} alt="" />
                    </Avatar>
                    <Avatar showStatus status="unavailable">
                        <AvatarImage src={portrait} alt="" />
                    </Avatar>
                    <Avatar showStatus status="offline">
                        <AvatarImage src={portrait} alt="" />
                    </Avatar>
                </Cluster>
            </Look>
        </Looks>
    );
}
