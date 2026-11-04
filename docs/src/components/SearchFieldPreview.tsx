import {
    SearchField,
    SearchFieldClear,
    SearchFieldIcon,
    SearchFieldInput,
    Stack,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

const SIZES = [
    { size: "sm", label: "Small" },
    { size: "md", label: "Medium" },
    { size: "lg", label: "Large" },
] as const;

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
            <Look caption="Sizes" align="stretch">
                <Stack gap="sizeSmall">
                    {SIZES.map(({ size, label }) => (
                        <SearchField key={size} size={size} aria-label={`Search (${label})`}>
                            <SearchFieldIcon />
                            <SearchFieldInput placeholder={label} />
                            <SearchFieldClear />
                        </SearchField>
                    ))}
                </Stack>
            </Look>
        </Looks>
    );
}
