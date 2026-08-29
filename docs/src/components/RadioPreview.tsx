import { Radio } from "@refineui/react";
import { Cluster, Look, Looks } from "./PreviewFrame";

export default function RadioPreview() {
    return (
        <Looks>
            <Look>
                <Cluster>
                    <Radio name="radio-preview" value="a" defaultChecked label="Option A" />
                    <Radio name="radio-preview" value="b" label="Option B" />
                </Cluster>
            </Look>
        </Looks>
    );
}
