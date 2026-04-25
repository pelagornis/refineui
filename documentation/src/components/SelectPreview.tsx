import { spacings } from "@refineui/tokens";
import { Select, SelectContent, SelectGroup, SelectItem, SelectSection, SelectSeparator, SelectTrigger, SelectValue } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

const options = [
    { value: "kr", label: "Select Menu Item" },
    { value: "us", label: "Select Menu Item" },
    { value: "jp", label: "Select Menu Item" },
    { value: "de", label: "Select Menu Item" },
    { value: "fr", label: "Select Menu Item" },
    { value: "es", label: "Select Menu Item" },
];

function selectMenu() {
    return (
        <SelectContent>
            <SelectSection>Section Header</SelectSection>
            <SelectSeparator />
            <SelectGroup>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectGroup>
        </SelectContent>
    );
}

export default function SelectPreview() {
    return (
        <PreviewFrame>
            <div style={{ width: "180px", display: "flex", flexDirection: "column", gap: spacings.sizeMedium }}>
                <Select placeholder="Placeholder" defaultValue="" aria-label="Select default">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    {selectMenu()}
                </Select>
                <Select placeholder="Placeholder" defaultValue="es" aria-label="Select filled">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    {selectMenu()}
                </Select>
                <Select placeholder="Placeholder" defaultValue="" aria-label="Select focus">
                    <SelectTrigger autoFocus className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    {selectMenu()}
                </Select>
                <Select placeholder="Placeholder" defaultValue="" disabled aria-label="Select disabled">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    {selectMenu()}
                </Select>
                <div
                    style={{
                        border: "1px solid var(--refineui-color-alias-border-default)",
                        borderRadius: "16px",
                        padding: "4px",
                        background: "var(--refineui-color-alias-background-primary)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1px",
                    }}
                >
                    <button type="button" data-refineui="select-item" data-state="hover">
                        Select Menu Item (Hover)
                    </button>
                    <button type="button" data-refineui="select-item" data-state="pressed">
                        Select Menu Item (Pressed)
                    </button>
                    <button type="button" data-refineui="select-item" data-state="selected" data-selected="true">
                        Select Menu Item (Selected)
                    </button>
                </div>
            </div>
        </PreviewFrame>
    );
}
