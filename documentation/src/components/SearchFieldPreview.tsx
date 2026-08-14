import { useState, type ReactNode } from "react";
import { spacings } from "@refineui/tokens";
import {
  SearchField,
  SearchFieldClear,
  SearchFieldIcon,
  SearchFieldInput,
} from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

function DemoLabel({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        color: "var(--refineui-color-alias-foreground-secondary)",
        fontSize: "var(--refineui-font-size-caption1)",
        lineHeight: "var(--refineui-line-height-caption1)",
      }}
    >
      {children}
    </span>
  );
}

function SearchDemo({
  disabled,
  autoFocus,
  defaultQuery = "",
}: {
  disabled?: boolean;
  autoFocus?: boolean;
  defaultQuery?: string;
}) {
  const [query, setQuery] = useState(disabled ? "RefineUI" : defaultQuery);
  return (
    <SearchField value={query} onValueChange={setQuery} disabled={disabled}>
      <SearchFieldIcon />
      <SearchFieldInput placeholder="Search" autoFocus={autoFocus} />
      <SearchFieldClear />
    </SearchField>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: spacings.sizeXSmall,
        width: "100%",
        maxWidth: "360px",
      }}
    >
      <DemoLabel>{label}</DemoLabel>
      {children}
    </div>
  );
}

export default function SearchFieldPreview() {
  return (
    <PreviewFrame>
      <div
        style={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: spacings.sizeXXXLarge,
        }}
      >
        <Row label="Rest — surfaceSelected (same as Input OTP slot)">
          <SearchDemo />
        </Row>
        <Row label="Focus — surfaceSelected + borderDefault (click or tab)">
          <SearchDemo autoFocus defaultQuery="focused" />
        </Row>
        <Row label="Disabled — surfaceDisabled">
          <SearchDemo disabled />
        </Row>
      </div>
    </PreviewFrame>
  );
}
