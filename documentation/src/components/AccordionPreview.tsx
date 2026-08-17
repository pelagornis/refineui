import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function AccordionPreview() {
    return (
        <Looks>
            <Look align="stretch">
                <Accordion type="single" collapsible defaultValue="returns" className="w-full">
                    <AccordionItem value="shipping">
                        <AccordionTrigger>What are your shipping options?</AccordionTrigger>
                        <AccordionContent>
                            Standard (5–7 days), express (2–3 days), and overnight.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="returns">
                        <AccordionTrigger>What is your return policy?</AccordionTrigger>
                        <AccordionContent>
                            Returns within 30 days. Refunds in 5–7 business days.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="support">
                        <AccordionTrigger>How can I contact support?</AccordionTrigger>
                        <AccordionContent>Email, live chat, or phone within 24 hours.</AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Look>
        </Looks>
    );
}
