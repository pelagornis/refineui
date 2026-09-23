import { iconSizes } from "@refineui/tokens";
import {
    Button,
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuPortal,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
    WebIcon,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

function MenuGlyph({ name }: { name: string }) {
    return <WebIcon name={name} size={iconSizes.small} color="currentColor" aria-hidden />;
}

function MenuItems() {
    return (
        <>
            <ContextMenuLabel>File</ContextMenuLabel>
            <ContextMenuItem startIcon={<MenuGlyph name="add" />} shortcut="⌘N">
                New
            </ContextMenuItem>
            <ContextMenuItem startIcon={<MenuGlyph name="folder-open" />} shortcut="⌘O">
                Open…
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem startIcon={<MenuGlyph name="copy" />} shortcut="⌘C">
                Copy
            </ContextMenuItem>
            <ContextMenuItem startIcon={<MenuGlyph name="delete" />} shortcut="⌘⌫">
                Delete
            </ContextMenuItem>
        </>
    );
}

export default function ContextMenuPreview() {
    return (
        <Looks>
            <Look>
                <ContextMenu>
                    <ContextMenuTrigger asChild>
                        <Button type="button" variant="secondary">
                            Right click
                        </Button>
                    </ContextMenuTrigger>
                    <ContextMenuPortal>
                        <ContextMenuContent>
                            <MenuItems />
                            <ContextMenuSeparator />
                            <ContextMenuSub>
                                <ContextMenuSubTrigger>More</ContextMenuSubTrigger>
                                <ContextMenuPortal>
                                    <ContextMenuSubContent>
                                        <ContextMenuItem>Rename</ContextMenuItem>
                                        <ContextMenuItem>Move</ContextMenuItem>
                                    </ContextMenuSubContent>
                                </ContextMenuPortal>
                            </ContextMenuSub>
                        </ContextMenuContent>
                    </ContextMenuPortal>
                </ContextMenu>
            </Look>
        </Looks>
    );
}
