import { Link } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function LinkPreview() {
    return (
        <Looks>
            <Look>
                <Link href="#">Documentation</Link>
            </Look>
        </Looks>
    );
}
