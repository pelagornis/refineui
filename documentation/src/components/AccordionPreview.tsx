import { spacings } from "@refineui/tokens";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function AccordionPreview() {
  return (
    <PreviewFrame>
      <div style={{ width: "100%", maxWidth: 760 }}>
        <Accordion type="single" collapsible defaultValue="returns">
          <AccordionItem value="shipping">
            <AccordionTrigger>What are your shipping options?</AccordionTrigger>
            <AccordionContent>
              We offer standard (5-7 days), express (2-3 days), and overnight shipping.
              Free shipping on international orders.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="returns">
            <AccordionTrigger>What is your return policy?</AccordionTrigger>
            <AccordionContent>
              Returns accepted within 30 days. Items must be unused and in original
              packaging. Refunds processed within 5-7 business days.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="support">
            <AccordionTrigger>How can I contact customer support?</AccordionTrigger>
            <AccordionContent>
              Reach us via email, live chat, or phone. We respond within 24 hours
              during business days.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div style={{ height: spacings.sizeLarge }} />

        <Accordion type="multiple" defaultValue={["faq"]} size="sm">
          <AccordionItem value="faq" icon="info">
            <AccordionTrigger>FAQ (multiple + icon)</AccordionTrigger>
            <AccordionContent>
              In `type="multiple"` mode you can open several items at once.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="tips" icon="settings">
            <AccordionTrigger>Tips</AccordionTrigger>
            <AccordionContent>You can set size to sm / md / lg when needed.</AccordionContent>
          </AccordionItem>
        </Accordion>

        <div style={{ height: spacings.sizeLarge }} />

        <Accordion type="single" collapsible size="lg">
          <AccordionItem value="lg-a" icon="info">
            <AccordionTrigger>Large size accordion</AccordionTrigger>
            <AccordionContent>
              Size `lg` uses SubTitle1 for the trigger and Body1 for content, with
              medium icons.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="lg-b">
            <AccordionTrigger>Another large item</AccordionTrigger>
            <AccordionContent>Content stays secondary for hierarchy.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </PreviewFrame>
  );
}
