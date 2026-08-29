import { Tag } from "@refineui/react";
import { Cluster, Look, Looks } from "./PreviewFrame";

export default function TagDemo() {
    return (
        <Looks>
            <Look>
                <Cluster>
                    <Tag variant="default">Default</Tag>
                    <Tag variant="outline">Outline</Tag>
                    <Tag variant="filled">Filled</Tag>
                    <Tag onRemove={() => {}}>Removable</Tag>
                </Cluster>
            </Look>
        </Looks>
    );
}
