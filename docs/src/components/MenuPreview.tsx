import { iconSizes } from "@refineui/tokens";
import {
    Button,
    Menu,
    MenuDivider,
    MenuItem,
    MenuList,
    MenuPopover,
    MenuSection,
    MenuTrigger,
    WebIcon,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

function MenuGlyph({ name }: { name: string }) {
    return <WebIcon name={name} size={iconSizes.small} color="currentColor" aria-hidden />;
}

export default function MenuPreview() {
    return (
        <Looks>
            <Look>
                <Menu>
                    <MenuTrigger>
                        <Button type="button" variant="secondary">
                            Open
                        </Button>
                    </MenuTrigger>
                    <MenuPopover>
                        <MenuList>
                            <MenuSection>File</MenuSection>
                            <MenuItem startIcon={<MenuGlyph name="add" />} shortcut="⌘N">
                                New
                            </MenuItem>
                            <MenuItem startIcon={<MenuGlyph name="folder-open" />} shortcut="⌘O">
                                Open…
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem startIcon={<MenuGlyph name="copy" />} shortcut="⌘C">
                                Copy
                            </MenuItem>
                            <MenuItem startIcon={<MenuGlyph name="delete" />} shortcut="⌘⌫">
                                Delete
                            </MenuItem>
                        </MenuList>
                    </MenuPopover>
                </Menu>
            </Look>
        </Looks>
    );
}
