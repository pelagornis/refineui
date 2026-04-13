import { spacings } from "@refineui/tokens";
import { Select } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

const options = [
  { value: "a", label: "옵션 A" },
  { value: "b", label: "옵션 B" },
  { value: "c", label: "옵션 C" },
];

export default function SelectPreview() {
  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: spacings.sizeMedium, maxWidth: "360px" }}>
        <Select
          options={options}
          placeholder="선택하세요"
          defaultValue=""
          aria-label="기본 선택"
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: spacings.sizeSmall, alignItems: "center" }}>
          <Select size="sm" options={options} placeholder="sm" defaultValue="" aria-label="Small" />
          <Select size="md" options={options} placeholder="md" defaultValue="" aria-label="Medium" />
          <Select size="lg" options={options} placeholder="lg" defaultValue="" aria-label="Large" />
        </div>
        <Select options={options} placeholder="Success" success defaultValue="" fullWidth aria-label="Success" />
        <Select options={options} placeholder="Error" error defaultValue="" fullWidth aria-label="Error" />
        <Select options={options} placeholder="Disabled" disabled defaultValue="" aria-label="Disabled" />
      </div>
    </PreviewFrame>
  );
}
