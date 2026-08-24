import { Button } from "@refineui/react";
import { Cluster, Look, Looks } from "../docs-ui";

/** Compact catalog specimen — full docs live in ButtonDocs. */
export default function ButtonPreview() {
    return (
        <Looks>
            <Look size="compact">
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
