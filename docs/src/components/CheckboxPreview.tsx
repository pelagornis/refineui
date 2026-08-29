import { Checkbox } from "@refineui/react";
import { Cluster, Look, Looks } from "./PreviewFrame";

export default function CheckboxPreview() {
    return (
        <Looks>
            <Look>
                <Cluster>
                    <Checkbox defaultChecked label="Checked" />
                    <Checkbox label="Unchecked" />
                </Cluster>
            </Look>
        </Looks>
    );
}
