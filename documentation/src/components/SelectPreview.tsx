import { spacings } from "@refineui/tokens";
import { Select, SelectContent, SelectGroup, SelectItem, SelectSection, SelectTrigger, SelectValue } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

const groupedOptions = [
    {
        section: "North America",
        items: [
            "Eastern Standard Time",
            "Central Standard Time",
            "Mountain Standard Time",
            "Pacific Standard Time",
            "Alaska Standard Time",
            "Hawaii Standard Time",
        ],
    },
    {
        section: "Europe & Africa",
        items: [
            "Greenwich Mean Time",
            "Central European Time",
            "Eastern European Time",
            "Western European Summer Time",
            "Central Africa Time",
            "East Africa Time",
        ],
    },
    {
        section: "Asia",
        items: [
            "Moscow Time",
            "India Standard Time",
            "China Standard Time",
            "Japan Standard Time",
            "Korea Standard Time",
            "Indonesia Central Standard Time",
        ],
    },
    {
        section: "Australia & Pacific",
        items: [
            "Australian Western Standard Time",
            "Australian Central Standard Time",
            "Australian Eastern Standard Time",
            "New Zealand Standard Time",
            "Fiji Time",
        ],
    },
    {
        section: "South America",
        items: ["Argentina Time", "Bolivia Time", "Brasilia Time", "Chile Standard Time"],
    },
];

function selectMenu() {
    return (
        <SelectContent>
            {groupedOptions.map((group, groupIndex) => (
                <div key={group.section}>
                    <SelectSection>{group.section}</SelectSection>
                    <SelectGroup>
                        {group.items.map((label, itemIndex) => (
                            <SelectItem key={`${group.section}-${label}`} value={`group-${groupIndex + 1}-item-${itemIndex + 1}`}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </div>
            ))}
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
                <Select placeholder="Placeholder" defaultValue="group-3-item-3" aria-label="Select filled">
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
