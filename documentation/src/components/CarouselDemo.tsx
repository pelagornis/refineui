import { spacings } from "@refineui/tokens";
import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselIndicators,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

const slides = [
  {
    eyebrow: "01",
    title: "Overview",
    body: "Drag the stage or use Button prev/next — loop feels continuous, not a hard jump.",
  },
  {
    eyebrow: "02",
    title: "Motion",
    body: "Panel duration and emphasized easing, with live drag offset while swiping.",
  },
  {
    eyebrow: "03",
    title: "Compose",
    body: "CarouselContent, Item, Controls, Previous, Next, and Indicators.",
  },
];

export default function CarouselDemo() {
  return (
    <PreviewFrame minHeight="360px">
      <div style={{ maxWidth: "440px", width: "100%" }}>
        <Carousel loop>
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.title}>
                <div
                  style={{
                    boxSizing: "border-box",
                    aspectRatio: "16 / 10",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    gap: spacings.sizeXSmall,
                    padding: spacings.sizeXLarge,
                    background:
                      "linear-gradient(160deg, var(--refineui-color-alias-background-brand) 0%, var(--refineui-color-alias-background-brand-strong) 100%)",
                    color: "var(--refineui-color-alias-foreground-on-brand)",
                  }}
                >
                  <span
                    className="refineui-typo-caption-2"
                    style={{ opacity: 0.72, letterSpacing: "0.06em", textTransform: "uppercase" }}
                  >
                    {slide.eyebrow}
                  </span>
                  <strong className="refineui-typo-title-2">{slide.title}</strong>
                  <p className="refineui-typo-body-3" style={{ margin: 0, opacity: 0.88, maxWidth: "28ch" }}>
                    {slide.body}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselControls>
            <CarouselPrevious />
            <CarouselIndicators />
            <CarouselNext />
          </CarouselControls>
        </Carousel>
      </div>
    </PreviewFrame>
  );
}
