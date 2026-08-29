import { Badge } from "@refineui/react";
import { Cluster, Look, Looks } from "./PreviewFrame";

export default function BadgePreview() {
    return (
        <Looks>
            <Look>
                <Cluster>
                    <Badge variant="default">Default</Badge>
                    <Badge variant="neutral">Neutral</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="danger">Danger</Badge>
                </Cluster>
            </Look>
        </Looks>
    );
}
