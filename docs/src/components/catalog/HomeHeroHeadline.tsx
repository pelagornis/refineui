import { useCallback, useEffect, useState } from "react";
import { Stack, Text } from "@refineui/react";

const ROTATING_WORDS = ["tokens", "components", "motion", "design"] as const;

export function HomeHeroHeadline() {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    const advance = useCallback(() => {
        setIndex((current) => (current + 1) % ROTATING_WORDS.length);
    }, []);

    useEffect(() => {
        if (paused) {
            return;
        }

        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (motionQuery.matches) {
            return;
        }

        const timer = window.setInterval(advance, 3000);
        return () => window.clearInterval(timer);
    }, [paused, advance]);

    const word = ROTATING_WORDS[index];

    return (
        <Stack
            as="header"
            gap="sizeLarge"
            align="center"
            data-refineui-home-headline
            className="m-0 w-full min-w-0 text-center"
        >
            <Text
                as="h1"
                variant="displayLg"
                id="_top"
                data-refineui-home-brand
                className="m-0 text-refineui-alias-foreground-primary"
            >
                RefineUI
            </Text>
            <Text
                as="p"
                variant="bodyLg"
                data-refineui-home-lead
                className="m-0 text-refineui-alias-foreground-secondary"
            >
                One language from{" "}
                <button
                    type="button"
                    data-refineui-home-title-word
                    aria-label={`${word}. Click for the next focus.`}
                    onClick={advance}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    onFocus={() => setPaused(true)}
                    onBlur={() => setPaused(false)}
                >
                    <span key={word} data-refineui-home-title-word-text>
                        {word}
                    </span>
                </button>{" "}
                to React. Documentation rendered with the same packages as product — precise,
                token-driven, and interactive.
            </Text>
        </Stack>
    );
}
