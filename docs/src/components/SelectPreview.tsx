import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectPortal,
    SelectSection,
    SelectTrigger,
    SelectValue,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

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
        <SelectPortal>
            <SelectContent>
                <SelectGroup>
                    {groupedOptions.map((group, groupIndex) => (
                        <div key={group.section}>
                            <SelectSection>{group.section}</SelectSection>
                            {group.items.map((label, itemIndex) => (
                                <SelectItem
                                    key={`${group.section}-${label}`}
                                    value={`group-${groupIndex + 1}-item-${itemIndex + 1}`}
                                >
                                    {label}
                                </SelectItem>
                            ))}
                        </div>
                    ))}
                </SelectGroup>
            </SelectContent>
        </SelectPortal>
    );
}

export default function SelectPreview() {
    return (
        <Looks>
            <Look align="stretch">
                <Select fullWidth placeholder="Timezone" aria-label="Select timezone">
                    <SelectTrigger>
                        <SelectValue placeholder="Timezone" />
                    </SelectTrigger>
                    {menu()}
                </Select>
            </Look>
        </Looks>
    );
}
