import { clsx } from "clsx";
import type { CSSProperties, HTMLAttributes } from "react";
import { useContext } from "react";
import {
    AccordionContext,
    AccordionItemContext,
    PANEL_CONTENT_EASE,
    PANEL_CONTENT_MS,
    PANEL_HEIGHT_EASE,
    PANEL_HEIGHT_MS,
} from "./context";
import { accordionStyles, contentTypo } from "./style";

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {}

export function AccordionContent({ className, children, ...props }: AccordionContentProps) {
    const accordion = useContext(AccordionContext);
    const item = useContext(AccordionItemContext);
    if (!accordion || !item) throw new Error("AccordionContent must be used within AccordionItem.");

    const gridStyle: CSSProperties = {
        display: "grid",
        gridTemplateRows: item.open ? "1fr" : "0fr",
        transition: accordion.reduceMotion
            ? undefined
            : `grid-template-rows ${PANEL_HEIGHT_MS}s ${PANEL_HEIGHT_EASE}`,
    };
    const innerMotionStyle: CSSProperties = {
        opacity: item.open ? 1 : 0,
        transform: item.open
            ? "translate3d(0, 0, 0)"
            : "translate3d(0, calc(-1 * var(--refineui-spacing-size-x-small)), 0)",
        transition: accordion.reduceMotion
            ? undefined
            : `opacity ${PANEL_CONTENT_MS}s ${PANEL_CONTENT_EASE}, transform ${PANEL_CONTENT_MS}s ${PANEL_CONTENT_EASE}`,
        pointerEvents: item.open ? undefined : "none",
    };

    return (
        <div
            id={item.panelId}
            role="region"
            aria-labelledby={item.triggerId}
            aria-hidden={!item.open}
            data-refineui="accordion-panel"
            style={gridStyle}
        >
            <div className={accordionStyles.panelOuter}>
                <div className={accordionStyles.panelPad} style={innerMotionStyle}>
                    <div
                        data-refineui="accordion-content"
                        className={clsx(
                            accordionStyles.panelBody,
                            contentTypo[accordion.size],
                            className,
                        )}
                        {...props}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
