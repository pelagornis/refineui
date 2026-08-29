import { Spinner } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function SpinnerPreview() {
    return (
        <Looks>
            <Look>
                <Spinner size="md" />
            </Look>
        </Looks>
    );
}
