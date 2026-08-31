import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@refineui/react";
import { withBase } from "../../lib/docs-path";
import { HomeStage } from "./HomeStage";

const HERO_VIDEO_SRC = withBase("/landing/intro.mp4");

function PauseIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden width={24} height={24}>
            <path
                d="M7.45 2C8.996 2 10.25 3.254 10.25 4.8v14.4c0 1.546-1.254 2.8-2.8 2.8H5.05C3.504 21.999 2.25 20.746 2.25 19.2V4.8C2.25 3.254 3.504 2 5.05 2h2.4Zm11.5 0c1.546 0 2.8 1.254 2.8 2.8v14.4c0 1.546-1.254 2.8-2.8 2.8h-2.4c-1.546 0-2.8-1.254-2.8-2.8V4.8c0-1.546 1.254-2.8 2.8-2.8h2.4Z"
                fill="currentColor"
            />
        </svg>
    );
}

function PlayIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden width={24} height={24}>
            <path
                d="M8 5.14v13.72c0 .79.87 1.27 1.54.84l11.02-6.86c.65-.41.65-1.27 0-1.68L9.54 4.3C8.87 3.87 8 4.35 8 5.14Z"
                fill="currentColor"
            />
        </svg>
    );
}

export function HomeHeroVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(true);
    const [hasVideo, setHasVideo] = useState(true);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const apply = () => {
            const reduced = mq.matches;
            setReducedMotion(reduced);
            if (reduced) {
                setPlaying(false);
                videoRef.current?.pause();
            }
        };
        apply();
        mq.addEventListener("change", apply);
        return () => mq.removeEventListener("change", apply);
    }, []);

    useEffect(() => {
        if (!hasVideo || reducedMotion || !playing) return;
        const video = videoRef.current;
        if (!video) return;
        void video.play().catch(() => setPlaying(false));
    }, [hasVideo, playing, reducedMotion]);

    const togglePlayback = useCallback(() => {
        const video = videoRef.current;
        if (!video || !hasVideo) return;
        if (video.paused) {
            void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
            return;
        }
        video.pause();
        setPlaying(false);
    }, [hasVideo]);

    return (
        <div data-refineui-home-hero-frame className="box-border size-full">
            <div data-refineui-home-hero-video>
                {hasVideo ? (
                    <div data-refineui-home-hero-video-surface>
                        <video
                            ref={videoRef}
                            className="size-full object-cover"
                            src={HERO_VIDEO_SRC}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            aria-hidden
                            onError={() => setHasVideo(false)}
                            onPlay={() => setPlaying(true)}
                            onPause={() => setPlaying(false)}
                        />
                    </div>
                ) : (
                    <div data-refineui-home-hero-video-fallback>
                        <HomeStage />
                    </div>
                )}

                {hasVideo ? (
                    <div data-refineui-home-hero-video-control>
                        <Button
                            type="button"
                            variant="ghost"
                            layout="icon"
                            size="sm"
                            data-refineui-home-hero-video-toggle
                            aria-label={playing ? "동영상 일시정지" : "동영상 재생"}
                            aria-pressed={playing}
                            onClick={togglePlayback}
                        >
                            {playing ? <PauseIcon /> : <PlayIcon />}
                        </Button>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
