import type { HTMLAttributes } from "react";
import { useContext, useId } from "react";
import { AccordionContext, AccordionItemContext } from "./context";

export interface AccordionItemSlotProps extends HTMLAttributes<HTMLDivElement> {
    value: string;
    icon?: string;
}

export function AccordionItem({ value, icon, className, children, ...props }: AccordionItemSlotProps) {
    const accordion = useContext(AccordionContext);
    if (!accordion) throw new Error("AccordionItem must be used within Accordion.");
    const uid = useId().replace(/:/g, "");
    const triggerId = `accordion-trigger-${uid}-${value}`;
    const panelId = `accordion-panel-${uid}-${value}`;

    return (
        <AccordionItemContext.Provider
            value={{ value, open: accordion.isOpen(value), triggerId, panelId, icon }}
        >
            <div className={className} {...props}>
                {children}
            </div>
        </AccordionItemContext.Provider>
    );
}

