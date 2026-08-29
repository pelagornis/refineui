import type { ReactNode } from "react";
import {
    Button,
    Dropdown,
    DropdownContent,
    DropdownGroup,
    DropdownItem,
    DropdownLabel,
    DropdownPortal,
    DropdownSeparator,
    DropdownShortcut,
    DropdownTrigger,
    WebIcon,
} from "@refineui/react";
import { iconSizes } from "@refineui/tokens";
import { Look, Looks } from "./PreviewFrame";

function RowIcon({ name }: { name: string }) {
    return <WebIcon name={name} size={iconSizes.small} color="currentColor" aria-hidden />;
}

function ItemLabel({ icon, children }: { icon: string; children: ReactNode }) {
    return (
        <span className="flex min-w-0 items-center gap-refineui-size-x-small">
            <RowIcon name={icon} />
            <span className="truncate">{children}</span>
        </span>
    );
}

export default function DropdownDemo() {
    return (
        <Looks>
            <Look>
                <Dropdown>
                    <DropdownTrigger>
                        <Button type="button" variant="secondary">
                            Account
                        </Button>
                    </DropdownTrigger>
                    <DropdownPortal>
                        <DropdownContent>
                            <DropdownGroup>
                                <DropdownLabel>Account</DropdownLabel>
                                <DropdownItem>
                                    <ItemLabel icon="person">Profile</ItemLabel>
                                    <DropdownShortcut>⇧⌘P</DropdownShortcut>
                                </DropdownItem>
                                <DropdownItem>
                                    <ItemLabel icon="settings">Settings</ItemLabel>
                                    <DropdownShortcut>⌘,</DropdownShortcut>
                                </DropdownItem>
                            </DropdownGroup>
                            <DropdownSeparator />
                            <DropdownItem>
                                <ItemLabel icon="power">Log out</ItemLabel>
                                <DropdownShortcut>⇧⌘Q</DropdownShortcut>
                            </DropdownItem>
                        </DropdownContent>
                    </DropdownPortal>
                </Dropdown>
            </Look>
        </Looks>
    );
}
