import { iconSizes } from "@refineui/tokens";
import {
    Button,
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
    WebIcon,
} from "@refineui/react";
import { accordionItemOpenClass, contentTypo, triggerTypo } from "../../../packages/react/src/components/Accordion/style";
import { Look, Looks } from "./PreviewFrame";

const card = `flex flex-col rounded-refineui-large border-refineui-hairline border-refineui-alias-border-default ${accordionItemOpenClass} px-refineui-size-large py-refineui-size-small`;

function ToggleGlyph() {
    return (
        <span
            aria-hidden
            className="inline-flex flex-col items-center justify-center"
            style={{ width: iconSizes.xsmall, height: iconSizes.xsmall }}
        >
            <WebIcon name="chevron-up" size={iconSizes.xxsmall} color="currentColor" style={{ marginBottom: -6 }} />
            <WebIcon name="chevron-down" size={iconSizes.xxsmall} color="currentColor" style={{ marginTop: -6 }} />
        </span>
    );
}

export default function CollapsiblePreview() {
    return (
        <Looks>
            <Look>
                <Collapsible
                    defaultOpen
                    className="flex w-full max-w-sm flex-col gap-refineui-size-small text-refineui-alias-foreground-primary"
                    style={{ width: 350 }}
                >
                    <div className="flex items-center justify-between gap-refineui-size-large px-refineui-size-large">
                        <h4 className={triggerTypo.md}>Order #4189</h4>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" layout="icon" size="sm" aria-label="Toggle details">
                                <ToggleGlyph />
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                    <div className={`${card} flex-row items-center justify-between`}>
                        <span className={`${contentTypo.md} text-refineui-alias-foreground-secondary`}>Status</span>
                        <span className={contentTypo.md}>Shipped</span>
                    </div>
                    <CollapsibleContent>
                        <div className="flex flex-col gap-refineui-size-small">
                            <div className={card}>
                                <p className={contentTypo.md}>Shipping address</p>
                                <p className={`${contentTypo.md} text-refineui-alias-foreground-tertiary`}>
                                    100 Market St, San Francisco
                                </p>
                            </div>
                            <div className={card}>
                                <p className={contentTypo.md}>Items</p>
                                <p className={`${contentTypo.md} text-refineui-alias-foreground-tertiary`}>
                                    2x Studio Headphones
                                </p>
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </Look>
        </Looks>
    );
}
