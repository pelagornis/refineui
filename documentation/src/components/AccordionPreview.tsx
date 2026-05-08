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
        <Accordion type="single" collapsible defaultValue="shipping">
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
              `type="multiple"` 모드에서는 여러 항목을 동시에 열 수 있습니다.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="tips" icon="settings">
            <AccordionTrigger>Tips</AccordionTrigger>
            <AccordionContent>필요하면 size도 sm / md / lg로 조절할 수 있습니다.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </PreviewFrame>
  );
}
