import { useState } from "react";
import { SpinButton } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function SpinButtonDemo() {
    const [value, setValue] = useState(5);

    return (
        <Looks>
            <Look align="stretch">
                <SpinButton value={value} onChange={setValue} min={0} max={10} step={1} size="md" />
            </Look>
        </Looks>
    );
}
