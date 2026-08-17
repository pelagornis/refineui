import { Progress } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function ProgressPreview() {
    return (
        <Looks>
            <Look align="stretch">
                <Progress value={60} size="lg" />
            </Look>
        </Looks>
    );
}
