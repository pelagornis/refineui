import {
    SearchField,
    SearchFieldClear,
    SearchFieldIcon,
    SearchFieldInput,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function SearchFieldPreview() {
    return (
        <Looks>
            <Look align="stretch">
                <SearchField>
                    <SearchFieldIcon />
                    <SearchFieldInput placeholder="Search" />
                    <SearchFieldClear />
                </SearchField>
            </Look>
        </Looks>
    );
}
