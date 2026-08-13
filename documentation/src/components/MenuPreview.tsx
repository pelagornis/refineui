import { spacings, iconSizes } from "@refineui/tokens";
import {
    Button,
    Menu,
    MenuDivider,
    MenuItem,
    MenuList,
    MenuPopover,
    MenuSection,
    MenuSub,
    MenuSubContent,
    MenuSubTrigger,
    MenuTrigger,
    WebIcon,
} from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

function MenuGlyph({ name }: { name: string }) {
    return <WebIcon name={name} size={iconSizes.small} color="currentColor" aria-hidden />;
}

function SampleMenuList() {
    return (
        <MenuList>
            <MenuSection>File</MenuSection>
            <MenuItem startIcon={<MenuGlyph name="add" />} shortcut="⌘N">
                New
            </MenuItem>
            <MenuItem
                startIcon={<MenuGlyph name="folder-open" />}
                description="Browse local projects"
                shortcut="⌘O"
            >
                Open…
            </MenuItem>
            <MenuItem startIcon={<MenuGlyph name="document" />} disabled>
                Open File
            </MenuItem>
            <MenuDivider />
            <MenuSection>Edit</MenuSection>
            <MenuItem startIcon={<MenuGlyph name="copy" />} shortcut="⌘C">
                Copy
            </MenuItem>
            <MenuItem startIcon={<MenuGlyph name="clipboard" />} shortcut="⌘V">
                Paste
            </MenuItem>
            <MenuItem
                startIcon={<MenuGlyph name="delete" />}
                description="Move to Trash"
                shortcut="⌘⌫"
            >
                Delete
            </MenuItem>
            <MenuDivider />
            <MenuSection>More</MenuSection>
            <MenuSub>
                <MenuSubTrigger startIcon={<MenuGlyph name="settings" />}>Preferences</MenuSubTrigger>
                <MenuSubContent>
                    <MenuItem startIcon={<MenuGlyph name="settings" />}>General</MenuItem>
                    <MenuItem startIcon={<MenuGlyph name="info" />}>Appearance</MenuItem>
                    <MenuItem>Keyboard Shortcuts</MenuItem>
                </MenuSubContent>
            </MenuSub>
            <MenuItem startIcon={<MenuGlyph name="info" />}>About RefineUI</MenuItem>
        </MenuList>
    );
}

export default function MenuPreview() {
    return (
        <PreviewFrame>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr)",
                    gap: spacings.sizeXXLarge,
                    width: "100%",
                    maxWidth: "720px",
                }}
                className="lg:grid-cols-2"
            >
                <section className="flex flex-col gap-refineui-size-medium">
                    <h4 className="m-0 refineui-typo-sub-title-2 text-refineui-alias-foreground-primary">
                        Trigger + Popover
                    </h4>
                    <p className="m-0 refineui-typo-caption-1 text-refineui-alias-foreground-tertiary">
                        Preferences opens a nested submenu
                    </p>
                    <Menu positioning={{ autoSize: true }}>
                        <MenuTrigger>
                            <Button variant="outline">Open menu</Button>
                        </MenuTrigger>
                        <MenuPopover>
                            <SampleMenuList />
                        </MenuPopover>
                    </Menu>
                </section>

                <section className="flex flex-col gap-refineui-size-medium">
                    <h4 className="m-0 refineui-typo-sub-title-2 text-refineui-alias-foreground-primary">
                        Panel composition
                    </h4>
                    <p className="m-0 refineui-typo-caption-1 text-refineui-alias-foreground-tertiary">
                        Section · item · submenu · divider
                    </p>
                    <div style={{ width: "244px", maxWidth: "100%" }}>
                        <SampleMenuList />
                    </div>
                </section>
            </div>
        </PreviewFrame>
    );
}
