import { useState } from "react";
import { Switch } from "@refineui/react";
import { Cluster, Look, Looks } from "./PreviewFrame";

export default function SwitchDemo() {
    const [off, setOff] = useState(false);
    const [on, setOn] = useState(true);

    return (
        <Looks>
            <Look>
                <Cluster>
                    <Switch checked={off} onCheckedChange={setOff} aria-label="Off" />
                    <Switch checked={on} onCheckedChange={setOn} aria-label="On" />
                    <Switch checked={false} disabled aria-label="Disabled off" />
                    <Switch checked={true} disabled aria-label="Disabled on" />
                </Cluster>
            </Look>
        </Looks>
    );
}
