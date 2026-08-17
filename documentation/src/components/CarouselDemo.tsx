import {
  Box,
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselIndicators,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Stack,
  Text,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

const slides = [
  { eyebrow: "01", title: "Overview" },
  { eyebrow: "02", title: "Motion" },
  { eyebrow: "03", title: "Compose" },
];

export default function CarouselDemo() {
  return (
    <Looks>
      <Look align="stretch">
        <Carousel loop className="w-full">
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.title}>
                <Box
                  padding="sizeXLarge"
                  background="backgroundBrand"
                  className="flex min-h-refineui-foundation-size-2000 flex-col justify-end"
                >
                  <Stack gap="sizeXSmall">
                    <Text variant="captionMd" className="m-0 text-refineui-alias-foreground-on-brand">
                      {slide.eyebrow}
                    </Text>
                    <Text as="strong" variant="titleMd" className="text-refineui-alias-foreground-on-brand">
                      {slide.title}
                    </Text>
                  </Stack>
                </Box>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselControls>
            <CarouselPrevious />
            <CarouselIndicators />
            <CarouselNext />
          </CarouselControls>
        </Carousel>
      </Look>
    </Looks>
  );
}
