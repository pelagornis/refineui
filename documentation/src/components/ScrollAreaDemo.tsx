import { foundationSizes, spacings } from "@refineui/tokens";
import {
  ScrollArea,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

const tags = [
  "Accordion",
  "Alert",
  "Avatar",
  "Badge",
  "Bubble",
  "Button",
  "Calendar",
  "Card",
  "Carousel",
  "Checkbox",
  "Dialog",
  "Divider",
  "Drawer",
  "Dropdown",
  "Field",
  "Input",
  "Label",
  "Link",
  "Menu",
  "Pagination",
  "PopOver",
  "Progress",
  "ProgressStepper",
  "Radio",
  "Resizable",
  "ScrollArea",
  "Select",
  "Skeleton",
  "Slider",
  "Spinner",
  "Stepper",
  "Switch",
  "SegmentedControl",
  "Tabs",
  "Tag",
  "Textarea",
  "Toast",
  "Tooltip",
];

const frameStyle = {
  height: foundationSizes.foundationSize2560,
  borderRadius: "var(--refineui-radius-rounded-x-large)",
  border: "var(--refineui-stroke-width-thin) solid var(--refineui-color-alias-border-default)",
  background: "var(--refineui-color-alias-background-primary)",
  boxShadow: "var(--refineui-shadow-2)",
} as const;

export default function ScrollAreaDemo() {
  return (
    <PreviewFrame minHeight="360px">
      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: foundationSizes.foundationSize3200,
          flexWrap: "wrap",
          gap: spacings.sizeXLarge,
        }}
      >
        <div style={{ display: "flex", flex: "1 1 220px", flexDirection: "column", gap: spacings.sizeSmall }}>
          <span
            className="refineui-typo-caption-2"
            style={{
              color: "var(--refineui-color-alias-foreground-tertiary)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Hover
          </span>
          <ScrollArea type="hover" style={frameStyle}>
            <ScrollAreaViewport>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {tags.map((name) => (
                  <li
                    key={name}
                    className="refineui-typo-body-3"
                    style={{
                      boxSizing: "border-box",
                      paddingBlock: spacings.sizeMedium,
                      paddingInline: spacings.sizeLarge,
                      color: "var(--refineui-color-alias-foreground-primary)",
                      borderBottom:
                        "var(--refineui-stroke-width-hairline) solid var(--refineui-color-alias-border-default)",
                    }}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </ScrollAreaViewport>
            <ScrollAreaScrollbar orientation="vertical">
              <ScrollAreaThumb />
            </ScrollAreaScrollbar>
          </ScrollArea>
        </div>

        <div style={{ display: "flex", flex: "1 1 220px", flexDirection: "column", gap: spacings.sizeSmall }}>
          <span
            className="refineui-typo-caption-2"
            style={{
              color: "var(--refineui-color-alias-foreground-tertiary)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            Always
          </span>
          <ScrollArea type="always" style={frameStyle}>
            <ScrollAreaViewport
              style={{
                paddingBlock: spacings.sizeLarge,
                paddingInline: spacings.sizeLarge,
              }}
            >
              <p
                className="refineui-typo-body-3"
                style={{
                  margin: 0,
                  marginBottom: spacings.sizeMedium,
                  color: "var(--refineui-color-alias-foreground-secondary)",
                }}
              >
                Clear overlay thumb — border-strong fill, secondary on press.
              </p>
              <p
                className="refineui-typo-body-3"
                style={{
                  margin: 0,
                  color: "var(--refineui-color-alias-foreground-primary)",
                  lineHeight: 1.6,
                }}
              >
                ScrollArea keeps the native scroll surface for wheel, trackpad, and keyboard,
                then paints a solid custom thumb sized to the visible ratio. Use{" "}
                <code>type=&quot;hover&quot;</code> in dense panels and{" "}
                <code>type=&quot;always&quot;</code> when the affordance should stay visible.
              </p>
              <p
                className="refineui-typo-body-3"
                style={{
                  margin: 0,
                  marginTop: spacings.sizeMedium,
                  color: "var(--refineui-color-alias-foreground-primary)",
                  lineHeight: 1.6,
                }}
              >
                Drag the thumb, click the track, or focus the viewport and use arrow keys.
                The rail sits flush on the edge inset — no side padding on the thumb.
              </p>
            </ScrollAreaViewport>
            <ScrollAreaScrollbar orientation="vertical">
              <ScrollAreaThumb />
            </ScrollAreaScrollbar>
          </ScrollArea>
        </div>
      </div>
    </PreviewFrame>
  );
}
