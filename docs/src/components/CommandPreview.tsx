import { useState } from "react";
import { iconSizes } from "@refineui/tokens";
import {
    Button,
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandGroupHeading,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
    Stack,
    Text,
    WebIcon,
    type CommandSize,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

/** Matches the item icon slot of each Command size. */
const GLYPH_SIZE: Record<CommandSize, number> = {
    sm: iconSizes.xsmall,
    md: iconSizes.small,
    lg: iconSizes.medium,
};

const SIZES = [
    { size: "sm", label: "Small" },
    { size: "md", label: "Medium" },
    { size: "lg", label: "Large" },
] as const;

function Glyph({ name, size }: { name: string; size: CommandSize }) {
    return <WebIcon name={name} size={GLYPH_SIZE[size]} color="currentColor" aria-hidden />;
}

function CommandPreviewItems({ size = "md" }: { size?: CommandSize }) {
    return (
        <>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
                <CommandGroupHeading>Suggestions</CommandGroupHeading>
                <CommandItem value="calendar" startIcon={<Glyph name="calendar" size={size} />}>
                    Calendar
                    <CommandShortcut>⌘K</CommandShortcut>
                </CommandItem>
                <CommandItem value="search-emoji" startIcon={<Glyph name="emoji" size={size} />}>
                    Search Emoji
                </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
                <CommandGroupHeading>Settings</CommandGroupHeading>
                <CommandItem value="settings" startIcon={<Glyph name="settings" size={size} />}>
                    Settings
                    <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
            </CommandGroup>
        </>
    );
}

export default function CommandPreview() {
    const [open, setOpen] = useState(false);

    return (
        <Looks>
            <Look caption="Dialog">
                <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
                    Open
                </Button>
                <CommandDialog open={open} onOpenChange={setOpen}>
                    <CommandInput placeholder="Search commands…" />
                    <CommandList>
                        <CommandPreviewItems size="lg" />
                    </CommandList>
                </CommandDialog>
            </Look>
            <Look caption="Inline">
                <Command label="Inline commands" className="w-refineui-foundation-size-3250 max-w-full">
                    <CommandInput placeholder="Search commands…" />
                    <CommandList>
                        <CommandPreviewItems />
                    </CommandList>
                </Command>
            </Look>
            <Look caption="Sizes" align="stretch">
                <Stack gap="sizeXXLarge">
                    {SIZES.map(({ size, label }) => (
                        <Stack key={size} gap="sizeSmall">
                            <Text variant="captionMd" className="m-0 text-refineui-alias-foreground-secondary">
                                {label}
                            </Text>
                            <Command size={size} label={`${label} commands`}>
                                <CommandInput placeholder="Search commands…" />
                                <CommandList>
                                    <CommandPreviewItems size={size} />
                                </CommandList>
                            </Command>
                        </Stack>
                    ))}
                </Stack>
            </Look>
        </Looks>
    );
}
