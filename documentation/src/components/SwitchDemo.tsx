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
                    <Switch checked={off} onCheckedChange={setOff} />
                    <Switch checked={on} onCheckedChange={setOn} />
                </Cluster>
            </Look>
        </Looks>
    );
}
