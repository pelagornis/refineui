import { useEffect, useLayoutEffect, useState, type CSSProperties, type RefObject } from "react";
import { spacings, strokeWidths } from "@refineui/tokens";
import {
    buildFloatingOutline,
    floatingShapeSize,
    resolveBeakCenter,
    type FloatingBeakAlign,
    type FloatingBeakSide,
} from "./floatingOutline";

const useIsomorphicLayoutEffect = typeof document !== "undefined" ? useLayoutEffect : useEffect;

/** Room around the shape for the floating elevation's offset + blur. */
const SHADOW_BLEED = parseFloat(spacings.sizeXXXLarge);
const STROKE = parseFloat(strokeWidths.strokeWidthHairline);

type FloatingSurfaceProps = {
    /** Panel whose border box the surface wraps. */
    panelRef: RefObject<HTMLElement | null>;
    side: FloatingBeakSide;
    align: FloatingBeakAlign;
    radius: string;
    beakWidth: string;
    beakHeight: string;
    tipRadius: string;
    beakInsetStart: string;
    beakInsetEnd: string;
    backgroundColor: string;
    borderColor: string;
};

type PanelSize = { width: number; height: number };

/** `shape` as an SVG data-URL mask, padded by `bleed` on every side. */
function svgPathMask(shape: string, width: number, height: number, bleed: number): string {
    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width + bleed * 2}" height="${height + bleed * 2}">` +
        `<path transform="translate(${bleed} ${bleed})" d="${shape}"/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function usePanelSize(panelRef: RefObject<HTMLElement | null>): PanelSize | null {
    const [size, setSize] = useState<PanelSize | null>(null);

    useIsomorphicLayoutEffect(() => {
        const panel = panelRef.current;
        if (!panel) return;
        const measure = () => {
            // Panels are `box-border`, so computed width/height is the fractional border box; offset* rounds.
            const style = getComputedStyle(panel);
            const next = { width: parseFloat(style.width), height: parseFloat(style.height) };
            setSize((prev) => (prev && prev.width === next.width && prev.height === next.height ? prev : next));
        };
        measure();
        if (typeof ResizeObserver === "undefined") return;
        const observer = new ResizeObserver(measure);
        observer.observe(panel);
        return () => observer.disconnect();
    }, [panelRef]);

    return size;
}

/**
 * Fill, blur, stroke, and elevation for a floating panel and its beak as one shape,
 * so the beak shares the panel's frosted material instead of sitting on top of it.
 * Render after the panel: layout effects run in tree order, so the panel ref must
 * already be attached when this measures. `-z-1` keeps it painted beneath the panel.
 */
export function FloatingSurface({
    panelRef,
    side,
    align,
    radius,
    beakWidth,
    beakHeight,
    tipRadius,
    beakInsetStart,
    beakInsetEnd,
    backgroundColor,
    borderColor,
}: FloatingSurfaceProps) {
    const size = usePanelSize(panelRef);
    if (!size) return null;

    const r = parseFloat(radius);
    const bw = parseFloat(beakWidth);
    const bh = parseFloat(beakHeight);
    const vertical = side === "top" || side === "bottom";
    const beakCenter = resolveBeakCenter(
        vertical ? size.width : size.height,
        align,
        bw,
        r,
        parseFloat(beakInsetStart),
        parseFloat(beakInsetEnd),
    );
    const geometry = {
        panelWidth: size.width,
        panelHeight: size.height,
        radius: r,
        side,
        beakCenter,
        beakWidth: bw,
        beakHeight: bh,
        tipRadius: parseFloat(tipRadius),
    };
    const shape = buildFloatingOutline(geometry);
    const outline = buildFloatingOutline({ ...geometry, inset: STROKE / 2 });
    const box = floatingShapeSize(size.width, size.height, side, bh);

    const holeMask = `linear-gradient(black 0 0), ${svgPathMask(shape, box.width, box.height, SHADOW_BLEED)}`;
    // Chrome paints `backdrop-filter` over the full box under `clip-path`; a mask clips the blur too.
    const surfaceMask = svgPathMask(shape, box.width, box.height, 0);

    const rootStyle: CSSProperties = {
        width: box.width,
        height: box.height,
        top: side === "top" ? -bh : 0,
        left: side === "left" ? -bh : 0,
    };
    const shadowStyle: CSSProperties = {
        inset: -SHADOW_BLEED,
        maskImage: holeMask,
        WebkitMaskImage: holeMask,
        maskComposite: "exclude",
        WebkitMaskComposite: "xor",
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
    };
    const surfaceStyle: CSSProperties = {
        backgroundColor,
        maskImage: surfaceMask,
        WebkitMaskImage: surfaceMask,
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
    };
    const clip = `path("${shape}")`;

    return (
        <div data-refineui="floating-chrome" aria-hidden className="pointer-events-none absolute -z-1" style={rootStyle}>
            <div className="absolute" style={shadowStyle}>
                <div data-refineui="floating-shadow" className="absolute" style={{ inset: SHADOW_BLEED }}>
                    <div className="absolute inset-0" style={{ clipPath: clip, backgroundColor: borderColor }} />
                </div>
            </div>
            <div data-refineui="floating-surface" className="absolute inset-0" style={surfaceStyle} />
            <svg
                data-refineui="floating-outline"
                className="absolute inset-0 overflow-visible"
                width={box.width}
                height={box.height}
                viewBox={`0 0 ${box.width} ${box.height}`}
                fill="none"
            >
                <path d={outline} stroke={borderColor} strokeWidth={STROKE} strokeLinejoin="round" />
            </svg>
        </div>
    );
}
