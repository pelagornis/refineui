import { clsx } from "clsx";
import { forwardRef, type Ref } from "react";
import {
    ScrollArea,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport,
} from "./ScrollArea";
import type { ScrollAreaProps, ScrollAreaType } from "./types";

export type ScrollAreaRegionProps = Omit<ScrollAreaProps, "type"> & {
    type?: ScrollAreaType;
    viewportClassName?: string;
    viewportRef?: Ref<HTMLDivElement>;
};

/** Internal composed vertical ScrollArea — shared by Select, Dropdown, Dialog, Drawer. */
export const ScrollAreaRegion = forwardRef<HTMLDivElement, ScrollAreaRegionProps>(
    function ScrollAreaRegion(
        { type = "hover", className, viewportClassName, viewportRef, children, ...rootProps },
        ref,
    ) {
        return (
            <ScrollArea
                ref={ref}
                type={type}
                className={clsx("min-h-0 min-w-0 flex-1", className)}
                {...rootProps}
            >
                <ScrollAreaViewport ref={viewportRef} className={viewportClassName}>
                    {children}
                </ScrollAreaViewport>
                <ScrollAreaScrollbar orientation="vertical">
                    <ScrollAreaThumb />
                </ScrollAreaScrollbar>
            </ScrollArea>
        );
    },
);
