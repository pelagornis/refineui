import type { ReactNode } from "react";
import { ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from "@refineui/react";

/**
 * Hydrated island: RefineUI ScrollArea around the server-rendered lines (passed in as
 * static slot HTML, so the tokens are not duplicated into island props). Before it
 * hydrates, global.css keeps the viewport natively scrollable with its bar hidden.
 */
export default function DocsCodeScroll({ children }: { children?: ReactNode }) {
    return (
        <ScrollArea className="docs-code-scroll">
            <ScrollAreaViewport>{children}</ScrollAreaViewport>
            <ScrollAreaScrollbar orientation="horizontal">
                <ScrollAreaThumb />
            </ScrollAreaScrollbar>
        </ScrollArea>
    );
}
