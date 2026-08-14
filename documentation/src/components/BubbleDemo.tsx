import { spacings } from "@refineui/tokens";
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function BubbleDemo() {
  return (
    <PreviewFrame minHeight="320px">
      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: "420px",
          flexDirection: "column",
          gap: spacings.sizeXXXLarge,
        }}
      >
        <Bubble variant="muted" align="start">
          <BubbleContent>Hey! Want to see chat bubbles?</BubbleContent>
        </Bubble>

        <BubbleGroup>
          <Bubble variant="muted" align="start">
            <BubbleContent>I can group messages, switch sides,</BubbleContent>
          </Bubble>
          <Bubble variant="muted" align="start">
            <BubbleContent>and keep the whole thread easy to scan.</BubbleContent>
            <BubbleReactions role="img" aria-label="Reaction: thumbs up">
              <span aria-hidden>👍</span>
            </BubbleReactions>
          </Bubble>
        </BubbleGroup>

        <Bubble variant="default" align="end">
          <BubbleContent>Sure. Hit me with your best demo.</BubbleContent>
          <BubbleReactions role="img" aria-label="Reaction: eyes">
            <span aria-hidden>👀</span>
          </BubbleReactions>
        </Bubble>

        <Bubble variant="tinted" align="start">
          <BubbleContent>
            Yes. You are reading a demo that is demoing itself. Very meta. Very on-brand.
          </BubbleContent>
          <BubbleReactions role="img" aria-label="Reactions: thumbs up, fire, eyes">
            <span aria-hidden>👍</span>
            <span aria-hidden>🔥</span>
            <span aria-hidden>👀</span>
          </BubbleReactions>
        </Bubble>

        <Bubble variant="destructive" align="end">
          <BubbleContent>Failed to send — try again.</BubbleContent>
        </Bubble>

        <Bubble variant="ghost" align="start">
          <BubbleContent>
            Ghost bubbles work for assistant text and other unframed content.
          </BubbleContent>
        </Bubble>
      </div>
    </PreviewFrame>
  );
}
