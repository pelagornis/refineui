import { useCallback, useEffect, useState } from "react";
import { Stack, Text } from "@refineui/react";
import type { DocsLocaleCode } from "../../lib/docs-locale";

const ROTATING_WORDS = {
    en: ["tokens", "components", "motion", "design"] as const,
    ko: ["토큰", "컴포넌트", "모션", "디자인"] as const,
};

export type HomeHeroHeadlineProps = {
    locale?: DocsLocaleCode;
};

export function HomeHeroHeadline({ locale }: HomeHeroHeadlineProps) {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const words = locale === "ko" ? ROTATING_WORDS.ko : ROTATING_WORDS.en;

    const advance = useCallback(() => {
        setIndex((current) => (current + 1) % words.length);
    }, [words.length]);

    useEffect(() => {
        if (paused) {
            return;
        }

        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (motionQuery.matches) {
            return;
        }

        const timer = window.setInterval(advance, 3600);
        return () => window.clearInterval(timer);
    }, [paused, advance]);

    const word = words[index];
    const leadBefore = locale === "ko" ? "" : "One language from ";
    const leadAfter =
        locale === "ko"
            ? "에서 React까지. 제품과 같은 패키지로 렌더링되는 문서 — 정밀하고, 토큰 기반이며, 인터랙티브합니다."
            : " to React. Documentation rendered with the same packages as product — precise, token-driven, and interactive.";
    const wordLabel =
        locale === "ko" ? `${word}. 클릭하면 다음 초점으로 이동합니다.` : `${word}. Click for the next focus.`;

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
                {leadBefore}
                <button
                    type="button"
                    data-refineui-home-title-word
                    aria-label={wordLabel}
                    onClick={advance}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    onFocus={() => setPaused(true)}
                    onBlur={() => setPaused(false)}
                >
                    {words.map((candidate, candidateIndex) => (
                        <span
                            key={candidate}
                            data-refineui-home-title-word-text
                            data-active={candidateIndex === index ? "" : undefined}
                            aria-hidden={candidateIndex === index ? undefined : true}
                        >
                            {candidate}
                        </span>
                    ))}
                </button>
                {leadAfter}
            </Text>
        </Stack>
    );
}
