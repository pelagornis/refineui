import { useState } from "react";
import { iconSizes } from "@refineui/tokens";
import {
    Button,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandGroupHeading,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
    WebIcon,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

function Glyph({ name }: { name: string }) {
    return <WebIcon name={name} size={iconSizes.small} color="currentColor" aria-hidden />;
}

export default function CommandPreview() {
    const [open, setOpen] = useState(false);

    return (
        <Looks>
            <Look>
                <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
                    Open
                </Button>
                <CommandDialog open={open} onOpenChange={setOpen}>
                    <CommandInput placeholder="Search commands…" />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            <CommandGroupHeading>Suggestions</CommandGroupHeading>
                            <CommandItem value="calendar" startIcon={<Glyph name="calendar" />}>
                                Calendar
                                <CommandShortcut>⌘K</CommandShortcut>
                            </CommandItem>
                            <CommandItem value="search-emoji" startIcon={<Glyph name="emoji" />}>
                                Search Emoji
                            </CommandItem>
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup>
                            <CommandGroupHeading>Settings</CommandGroupHeading>
                            <CommandItem value="settings" startIcon={<Glyph name="settings" />}>
                                Settings
                                <CommandShortcut>⌘S</CommandShortcut>
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </CommandDialog>
            </Look>
        </Looks>
    );
}
