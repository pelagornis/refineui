import { Input } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function InputPreview() {
    return (
        <Looks>
            <Look align="stretch">
                <Input placeholder="Email address" fullWidth />
            </Look>
        </Looks>
    );
}
