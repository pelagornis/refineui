import {
  Box,
  ScrollArea,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
  Stack,
  Text,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

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

export default function ScrollAreaDemo() {
  return (
    <Looks>
      <Look align="stretch">
        <ScrollArea type="hover" className="h-refineui-foundation-size-2560 w-full">
          <ScrollAreaViewport>
            <Stack as="ul" className="m-0 list-none p-0">
              {tags.map((name) => (
                <Box
                  key={name}
                  as="li"
                  paddingX="sizeLarge"
                  paddingY="sizeMedium"
                  className="border-b-refineui-thin border-refineui-alias-border-default"
                >
                  <Text variant="bodySm">{name}</Text>
                </Box>
              ))}
            </Stack>
          </ScrollAreaViewport>
          <ScrollAreaScrollbar orientation="vertical">
            <ScrollAreaThumb />
          </ScrollAreaScrollbar>
        </ScrollArea>
      </Look>
    </Looks>
  );
}
