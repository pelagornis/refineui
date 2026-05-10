import { Button, Menu, MenuDivider, MenuItem, MenuList, MenuPopover, MenuSection, MenuTrigger } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function MenuPreview() {
  return (
    <>
      <PreviewFrame title="Trigger + Popover">
        <Menu positioning={{ autoSize: true }}>
          <MenuTrigger>
            <Button>Toggle menu</Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuSection>Section Header</MenuSection>
              <MenuItem onClick={() => alert("Create new")}>New</MenuItem>
              <MenuItem>New Window</MenuItem>
              <MenuItem disabled>Open File</MenuItem>
              <MenuItem>Open Folder</MenuItem>
              <MenuDivider />
              <MenuSection>Section Header</MenuSection>
              <MenuItem>Save</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </PreviewFrame>

      <PreviewFrame title="Menu only (fixed preview)">
        <div style={{ width: "244px", maxWidth: "100%" }}>
          <MenuList>
            <MenuSection>Section Header</MenuSection>
            <MenuItem>New</MenuItem>
            <MenuItem>New Window</MenuItem>
            <MenuItem disabled>Open File</MenuItem>
            <MenuItem>Open Folder</MenuItem>
            <MenuDivider />
            <MenuSection>Section Header</MenuSection>
            <MenuItem>Save</MenuItem>
            <MenuItem>Save As...</MenuItem>
          </MenuList>
        </div>
      </PreviewFrame>
    </>
  );
}
