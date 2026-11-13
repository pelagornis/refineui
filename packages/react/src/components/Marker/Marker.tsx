import { clsx } from "clsx";
import { createContext, useContext } from "react";
import { markerContentVariantClass, markerStyles } from "./style";
import type { MarkerContentProps, MarkerIconProps, MarkerProps, MarkerVariant } from "./types";

const MarkerContext = createContext<MarkerVariant | null>(null);

function useMarkerVariant(component: string): MarkerVariant {
    const variant = useContext(MarkerContext);
    if (!variant) throw new Error(`${component} must be used within Marker.`);
    return variant;
}

/** Compact conversation event or labeled divider. */
export function Marker({ variant = "default", className, ...props }: MarkerProps) {
    return (
        <MarkerContext.Provider value={variant}>
            <div
                data-refineui="marker"
                data-variant={variant}
                className={clsx(markerStyles.root, className)}
                {...props}
            />
        </MarkerContext.Provider>
    );
}

/** Optional icon slot. Compose with WebIcon, Spinner, or another compact indicator. */
export function MarkerIcon({ className, ...props }: MarkerIconProps) {
    return <span data-refineui="marker-icon" className={clsx(markerStyles.icon, className)} {...props} />;
}

/** Marker label. Divider markers automatically render divider lines around this content. */
export function MarkerContent({ className, ...props }: MarkerContentProps) {
    const variant = useMarkerVariant("MarkerContent");
    return (
        <span
            data-refineui="marker-content"
            className={clsx(markerContentVariantClass[variant], className)}
            {...props}
        />
    );
}
