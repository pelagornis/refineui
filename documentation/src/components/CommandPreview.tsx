import { useEffect, useState } from "react";
import { borderRadii, colors, iconSizes, spacings, strokeWidths, typographys } from "@refineui/tokens";
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
    WebIcon,
} from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

function Glyph({ name }: { name: string }) {
    return <WebIcon name={name} size={iconSizes.small} color="currentColor" aria-hidden />;
}

function SampleCommandBody({ onPick }: { onPick?: (value: string) => void }) {
    return (
        <>
            <CommandInput placeholder="Search commands…" />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    <CommandGroupHeading>Suggestions</CommandGroupHeading>
                    <CommandItem
                        value="calendar"
                        keywords={["date", "schedule"]}
                        startIcon={<Glyph name="calendar" />}
                        onSelect={onPick}
                    >
                        Calendar
                        <CommandShortcut>⌘K</CommandShortcut>
                    </CommandItem>
                    <CommandItem
                        value="search-emoji"
                        keywords={["emoji", "face"]}
                        startIcon={<Glyph name="emoji" />}
                        onSelect={onPick}
                    >
                        Search Emoji
                    </CommandItem>
                    <CommandItem
                        value="calculator"
                        disabled
                        startIcon={<Glyph name="calculator" />}
                        onSelect={onPick}
                    >
                        Calculator
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                    <CommandGroupHeading>Settings</CommandGroupHeading>
                    <CommandItem value="profile" startIcon={<Glyph name="person" />} onSelect={onPick}>
                        Profile
                        <CommandShortcut>⌘P</CommandShortcut>
                    </CommandItem>
                    <CommandItem value="billing" startIcon={<Glyph name="payment" />} onSelect={onPick}>
                        Billing
                    </CommandItem>
                    <CommandItem value="settings" startIcon={<Glyph name="settings" />} onSelect={onPick}>
                        Settings
                        <CommandShortcut>⌘S</CommandShortcut>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </>
    );
}

export default function CommandPreview() {
    const [open, setOpen] = useState(false);
    const [last, setLast] = useState<string | null>(null);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "j") {
                event.preventDefault();
                setOpen((v) => !v);
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
        <PreviewFrame>
            <div
                style={{
                    display: "grid",
                    gap: spacings.sizeXXLarge,
                    width: "100%",
                    maxWidth: "720px",
                }}
            >
                <div
                    style={{
                        borderRadius: borderRadii.roundedLarge,
                        border: `${strokeWidths.strokeWidthHairline} solid ${colors.neutral300}`,
                        overflow: "hidden",
                        maxWidth: "600px",
                        backgroundColor: colors.neutralWhite,
                    }}
                >
                    <Command label="Inline command menu">
                        <SampleCommandBody onPick={(v) => setLast(v)} />
                    </Command>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeXSmall, alignItems: "center" }}>
                    <Button type="button" onClick={() => setOpen(true)}>
                        Open command palette
                    </Button>
                    <span style={{ ...typographys.body4, color: colors.neutral600 }}>or press ⌘J / Ctrl+J</span>
                </div>

                {last ? (
                    <p style={{ margin: 0, ...typographys.body4, color: colors.neutral600 }}>
                        Last selected: <strong>{last}</strong>
                    </p>
                ) : null}

                <CommandDialog
                    open={open}
                    onOpenChange={setOpen}
                    commandProps={{ label: "Command palette" }}
                >
                    <SampleCommandBody
                        onPick={(value) => {
                            setLast(value);
                            setOpen(false);
                        }}
                    />
                </CommandDialog>
            </div>
        </PreviewFrame>
    );
}
