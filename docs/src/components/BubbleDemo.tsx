import {
    Bubble,
    BubbleContent,
    BubbleGroup,
    BubbleReactions,
    Stack,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function BubbleDemo() {
    return (
        <Looks>
            <Look align="stretch">
                <Stack gap="sizeLarge" className="w-full">
                    <Bubble variant="muted" align="start">
                        <BubbleContent>Want to catch up later?</BubbleContent>
                    </Bubble>
                    <BubbleGroup>
                        <Bubble variant="muted" align="start">
                            <BubbleContent>On my way.</BubbleContent>
                        </Bubble>
                        <Bubble variant="muted" align="start">
                            <BubbleContent>See you there.</BubbleContent>
                            <BubbleReactions role="img" aria-label="Reaction: thumbs up">
                                <span aria-hidden>👍</span>
                            </BubbleReactions>
                        </Bubble>
                    </BubbleGroup>
                    <Bubble variant="default" align="end">
                        <BubbleContent>Sounds good.</BubbleContent>
                        <BubbleReactions role="img" aria-label="Reaction: eyes">
                            <span aria-hidden>👀</span>
                        </BubbleReactions>
                    </Bubble>
                </Stack>
            </Look>
        </Looks>
    );
}
