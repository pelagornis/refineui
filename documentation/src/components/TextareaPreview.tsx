import { Textarea } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function TextareaPreview() {
    return (
        <Looks>
            <Look align="stretch">
                <Textarea placeholder="Write a message…" rows={4} fullWidth />
            </Look>
        </Looks>
    );
}
