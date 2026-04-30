import { spacings } from "@refineui/tokens";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectSection,
    SelectTrigger,
    SelectValue,
} from "@refineui/react";
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
        section: "Asia",
        items: [
            "India Standard Time",
            "China Standard Time",
            "Japan Standard Time",
            "Korea Standard Time",
            "Indonesia Central Standard Time",
            "Singapore Standard Time",
            "Philippine Standard Time",
        ],
    },
    {
        section: "Europe",
        items: [
            "Greenwich Mean Time",
            "Central European Time",
            "Eastern European Time",
            "Western European Summer Time",
            "Turkey Time",
            "Moscow Time",
        ],
    },
];

function menu() {
    return (
        <SelectContent>
            <SelectGroup>
                {groupedOptions.map((group, groupIndex) => (
                    <div key={group.section}>
                        <SelectSection>{group.section}</SelectSection>
                        {group.items.map((label, itemIndex) => (
                            <SelectItem key={`${group.section}-${label}`} value={`group-${groupIndex + 1}-item-${itemIndex + 1}`}>
                                {label}
                            </SelectItem>
                        ))}
                    </div>
                ))}
            </SelectGroup>
        </SelectContent>
    );
}

export default function SelectPreview() {
    return (
        <PreviewFrame minHeight="85vh">
            <div
                style={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(280px, 1fr))",
                    gap: spacings.sizeLarge,
                    alignItems: "start",
                }}
            >
                {Array.from({ length: 12 }).map((_, index) => (
                    <Select
                        key={`select-preview-${index + 1}`}
                        fullWidth
                        placeholder="Placeholder"
                        defaultValue={index % 3 === 1 ? "group-2-item-3" : ""}
                        disabled={index % 3 === 2}
                        aria-label={`Select preview ${index + 1}`}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        {menu()}
                    </Select>
                ))}
            </div>
        </PreviewFrame>
    );
}

