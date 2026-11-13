import { Marker, MarkerContent, MarkerIcon, Spinner, Stack, WebIcon } from "@refineui/react";
import { iconSizes } from "@refineui/tokens";
import { Look, Looks } from "./PreviewFrame";

export default function MarkerDemo() {
    return (
        <Looks>
            <Look align="stretch">
                <Stack gap="sizeXXLarge" className="w-full">
                    <Marker>
                        <MarkerIcon><WebIcon name="git" size={iconSizes.small} color="currentColor" aria-hidden /></MarkerIcon>
                        <MarkerContent>Switched to a new branch</MarkerContent>
                    </Marker>
                    <Marker role="status">
                        <MarkerIcon><Spinner size="sm" role="presentation" /></MarkerIcon>
                        <MarkerContent>Thinking...</MarkerContent>
                    </Marker>
                    <Marker variant="divider"><MarkerContent>Conversation compacted</MarkerContent></Marker>
                    <Marker>
                        <MarkerIcon><WebIcon name="search" size={iconSizes.small} color="currentColor" aria-hidden /></MarkerIcon>
                        <MarkerContent>Explored 4 files</MarkerContent>
                    </Marker>
                </Stack>
            </Look>
        </Looks>
    );
}
