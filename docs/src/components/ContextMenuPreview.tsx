import { componentSizes, iconSizes } from "@refineui/tokens";
import { Button, ContextMenu, WebIcon } from "@refineui/react";
import { menuStyles } from "../../../packages/react/src/components/Menu/style";
import { Look, Looks } from "./PreviewFrame";

function MenuGlyph({ name }: { name: string }) {
    return <WebIcon name={name} size={iconSizes.small} color="currentColor" aria-hidden />;
}

function MenuItems() {
    return (
        <>
            <ContextMenu.Section>File</ContextMenu.Section>
            <ContextMenu.Item startIcon={<MenuGlyph name="add" />} shortcut="⌘N">
                New
            </ContextMenu.Item>
            <ContextMenu.Item startIcon={<MenuGlyph name="folder-open" />} shortcut="⌘O">
                Open…
            </ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item startIcon={<MenuGlyph name="copy" />} shortcut="⌘C">
                Copy
            </ContextMenu.Item>
            <ContextMenu.Item startIcon={<MenuGlyph name="delete" />} shortcut="⌘⌫">
                Delete
            </ContextMenu.Item>
        </>
    );
}

export default function ContextMenuPreview() {
    return (
        <Looks>
            <Look>
                <div className="flex flex-wrap items-start gap-8">
                    <ContextMenu.Root>
                        <div
                            data-refineui="menu"
                            className={menuStyles.list}
                            style={{ width: componentSizes.menuPanelWidth }}
                        >
                            <MenuItems />
                        </div>
                    </ContextMenu.Root>
                    <ContextMenu.Root>
                        <ContextMenu.Trigger asChild>
                            <Button type="button" variant="secondary">
                                Right click
                            </Button>
                        </ContextMenu.Trigger>
                        <ContextMenu.Portal>
                            <ContextMenu.Content>
                                <MenuItems />
                                <ContextMenu.Separator />
                                <ContextMenu.Sub>
                                    <ContextMenu.SubTrigger>More</ContextMenu.SubTrigger>
                                    <ContextMenu.Portal>
                                        <ContextMenu.SubContent>
                                            <ContextMenu.Item>Rename</ContextMenu.Item>
                                            <ContextMenu.Item>Move</ContextMenu.Item>
                                        </ContextMenu.SubContent>
                                    </ContextMenu.Portal>
                                </ContextMenu.Sub>
                            </ContextMenu.Content>
                        </ContextMenu.Portal>
                    </ContextMenu.Root>
                </div>
            </Look>
        </Looks>
    );
}
