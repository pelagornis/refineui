import { spacings } from "@refineui/tokens";
import {
    Select as RefineSelect,
    SelectContent as RefineSelectContent,
    SelectGroup as RefineSelectGroup,
    SelectItem as RefineSelectItem,
    SelectPortal as RefineSelectPortal,
    SelectSection as RefineSelectSection,
    SelectTrigger as RefineSelectTrigger,
    SelectValue as RefineSelectValue,
} from "@refineui/react";
import { Select as RadixSelect, Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
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
        <RefineSelectPortal>
            <RefineSelectContent>
                <RefineSelectGroup>
                    {groupedOptions.map((group, groupIndex) => (
                        <div key={group.section}>
                            <RefineSelectSection>{group.section}</RefineSelectSection>
                            {group.items.map((label, itemIndex) => (
                                <RefineSelectItem
                                    key={`${group.section}-${label}`}
                                    value={`group-${groupIndex + 1}-item-${itemIndex + 1}`}
                                >
                                    {label}
                                </RefineSelectItem>
                            ))}
                        </div>
                    ))}
                </RefineSelectGroup>
            </RefineSelectContent>
        </RefineSelectPortal>
    );
}

export default function SelectPreview() {
    const flatItems = groupedOptions.flatMap((group, groupIndex) =>
        group.items.map((label, itemIndex) => ({
            label: `${group.section} - ${label}`,
            value: `group-${groupIndex + 1}-item-${itemIndex + 1}`,
        })),
    );

    return (
        <PreviewFrame minHeight="85vh">
            <div
                style={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(320px, 1fr))",
                    gap: spacings.sizeLarge,
                    alignItems: "start",
                }}
            >
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: spacings.sizeMedium }}>
                    <p style={{ margin: 0 }}>RefineUI Select</p>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <RefineSelect
                            key={`select-preview-refine-${index + 1}`}
                            fullWidth
                            placeholder="Placeholder"
                            defaultValue={index % 3 === 1 ? "group-2-item-3" : undefined}
                            disabled={index % 3 === 2}
                            aria-label={`Select preview refine ${index + 1}`}
                        >
                            <RefineSelectTrigger>
                                <RefineSelectValue placeholder="Theme" />
                            </RefineSelectTrigger>
                            {menu()}
                        </RefineSelect>
                    ))}
                </div>
                <Theme>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: spacings.sizeMedium }}>
                        <p style={{ margin: 0 }}>Radix Themes Select</p>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <RadixSelect.Root
                                key={`select-preview-radix-${index + 1}`}
                                defaultValue={index % 3 === 1 ? "group-2-item-3" : undefined}
                                disabled={index % 3 === 2}
                            >
                                <RadixSelect.Trigger
                                    placeholder="Theme"
                                    style={{ width: "100%" }}
                                    aria-label={`Select preview radix ${index + 1}`}
                                />
                                <RadixSelect.Content position="item-aligned">
                                    {flatItems.map((item) => (
                                        <RadixSelect.Item key={item.value} value={item.value}>
                                            {item.label}
                                        </RadixSelect.Item>
                                    ))}
                                </RadixSelect.Content>
                            </RadixSelect.Root>
                        ))}
                    </div>
                </Theme>
            </div>
        </PreviewFrame>
    );
}

