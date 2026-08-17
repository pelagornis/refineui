import { Button } from "@refineui/react";
import { Cluster, Look, Looks } from "./PreviewFrame";

export default function ButtonPreview() {
    return (
        <Looks>
            <Look>
                <Cluster>
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                </Cluster>
            </Look>
        </Looks>
    );
}
