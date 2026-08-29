import { Avatars } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

const portrait = "https://avatars.githubusercontent.com/u/108743931?s=200&v=4";

const team = [
    { src: portrait, alt: "Member 1" },
    { src: portrait, alt: "Member 2" },
    { src: portrait, alt: "Member 3" },
    { src: portrait, alt: "Member 4" },
    { src: portrait, alt: "Member 5" },
];

export default function AvatarsPreview() {
    return (
        <Looks>
            <Look caption="Stack">
                <Avatars avatars={team} max={3} layout="stack" />
            </Look>
            <Look caption="Spread">
                <Avatars avatars={team.slice(0, 4)} layout="spread" />
            </Look>
        </Looks>
    );
}
